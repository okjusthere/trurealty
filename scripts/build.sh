#!/bin/bash
# Build script for Railway deployment
# During build, volumes aren't mounted, so we use a temporary local SQLite DB

# If DATABASE_URI points to /data (Railway volume), override with temp file for build
if [[ "$DATABASE_URI" == *"/data/"* ]] || [[ -z "$DATABASE_URI" ]]; then
  echo "🔧 Build: using temporary SQLite database"
  export DATABASE_URI="file:./payload-build.db"
fi

# Run Next.js build
npx next build

# Clean up temp db
rm -f ./payload-build.db ./payload-build.db-journal ./payload-build.db-wal
echo "✅ Build complete, temp DB cleaned up"
