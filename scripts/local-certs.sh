#!/usr/bin/env bash
# Generate a locally-trusted certificate for local development using mkcert.
#
# mkcert creates its own local CA, installs it into the system + browser trust
# stores, and signs a leaf certificate covering:
#   * every name in LOCAL_DOMAIN (space/comma separated) + its wildcard
#   * the machine's mDNS name (<hostname>.local), usable by LAN clients
#   * localhost, 127.0.0.1, ::1 and this machine's LAN IP
#
# Let's Encrypt cannot do this for localhost / *.local / *.test / private IPs
# -- see infra/nginx/README.md for the real-domain (DNS-01) alternative.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_DIR="${REPO_ROOT}/infra/certs"
HOSTNAME_LOCAL="$(hostname).local"
# Every hostname nginx may serve: UI, RabbitMQ, the .test alias, and the apex
# mDNS name (whose wildcard also covers the two subdomains).
DOMAINS_RAW="${UI_DOMAIN:-arbitrator.${HOSTNAME_LOCAL}} ${RABBITMQ_DOMAIN:-rabbitmq.${HOSTNAME_LOCAL}} ${LOCAL_DOMAIN:-arbitrator.test}"
MDNS_NAME="${MDNS_NAME:-${HOSTNAME_LOCAL}}"

mkdir -p "${CERT_DIR}"

if ! command -v mkcert >/dev/null 2>&1; then
  echo "mkcert is not installed." >&2
  echo "  Arch/Omarchy:  sudo pacman -S mkcert nss" >&2
  echo "  Debian/Ubuntu: sudo apt install mkcert libnss3-tools" >&2
  echo "  macOS:         brew install mkcert nss" >&2
  exit 1
fi

# Build the SAN list.
read -r -a DOMAINS <<<"${DOMAINS_RAW//,/ }"
SAN=()
for d in "${DOMAINS[@]}" "${MDNS_NAME}"; do
  [[ -z "${d}" ]] && continue
  SAN+=("${d}")
  # Add a wildcard for real DNS names, but never for IPs or bare localhost.
  if [[ "${d}" == *.* && ! "${d}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    SAN+=("*.${d}")
  fi
done
SAN+=(localhost 127.0.0.1 ::1)

LAN_IP="$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}')"
[[ -n "${LAN_IP:-}" ]] && SAN+=("${LAN_IP}")

# Installs the local CA into the system trust store (idempotent).
mkcert -install

mkcert \
  -cert-file "${CERT_DIR}/fullchain.pem" \
  -key-file  "${CERT_DIR}/privkey.pem" \
  "${SAN[@]}"

echo
echo "Certificate written to ${CERT_DIR}/ for:"
printf '  - %s\n' "${SAN[@]}"
echo
echo "Local CA root (share this with clients that need to trust you):"
echo "  $(mkcert -CAROOT)/rootCA.pem"
