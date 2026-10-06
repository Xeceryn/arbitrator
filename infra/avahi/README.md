# Publishing the subdomains over mDNS (avahi)

`avahi-daemon` publishes only the host's own name, `<computer-hostname>.local`.
It does **not** publish subdomains, so
`arbitrator.<computer-hostname>.local` and
`rabbitmq.<computer-hostname>.local` are unknown to mDNS clients until they are
published as extra address records.

`publish-aliases.sh` does that, and `arbitrator-aliases.service` keeps it
running.

## Install (user service, no root)

```bash
cd /home/sulthonuladib/work/arbitrator
mkdir -p ~/.config/systemd/user
cp infra/avahi/arbitrator-aliases.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now arbitrator-aliases

# keep it running when you are not logged in (this is a server for the LAN)
loginctl enable-linger "$USER"
```

Adjust the `ExecStart=` path in the unit if your repo is not at
`~/work/arbitrator` (`%h` expands to your home directory).

## Verify

```bash
systemctl --user status arbitrator-aliases
avahi-resolve -n arbitrator.$(hostname).local    # -> <LAN IP>
avahi-resolve -n rabbitmq.$(hostname).local      # -> <LAN IP>
```

## Switching networks

The published aliases point at the LAN IP read when the publisher started, so a
network change or DHCP lease change would normally leave them advertising a
stale address. `publish-aliases.sh` now watches for this: every
`WATCH_INTERVAL` seconds (default `10`) it re-checks the LAN IP and
re-publishes if it changed, and it restarts any publisher that exited (e.g.
after an avahi restart). So switching networks self-heals — nothing to run.

Caveats that the publisher cannot fix:

- Name resolution still needs the network to allow multicast mDNS. Guest or
  corporate Wi-Fi with client isolation / blocked multicast will not resolve
  the names at all (this is true of `falcon.local` too).
- `<computer-hostname>.local` (avahi's own hostname) always tracks the
  interface IP; only the extra aliases needed the publisher.
- The certificate is name-based, so an IP change never requires regenerating
  it — unless you also want to reach the host by its raw IP, since only the old
  IP is in the SAN.
- If you went the `/etc/hosts` route with a hard-coded IP instead, that entry
  **does** break on every IP change — another reason to prefer mDNS aliases.

## Linux clients: nss-mdns only resolves 2-label `.local`

nss-mdns hardcodes `label_count(name) == 2` for `.local` names (see
`verify_name_allowed` in `src/util.c`), so `arbitrator.<host>.local` fails even
though the record is published and avahi answers multicast for it. Two fixes:

- **Per-host `/etc/hosts` entry** (blunt, per name):

  ```bash
  printf '127.0.0.1 arbitrator.%s.local rabbitmq.%s.local\n' "$(hostname)" "$(hostname)" \
    | sudo tee -a /etc/hosts
  ```

- **Allow the domain via nss-mdns** (no per-name entries):

  1. Use the full `mdns` module (not `mdns_minimal`) in `/etc/nsswitch.conf`:

     ```
     hosts: mymachines mdns [NOTFOUND=return] resolve files myhostname dns
     ```

  2. Create `/etc/mdns.allow` with your base domain (one per line, leading dot
     optional, `*` allows everything):

     ```
     <computer-hostname>.local
     ```

  The allow file is read only by the non-minimal `mdns` module — that is why
  step 1 is required and `mdns` alone changes nothing. Lookups read it fresh,
  so no restart is needed.

The server host itself needs one of these too, because nginx's apex redirects
to `arbitrator.<host>.local` — if that name cannot resolve, the redirect dead-ends.

## Windows / macOS / iOS clients

These resolve multi-label `.local` names with their native mDNS stack
(Bonjour / Dnscache), so once the aliases are published they usually work with
no client config. If a Windows box does not:

```bat
:: C:\Windows\System32\drivers\etc\hosts  (Administrator)
192.168.110.43  arbitrator.<computer-hostname>.local rabbitmq.<computer-hostname>.local
```

## Alternative: dnsmasq instead of mDNS

If you would rather not depend on multicast mDNS, run `dnsmasq` with a wildcard
and point clients at it (see the dnsmasq section in `../nginx/README.md`). That
supports unlimited subdomains on every client, at the cost of configuring the
client's or router's DNS.
