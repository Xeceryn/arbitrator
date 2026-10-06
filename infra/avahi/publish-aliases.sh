#!/usr/bin/env bash
# Publish mDNS aliases for the local subdomains so LAN clients (Windows,
# macOS, iOS, ...) can resolve them.
#
# avahi only publishes the host's own name (<host>.local) by default. This
# publishes the extra aliases and keeps them in sync: when the LAN IP changes
# (network switch, DHCP lease change) or a publisher dies (avahi restart), it
# re-publishes automatically. Run it under a systemd user unit -- see
# infra/avahi/README.md.
set -euo pipefail

MDNS_NAME="${MDNS_NAME:-$(hostname).local}"
UI_DOMAIN="${UI_DOMAIN:-arbitrator.${MDNS_NAME}}"
RABBITMQ_DOMAIN="${RABBITMQ_DOMAIN:-rabbitmq.${MDNS_NAME}}"
WATCH_INTERVAL="${WATCH_INTERVAL:-10}"
ALIASES=("${UI_DOMAIN}" "${RABBITMQ_DOMAIN}")

command -v avahi-publish-address >/dev/null 2>&1 || {
  echo "avahi-publish-address not found (install avahi)" >&2
  exit 1
}

# Best-effort LAN IP: default route source, else any global IPv4 that is not a
# container/bridge address.
detect_lan_ip() {
  local ip=""
  ip="$(ip -4 route get 1.1.1.1 2>/dev/null \
        | awk '{for (i=1;i<=NF;i++) if ($i=="src") {print $(i+1); exit}}')"
  if [[ -z "$ip" ]]; then
    ip="$(ip -4 route show default 2>/dev/null \
          | awk '{for (i=1;i<=NF;i++) if ($i=="src") {print $(i+1); exit}}')"
  fi
  if [[ -z "$ip" ]]; then
    ip="$(ip -4 -o addr show scope global 2>/dev/null \
          | awk '!/docker|br-|veth|virbr/{print $4}' | cut -d/ -f1 | head -1)"
  fi
  printf '%s' "$ip"
}

pids=()
publish() {
  local ip="$1" name
  pids=()
  for name in "${ALIASES[@]}"; do
    avahi-publish-address -R "${name}" "${ip}" &
    pids+=("$!")
  done
}

stop_publishers() {
  [[ ${#pids[@]} -eq 0 ]] && return 0
  kill "${pids[@]}" 2>/dev/null || true
  wait "${pids[@]}" 2>/dev/null || true
  pids=()
}

current_ip="$(detect_lan_ip)"
if [[ -z "$current_ip" ]]; then
  echo "No global IPv4 address found yet; waiting for a network..." >&2
else
  echo "Publishing mDNS aliases -> ${current_ip}: ${ALIASES[*]}"
  publish "$current_ip"
fi

while sleep "${WATCH_INTERVAL}"; do
  new_ip="$(detect_lan_ip)"

  if [[ -n "$new_ip" && "$new_ip" != "$current_ip" ]]; then
    echo "LAN IP changed: ${current_ip:-<none>} -> ${new_ip}; re-publishing"
    stop_publishers
    current_ip="$new_ip"
    publish "$current_ip"
    continue
  fi

  # If a publisher died (e.g. avahi restarted), bring the set back up.
  if [[ ${#pids[@]} -gt 0 ]]; then
    for pid in "${pids[@]}"; do
      if ! kill -0 "$pid" 2>/dev/null; then
        echo "A publisher exited; re-publishing on ${current_ip}"
        stop_publishers
        publish "$current_ip"
        break
      fi
    done
  elif [[ -n "$current_ip" ]]; then
    publish "$current_ip"
  fi
done
