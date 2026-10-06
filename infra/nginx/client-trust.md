# Installing the certificate on a client

nginx serves `https://<computer-hostname>.local` with a certificate signed by
**your local mkcert CA**. `<computer-hostname>` is whatever `hostname` prints on
the nginx host (e.g. `hostname` returns `myhost`, so clients use
`myhost.local`; it is also exported as `$MDNS_NAME`).
Every client — browser, phone, API client, CI job — must trust that CA once, or
it will see a security warning (or refuse to connect).

> Trust the **CA**, not the leaf certificate. The leaf is regenerated every time
> `scripts/local-certs.sh` runs; the CA is stable. Distributing the CA means
> clients keep working across regenerations. Never distribute `privkey.pem`.

## 1. Export the CA to a file you can hand out

The mkcert CA lives in `$(mkcert -CAROOT)/rootCA.pem` (`~/.local/share/mkcert`
on this machine). Export a copy:

```bash
cd /home/sulthonuladib/work/arbitrator
cp "$(mkcert -CAROOT)/rootCA.pem" infra/certs/arbitrator-local-ca.crt
```

`infra/certs/*` is gitignored, so this never gets committed. The `.crt`
extension is just so Windows/Android open it happily; it is still PEM.

Confirm what you are about to distribute:

```bash
openssl x509 -in infra/certs/arbitrator-local-ca.crt -noout \
  -subject -serial -fingerprint -sha256
```

Write the fingerprint down. A cautious client can compare it against its own
copy before trusting — that is the whole security model of a private CA.

### If the client does certificate pinning

Instead of (or in addition to) the CA, hand over the leaf and its public-key
pin:

```bash
openssl x509 -in infra/certs/fullchain.pem -noout -pubkey \
  | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | openssl base64
```

Pin the **SPKI** (as above), never the whole-cert fingerprint — the SPKI
survives re-issues from the same key, the certificate fingerprint does not.

## 2. Install it per platform

### Linux (system trust store)

```bash
# Debian / Ubuntu
sudo cp infra/certs/arbitrator-local-ca.crt /usr/local/share/ca-certificates/arbitrator-local-ca.crt
sudo update-ca-certificates

# Arch / Omarchy (adds to /etc/ca-certificates/trust-source/anchors)
sudo trust anchor --store infra/certs/arbitrator-local-ca.crt
# or: sudo cp infra/certs/arbitrator-local-ca.crt /etc/ca-certificates/trust-source/anchors/ && sudo update-ca-trust

# Fedora / RHEL
sudo cp infra/certs/arbitrator-local-ca.crt /etc/pki/ca-trust/source/anchors/
sudo update-ca-trust
```

Chrome/Chromium on Linux may use the NSS store instead of the system store:

```bash
certutil -d sql:"$HOME/.pki/nssdb" -A -t "C,," \
  -n "arbitrator local CA" -i infra/certs/arbitrator-local-ca.crt
```

(`certutil` comes from `nss`/`libnss3-tools`. `mkcert -install` does all of
this automatically on the machine that ran the script.)

### macOS

```bash
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain infra/certs/arbitrator-local-ca.crt
```

Or Keychain Access → System → drag the `.crt` in → double-click → Trust →
"Always Trust". Safari, Chrome and Edge use the system store; Firefox has its
own (below).

### Windows

GUI: double-click the `.crt` → **Install Certificate** → **Local Machine** →
**Place all certificates in the following store** → **Trusted Root
Certification Authorities** → Finish.

CLI (elevated PowerShell/cmd):

```bat
:: all users
certutil -addstore -f "ROOT" arbitrator-local-ca.crt
:: current user only
certutil -user -addstore Root arbitrator-local-ca.crt
```

Chrome and Edge use the Windows store. Firefox is separate.

### Firefox (any OS)

Firefox keeps its own trust store:

Settings → Privacy & Security → Certificates → **View Certificates** →
**Authorities** → **Import…** → pick the `.crt` → tick **"Trust this CA to
identify websites"**.

### iOS / iPadOS

1. Get the file onto the device (AirDrop, email, or a local web server).
2. Tap it → **Profile Downloaded** → Settings → **General → VPN & Device
   Management** → install the profile.
3. **Required extra step:** Settings → **General → About → Certificate Trust
   Settings** → enable full trust for the CA. Without this it stays untrusted.
4. Safari and most apps will now accept `https://<computer-hostname>.local`.

### Android

1. Copy the `.crt` to the device.
2. Settings → **Security → Encryption & credentials** (name varies by OEM) →
   **Install a certificate → CA certificate** → pick the file → accept the
   warning.

**Important limitation:** since Android 7, *apps* do not trust user-installed
CAs by default — only the system store. Chrome and other browsers do trust
user CAs for browsing. For a native app you either:

- add a debug `network_security_config.xml` that includes the user store:

  ```xml
  <network-security-config>
    <base-config>
      <trust-anchors>
        <certificates src="system" />
        <certificates src="user" />
      </trust-anchors>
    </base-config>
  </network-security-config>
  ```

- or install the CA into the system store on a rooted/emulator device.

## 3. Runtime / language trust (no OS install needed)

Useful for CI and throwaway clients. Point the runtime at the CA file directly.

| Runtime / tool | Setting |
| -------------- | ------- |
| Node.js | `NODE_EXTRA_CA_CERTS=/abs/path/arbitrator-local-ca.crt node app.js` (read at startup) |
| Bun | `NODE_EXTRA_CA_CERTS=/abs/path/arbitrator-local-ca.crt bun run app.ts` |
| Deno | `DENO_CERT=/abs/path/arbitrator-local-ca.crt deno run …` or `--cert` |
| curl | `curl --cacert /abs/path/arbitrator-local-ca.crt https://<computer-hostname>.local` (or `CURL_CA_BUNDLE`) |
| Python (requests) | `REQUESTS_CA_BUNDLE=/abs/path/arbitrator-local-ca.crt python app.py` |
| Python (ssl) | `SSL_CERT_FILE=/abs/path/arbitrator-local-ca.crt python app.py` |
| Go | `SSL_CERT_FILE=/abs/path/arbitrator-local-ca.crt go run .` |
| Git | `git config --global http.sslCAInfo /abs/path/arbitrator-local-ca.crt` |
| Java | `keytool -importcert -alias arbitrator-local-ca -cacerts -file arbitrator-local-ca.crt` |
| .NET | `SSL_CERT_FILE=/abs/path/arbitrator-local-ca.crt` or import into the OS store |
| Postman | Settings → Certificates → **CA Certificates** → add the `.crt` |
| Docker container | mount the file and run `update-ca-certificates`, or set `NODE_EXTRA_CA_CERTS` |

## 4. Verify

```bash
# From the client, trusting only the exported CA:
curl --cacert /path/to/arbitrator-local-ca.crt -v https://<computer-hostname>.local

# What nginx is presenting:
openssl s_client -connect <computer-hostname>.local:443 \
  -servername <computer-hostname>.local </dev/null \
  | openssl x509 -noout -issuer -subject -ext subjectAltName
```

A healthy result: no `certificate verify failed`, issuer is
`mkcert <user>@<computer-hostname>`, and `<computer-hostname>.local` appears in
the SAN.

## Troubleshooting

| Symptom | Cause |
| ------- | ----- |
| Browser still warns, curl works | Firefox has its own store — import there too. |
| Only Android native app rejects it | User CA is not trusted by apps; see `network_security_config.xml`. |
| `NET::ERR_CERT_AUTHORITY_INVALID` after re-running the script | nginx not reloaded: `docker compose restart nginx`. |
| Name `a.b.<computer-hostname>.local` fails | X.509 wildcards are one level deep; add the name to `LOCAL_DOMAIN` and re-run the script. |
| Worked, then broke after `mkcert -uninstall` / new `CAROOT` | The CA changed; re-export and re-install on every client. |
| Client on guest/corporate Wi-Fi can't resolve `<computer-hostname>.local` | Multicast mDNS is blocked; use `/etc/hosts` or the dnsmasq path in `README.md`. |
