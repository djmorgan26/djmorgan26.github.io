#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Local dev for djmorgan26.github.io
#
# The machine's system Ruby is too old for Jekyll 4.x, so we run Jekyll inside
# Docker. This script is idempotent: it makes sure the Docker daemon is up,
# reuses an already-running container, waits for the site to respond, and
# prints a status block (site + chatbot Worker + recent logs).
#
# Usage:  scripts/dev.sh [up|status|restart|stop|logs]
#   up       (default) ensure everything is running, then show status
#   status   show current container / site / Worker status
#   restart  recreate the container from scratch
#   stop     stop and remove the container
#   logs     follow the Jekyll log
# ---------------------------------------------------------------------------
set -uo pipefail

CONTAINER=djm-jekyll
PORT=4001
IMAGE=ruby:3.3
WORKER="https://ask-david.djmorgan26.workers.dev/chat"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CMD="${1:-up}"

ensure_docker() {
  if docker info >/dev/null 2>&1; then return 0; fi
  echo "→ Docker daemon not running — launching Docker Desktop…"
  open -a Docker 2>/dev/null || { echo "✘ Could not launch Docker Desktop. Start it manually."; return 1; }
  for _ in $(seq 1 40); do
    docker info >/dev/null 2>&1 && { echo "✓ Docker daemon ready."; return 0; }
    sleep 3
  done
  echo "✘ Docker daemon did not become ready within ~2 minutes."
  return 1
}

container_running() {
  [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null)" = "true" ]
}

site_ready() { curl -sf -o /dev/null "http://localhost:$PORT/"; }

start_container() {
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  echo "→ Starting Jekyll in Docker on :$PORT (first run installs gems and may take a minute;"
  echo "  later runs are fast — gems are cached in ./vendor)…"
  docker run -d --name "$CONTAINER" -p "$PORT:4000" \
    -v "$ROOT":/srv/jekyll -w /srv/jekyll \
    -e BUNDLE_PATH=/srv/jekyll/vendor/bundle \
    "$IMAGE" \
    bash -c "gem install bundler -N --silent && bundle install && bundle exec jekyll serve --host 0.0.0.0 --force_polling" >/dev/null
}

wait_for_site() {
  echo -n "→ Waiting for site to respond"
  for _ in $(seq 1 120); do
    if site_ready; then echo " — ready."; return 0; fi
    echo -n "."
    sleep 3
  done
  echo
  echo "✘ Site did not come up. Recent log:"
  docker logs --tail 25 "$CONTAINER" 2>&1 | sed 's/^/    /'
  return 1
}

status() {
  echo "────────────────────────────────────────────────────────"
  if container_running; then
    echo "  Jekyll container : ✓ running ($CONTAINER)"
  else
    echo "  Jekyll container : ✘ not running"
  fi
  if site_ready; then
    echo "  Local site       : ✓ http://localhost:$PORT/"
  else
    echo "  Local site       : … not responding yet (http://localhost:$PORT/)"
  fi
  local code
  code=$(curl -s -m 12 -o /dev/null -w '%{http_code}' -X POST "$WORKER" \
         -H 'Content-Type: application/json' \
         -d '{"messages":[{"role":"user","content":"ping"}]}' 2>/dev/null)
  if [ "$code" = "200" ]; then
    echo "  Chatbot Worker   : ✓ HTTP 200 (live)"
  else
    echo "  Chatbot Worker   : ⚠ HTTP ${code:-000} ($WORKER)"
  fi
  echo "────────────────────────────────────────────────────────"
  if container_running; then
    echo "  Recent Jekyll log:"
    docker logs --tail 6 "$CONTAINER" 2>&1 | sed 's/^/    /'
  fi
}

case "$CMD" in
  up|start)
    ensure_docker || exit 1
    if container_running; then
      echo "✓ Container '$CONTAINER' already running — reusing it."
    else
      start_container
    fi
    wait_for_site || exit 1
    status
    echo
    echo "Open → http://localhost:$PORT/   (auto-rebuilds when you edit files)"
    ;;
  status|st)   status ;;
  restart)     ensure_docker || exit 1; start_container; wait_for_site || exit 1; status ;;
  stop)        docker rm -f "$CONTAINER" >/dev/null 2>&1 && echo "✓ Stopped $CONTAINER." || echo "Nothing to stop." ;;
  logs)        docker logs -f --tail 40 "$CONTAINER" ;;
  *)           echo "usage: scripts/dev.sh [up|status|restart|stop|logs]"; exit 1 ;;
esac
