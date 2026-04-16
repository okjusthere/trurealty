#!/bin/bash
set -euo pipefail

# Ensure database directory exists (for Railway volume at /data)
db_uri="${DATABASE_URI:-file:./trurealty.db}"

if [[ "$db_uri" == file:* ]]; then
  db_path="${db_uri#file:}"
  db_dir="$(dirname "$db_path")"
  echo "📁 Ensuring DB directory: $db_dir"
  mkdir -p "$db_dir"
fi

# Start Next.js — Payload auto-creates tables on first connect
echo "🚀 Starting on port ${PORT:-3000}..."
exec npx next start -p "${PORT:-3000}"
