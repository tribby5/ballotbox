#!/usr/bin/env bash
# ponytail: opt-in stop hook — runs make check only when .cursor/verify-on-stop exists
# or when already in a verify-retry loop (loop_count > 0).
set -euo pipefail

MARKER=".cursor/verify-on-stop"
json_input=$(cat)

status="completed"
loop_count=0
if command -v jq >/dev/null 2>&1; then
  set +e
  status=$(printf '%s' "$json_input" | jq -r '.status // "completed"' 2>/dev/null)
  loop_count=$(printf '%s' "$json_input" | jq -r '.loop_count // 0' 2>/dev/null)
  set -e
fi

# Don't verify aborted/error turns unless we're finishing a retry loop.
if [[ "$status" != "completed" && "${loop_count:-0}" -eq 0 ]]; then
  printf '%s\n' '{}'
  exit 0
fi

should_verify=0
if [[ -f "$MARKER" ]]; then
  should_verify=1
elif [[ "${loop_count:-0}" -gt 0 ]]; then
  should_verify=1
fi

if [[ "$should_verify" -eq 0 ]]; then
  printf '%s\n' '{}'
  exit 0
fi

# Cursor may prepend its bundled Node to PATH; prefer the dev toolchain.
if command -v python3 >/dev/null 2>&1; then
  PATH="$(
    python3 -c '
import os
skip = (".cursor-server", ".vscode-server")
p = os.environ.get("PATH", "")
print(":".join(x for x in p.split(":") if x and not any(s in x for s in skip)))
'
  )"
  export PATH
fi

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$repo_root"

echo "[verify hook] running make check (loop_count=${loop_count})" >&2

output=""
exit_code=0
set +e
output=$(make check 2>&1)
exit_code=$?
set -e

if [[ "$exit_code" -eq 0 ]]; then
  rm -f "$MARKER"
  echo "[verify hook] make check passed" >&2
  printf '%s\n' '{}'
  exit 0
fi

printf '%s' "$output" | head -c 12000 | python3 -c '
import json, sys
code = int(sys.argv[1])
out = sys.stdin.read()
msg = (
    "The **stop hook** ran `make check` after your plan turn and it **failed**.\n\n"
    f"**Exit code:** {code}\n\n"
    "Fix the issues below, then continue. The hook will re-run checks (retry budget applies).\n\n"
    "```text\n" + out + "\n```\n"
)
print(json.dumps({"followup_message": msg}, ensure_ascii=False))
' "$exit_code"
exit 0
