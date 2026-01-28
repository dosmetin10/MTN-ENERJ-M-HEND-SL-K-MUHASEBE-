#!/usr/bin/env bash
set -euo pipefail
OUTDIR="${1:-/var/backups/mtn_erp}"
DB="${2:-mtn_erp}"
HOST="${3:-localhost}"
PORT="${4:-5432}"
USER="${5:-postgres}"

mkdir -p "$OUTDIR"
TS="$(date +%F_%H-%M)"
DUMP="$OUTDIR/MTN_ERP_${TS}.dump"
SHA="$DUMP.sha256"

PGPASSWORD="${PGPASSWORD:-}" pg_dump -h "$HOST" -p "$PORT" -U "$USER" -F c -f "$DUMP" "$DB"
sha256sum "$DUMP" > "$SHA"
echo "$(date -u +"%Y-%m-%d %H:%M:%SZ") OK $DUMP $(cut -d' ' -f1 "$SHA")" >> "$OUTDIR/backup.log"
echo "$DUMP"
