#!/usr/bin/env bash
# Issue a real Let's Encrypt certificate with a DNS-01 challenge, then drop it
# into infra/certs/ where nginx expects it.
#
# Requirements:
#   * You own a real domain (e.g. dev.example.com). Let's Encrypt will NOT
#     issue for localhost, *.local, *.test or raw IPs.
#   * A DNS provider you can add TXT records to (this script is manual; swap in
#     the certbot dns-<provider> plugin to automate it -- see the README).
#   * certbot installed:  sudo pacman -S certbot
#
# Usage:
#   ./scripts/letsencrypt-cert.sh dev.example.com you@example.com
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOMAIN="${1:?usage: $0 <domain> <email>}"
EMAIL="${2:?usage: $0 <domain> <email>}"
CERT_DIR="${REPO_ROOT}/infra/certs"
WEBROOT="${REPO_ROOT}/infra/certbot/www"

command -v certbot >/dev/null 2>&1 || {
  echo "certbot is not installed. Try: sudo pacman -S certbot" >&2
  exit 1
}

mkdir -p "${CERT_DIR}" "${WEBROOT}"

certbot certonly \
  --manual \
  --preferred-challenges dns \
  --agree-tos \
  --email "${EMAIL}" \
  --no-eff-email \
  -d "${DOMAIN}"

LIVE="/etc/letsencrypt/live/${DOMAIN}"
cp -f "${LIVE}/fullchain.pem" "${CERT_DIR}/fullchain.pem"
cp -f "${LIVE}/privkey.pem"   "${CERT_DIR}/privkey.pem"

echo
echo "Copied ${DOMAIN} cert into ${CERT_DIR}/."
echo "Restart nginx to pick it up:"
echo "  docker compose restart nginx"
echo
echo "Renewal: rerun this script, or use 'certbot renew' with"
echo "--deploy-hook to copy the new files and reload nginx."
