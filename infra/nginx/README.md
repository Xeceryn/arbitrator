# nginx TLS reverse proxy for @arbitrator/ui (local development)

nginx terminates TLS and proxies the UI dev server, which keeps running on the
host at `http://localhost:3000` (`bun run --watch src/main.ts`). Nothing in the
app changes — you just visit `https://<hostname>.local/` instead.

There is a **single hostname** (the machine's own mDNS name, `falcon.local`
here) and **no subdomains**. Any additional service is mounted as a path prefix
on that host, so there is no wildcard DNS, cert SAN or alias publisher to keep
in sync.

```
client ──https──▶ nginx :443 ──▶ bun dev server :3000
```

## Quick start

```bash
# 1. Install mkcert (once)
sudo pacman -S mkcert nss

# 2. Generate the cert for <hostname>.local
./scripts/local-certs.sh

# 3. Start nginx
docker compose up -d nginx
```

Then run the UI as usual (`bun run dev` in `apps/ui`) and open
`https://$(hostname).local/` — on this machine that is
**`https://falcon.local/`**. `avahi-daemon` already publishes
`<hostname>.local`, so LAN clients need no DNS config (see
[../avahi/README.md](../avahi/README.md)).

Finally, trust the CA on each client that should see it as secure — see
[client-trust.md](./client-trust.md).

## Adding another service

Because routing is path-based, add an `upstream` and a `location` block to
`infra/nginx/templates/default.conf.template`, for example:

```nginx
upstream lister_upstream {
    server lister:3001;
}

# inside the `listen 443 ssl` server block:
location /api/lister/ {
    proxy_pass http://lister_upstream/;
}
```

No new DNS name, certificate SAN or mDNS alias is required — the path lives on
the one existing hostname.

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

If your client needs a _publicly trusted_ certificate (no CA import), you must
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

The default is the host's own mDNS name, which already resolves over multicast
DNS to every LAN client — nothing to configure. To override it, set
`LOCAL_DOMAIN` in `.envrc` (nginx reads it via
`NGINX_ENVSUBST_FILTER`) and add it to the certificate SAN.

### Single host (`/etc/hosts`), if mDNS is unavailable

```bash
echo "127.0.0.1 $(hostname).local" | sudo tee -a /etc/hosts
```

### LAN devices

Use the machine's LAN IP instead of `127.0.0.1` (and make sure ports 80/443
are reachable):

```bash
ip route get 1.1.1.1 | awk '{print $7; exit}'   # shows your LAN IP
```

> Multicast mDNS must be allowed on the network; some corporate/guest Wi-Fi
> drops it. When it is blocked, point clients at the LAN IP directly.

## Configuration

All overridable via environment (see `.envrc`):

| Variable           | Default                     | Purpose                                     |
| ------------------ | --------------------------- | ------------------------------------------- |
| `LOCAL_DOMAIN`     | `$(hostname).local`         | The single vhost (`server_name`) + cert SAN |
| `UI_UPSTREAM`      | `host.docker.internal:3000` | Where the UI dev server listens             |
| `NGINX_HTTP_PORT`  | `80`                        | Published HTTP port (redirects)             |
| `NGINX_HTTPS_PORT` | `443`                       | Published HTTPS port                        |

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
cd /home/sulthonuladib/personal/arbitrator
cp "$(mkcert -CAROOT)/rootCA.pem" infra/certs/arbitrator-local-ca.crt

# this host, Arch/Omarchy
sudo trust anchor --store infra/certs/arbitrator-local-ca.crt

# no OS install needed for a single runtime
curl --cacert infra/certs/arbitrator-local-ca.crt https://$(hostname).local
NODE_EXTRA_CA_CERTS="$PWD/infra/certs/arbitrator-local-ca.crt" node app.js
```

Trust the **CA**, not the leaf: the leaf is regenerated by
`scripts/local-certs.sh`, the CA is stable, so clients survive re-issues.
