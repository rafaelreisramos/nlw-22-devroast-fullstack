#!/bin/bash
PENCIL_MOUNT=$(mount | grep -oP '/tmp/.mount_Pencil[^ ]+' | head -n1)

if [ -z "$PENCIL_MOUNT" ]; then
  echo "Error: Pencil AppImage not running" >&2
  exit 1
fi

exec "$PENCIL_MOUNT/resources/app.asar.unpacked/out/mcp-server-linux-x64" --app desktop "$@"
