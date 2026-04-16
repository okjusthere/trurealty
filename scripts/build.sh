#!/bin/bash
set -euo pipefail

# Build script for Railway deployment
# During build, volumes aren't mounted, so we use a temporary local SQLite DB

# If DATABASE_URI points to /data (Railway volume), override with temp file for build
current_db_uri="${DATABASE_URI:-}"

if [[ "$current_db_uri" == *"/data/"* ]] || [[ -z "$current_db_uri" ]]; then
  echo "🔧 Build: using temporary SQLite database"
  export DATABASE_URI="file:./payload-build.db"
fi

cleanup() {
  rm -f ./payload-build.db ./payload-build.db-journal ./payload-build.db-wal
}

trap cleanup EXIT

# Run Next.js build
npx next build

echo "✅ Build complete, temp DB cleaned up"
