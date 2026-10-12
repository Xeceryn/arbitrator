# mDNS / avahi

There is nothing to publish here. The reverse proxy serves a single hostname —
this machine's own mDNS name, `<hostname>.local` (currently `falcon.local`) —
which `avahi-daemon` publishes natively.

Subdomain aliases (`arbitrator.<hostname>.local`, `rabbitmq.<hostname>.local`)
and the publisher that kept them alive have been removed. Because there are no
subdomains, LAN clients need no extra address records, no `/etc/mdns.allow` and
no `/etc/hosts` entries.

## Verify

```bash
avahi-resolve -n "$(hostname).local"   # -> <LAN IP>
```

If that resolves, clients can reach `https://$(hostname).local/` with no DNS
configuration. The only requirement left is trusting the local mkcert CA — see
[../nginx/client-trust.md](../nginx/client-trust.md).

## Caveats

- Name resolution still requires multicast mDNS to be allowed on the network.
  Guest or corporate Wi-Fi with client isolation / blocked multicast will not
  resolve the name on other devices; fall back to this machine's LAN IP.
- The host address always tracks the interface IP, so switching networks needs
  no action.
