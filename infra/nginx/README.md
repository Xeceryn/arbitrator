# nginx TLS reverse proxy for @arbitrator/ui (local development)

nginx terminates TLS and proxies the UI dev server, which keeps running on the
host at `http://localhost:3000` (`bun run --watch src/main.ts`), and the
RabbitMQ management UI in its container. Nothing in the app changes — you
just visit the hostnames below instead.

```
                            ┌─▶ bun dev server :3000   arbitrator.<computer-hostname>.local
client ──https──▶ nginx :443 ┤
                            └─▶ rabbitmq:15672        rabbitmq.<computer-hostname>.local

<computer-hostname>.local  ──301──▶  arbitrator.<computer-hostname>.local
```

## Quick start

```bash
# 1. Install mkcert (once)
sudo pacman -S mkcert nss

# 2. Generate the cert (UI + RabbitMQ + apex names, plus LAN IP)
./scripts/local-certs.sh

# 3. Start nginx (starts rabbitmq too, since it is the proxy upstream)
docker compose up -d nginx
```

Then run the UI as usual (`bun run dev` in `apps/ui`) and open — replace
`<computer-hostname>` with the output of `hostname`:

| URL                                                    | Goes to                              |
| ------------------------------------------------------ | ------------------------------------ |
| `https://arbitrator.<computer-hostname>.local`          | UI dev server (`:3000`)              |
| `https://rabbitmq.<computer-hostname>.local`            | RabbitMQ management UI (`:15672`)    |
| `https://<computer-hostname>.local`                     | 301 → `arbitrator.<computer-hostname>.local` |
| `https://arbitrator.test`                               | UI (extra alias; needs `/etc/hosts`)  |

Except for `arbitrator.test`, these names resolve over mDNS once the alias
publisher is installed (see [../avahi/README.md](../avahi/README.md)), so LAN
clients need no DNS config. Finally, trust the CA on each client that should see
it as secure — see [client-trust.md](./client-trust.md).

## About "Let's Encrypt" for local development

Let's Encrypt is a **public** CA. It will not issue a certificate for:

- `localhost` or `127.0.0.1`
- reserved/non-public TLDs such as `*.local`, `*.test`, `*.internal`
- a bare IP address

So there are two realistic options. Use whichever matches your client.

### Option A — mkcert (recommended for local dev)

`mkcert` creates a private CA, installs it into your machine's trust store, and
signs the leaf certificate. Nginx sees ordinary `.pem` files, so no config
changes are needed. Clients (mobile app, another machine, Postman, …) must
import the root CA once:

```bash
# Prints the CA file clients need to trust:
mkcert -CAROOT        # -> .../rootCA.pem
```

Run `./scripts/local-certs.sh` to generate the certs into `infra/certs/`.

### Option B — Let's Encrypt on a real domain (DNS-01)

If your client needs a *publicly trusted* certificate (no CA import), you must
use a domain you actually own, e.g. `dev.example.com`. DNS-01 validation works
even if the domain resolves to a private/LAN IP:

1. Point an `A` (or `AAAA`) record for `dev.example.com` at this machine's
   address — `127.0.0.1` for only this host, or the LAN IP so other devices
   can reach it.
2. Issue the cert:

   ```bash
   ./scripts/letsencrypt-cert.sh dev.example.com you@example.com
   ```

   This runs certbot's manual DNS-01 flow (you add a `_acme-challenge` TXT
   record when prompted). To automate renewal, install a certbot DNS plugin
   for your provider (`python-certbot-dns-cloudflare`, `dns-route53`, …) and
   replace `--manual` with `--dns-<provider> --dns-<provider>-credentials …`.

3. Because LE is publicly trusted, clients need **no** CA import. Certs
   expire every 90 days — automate renewal with
   `certbot renew --deploy-hook './scripts/...'` or a cron/systemd timer that
   copies the files into `infra/certs/` and runs `docker compose restart nginx`.

## Local domain setup

Pick a name and make it resolve to this machine.

### Single host (`/etc/hosts`)

```bash
echo "127.0.0.1 arbitrator.test" | sudo tee -a /etc/hosts
```

### LAN devices with mDNS / avahi (no router, no dnsmasq)

The host already runs `avahi-daemon`, which publishes
`<computer-hostname>.local` over multicast DNS, where `<computer-hostname>` is
the output of `hostname` (also exported as `$MDNS_NAME`).

avahi does **not** publish subdomains by itself, so
`arbitrator.<computer-hostname>.local` and `rabbitmq.<computer-hostname>.local`
must be published as extra mDNS address records first — see
[../avahi/README.md](../avahi/README.md). Once published, LAN clients
(Windows, macOS, iOS) resolve them with no hosts file or router config:

```bash
cp infra/avahi/arbitrator-aliases.service ~/.config/systemd/user/
systemctl --user daemon-reload && systemctl --user enable --now arbitrator-aliases
avahi-resolve -n arbitrator.$(hostname).local   # sanity check
docker compose up -d nginx
```

Linux clients (and this host) additionally need `/etc/mdns.allow` (with the
`mdns` NSS module) or `/etc/hosts` entries, because nss-mdns only resolves
2-label `.local` names by default — details in
[../avahi/README.md](../avahi/README.md).

`.envrc` derives `UI_DOMAIN`, `RABBITMQ_DOMAIN` and `MDNS_NAME` from the
hostname; all of them are added to nginx's `server_name`, and
`scripts/local-certs.sh` puts them (plus wildcards) in the certificate SAN.
Requirements:

- Port `443` reachable on the LAN (no host firewall rule needed if `ufw` is
  inactive; otherwise allow it).
- mDNS not blocked by the network — some corporate/guest Wi-Fi drops multicast.
- The client must **trust your CA** (same as any mkcert setup).

> mDNS only resolves this host's own `.local` tree; you cannot invent arbitrary
> domains like `arbitrator.test` this way. Let's Encrypt also cannot issue for
> `.local`, so public trust requires a real domain (DNS-01 above).

### Other devices on the LAN

Use the machine's LAN IP instead of `127.0.0.1` (and make sure ports 80/443
are reachable):

```bash
ip route get 1.1.1.1 | awk '{print $7; exit}'   # shows your LAN IP
```

### Wildcard local domains (`dnsmasq`)

If you want `*.arbitrator.test` to resolve for devices you point at this
machine, install `dnsmasq` and add:

```conf
# /etc/dnsmasq.d/arbitrator.conf
address=/.arbitrator.test/192.168.1.10   # this machine's LAN IP
```

Then make clients use it: set their DNS to the LAN IP manually, or advertise it
via your router's DHCP DNS option (option 6). dnsmasq answers `*.arbitrator.test`
locally and forwards everything else upstream. See the `no-resolv` note if you
also point this host at dnsmasq, to avoid a resolution loop.

> Prefer `.test` (RFC 6761, reserved for testing). `.local` is owned by
> mDNS/avahi — use the mDNS path above for it instead of dnsmasq.

## Configuration

All overridable via environment (see `.envrc`):

| Variable           | Default                        | Purpose                                  |
| ------------------ | ------------------------------ | ---------------------------------------- |
| `LOCAL_DOMAIN`     | `arbitrator.test`              | Extra UI alias + cert SAN                |
| `MDNS_NAME`        | `$(hostname).local`            | Apex name → 301 to `UI_DOMAIN`           |
| `UI_DOMAIN`        | `arbitrator.$(hostname).local` | UI vhost (`server_name`)                 |
| `RABBITMQ_DOMAIN`  | `rabbitmq.$(hostname).local`   | RabbitMQ management vhost                |
| `UI_UPSTREAM`      | `host.docker.internal:3000`    | Where the UI dev server listens          |
| `RABBITMQ_UPSTREAM`| `rabbitmq:15672`               | RabbitMQ management backend              |
| `NGINX_HTTP_PORT`  | `80`                           | Published HTTP port (redirects)          |
| `NGINX_HTTPS_PORT` | `443`                          | Published HTTPS port                     |

## Why the UI stays on 3000

Port `3000` is already used by the UI dev server (and `3001`/`3002` are taken
by lister/sender), so nginx exposes the standard `443`. The dev server is not
changed; nginx is the only TLS entrypoint.

## Trusting the mkcert CA from a client

Every client must trust the mkcert CA once, or HTTPS will warn/refuse. Full
per-platform instructions (Linux, macOS, Windows, iOS, Android, Firefox, plus
Node/Bun/Deno/curl/Java/Postman/Docker and pinning) are in
[client-trust.md](./client-trust.md).

Quick version — export the CA, then install it as a trusted root:

```bash
cd /home/sulthonuladib/work/arbitrator
cp "$(mkcert -CAROOT)/rootCA.pem" infra/certs/arbitrator-local-ca.crt

# this host, Arch/Omarchy
sudo trust anchor --store infra/certs/arbitrator-local-ca.crt

# no OS install needed for a single runtime
curl --cacert infra/certs/arbitrator-local-ca.crt https://<computer-hostname>.local
NODE_EXTRA_CA_CERTS="$PWD/infra/certs/arbitrator-local-ca.crt" node app.js
```

Trust the **CA**, not the leaf: the leaf is regenerated by
`scripts/local-certs.sh`, the CA is stable, so clients survive re-issues.
