#!/usr/bin/env bash

# Match EMQX's Docker CI so image attestations survive load/save.
# Preserve the runner's existing Docker daemon settings.
set -euo pipefail

if docker info --format '{{json .DriverStatus}}' | grep -Fq 'io.containerd.snapshotter.v1'; then
    exit 0
fi

DAEMON_CONFIG_TMP=$(mktemp)
trap 'rm -f "$DAEMON_CONFIG_TMP"' EXIT
if sudo test -f /etc/docker/daemon.json; then
    sudo cat /etc/docker/daemon.json
else
    echo '{}'
fi | jq '.features["containerd-snapshotter"] = true' > "$DAEMON_CONFIG_TMP"

sudo dockerd --validate --config-file "$DAEMON_CONFIG_TMP"
sudo install -D -m 0644 "$DAEMON_CONFIG_TMP" /etc/docker/daemon.json
sudo systemctl restart docker
docker info --format '{{json .DriverStatus}}' | grep -Fq 'io.containerd.snapshotter.v1'
