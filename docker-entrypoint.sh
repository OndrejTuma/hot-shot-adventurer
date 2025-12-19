#!/bin/sh
set -e

# Fix permissions for data directory if it exists and we're root
if [ -d "/app/data" ] && [ "$(id -u)" = "0" ]; then
  chown -R nextjs:nodejs /app/data
  chmod -R 755 /app/data
  # Switch to nextjs user and execute the command
  exec su-exec nextjs "$@"
elif [ -d "/app/data" ]; then
  # If not root, just ensure it's writable (best effort)
  chmod -R 755 /app/data 2>/dev/null || true
  exec "$@"
else
  exec "$@"
fi
