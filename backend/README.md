# Ballotbox backend

Python **3.14** (see [repo root `.python-version`](../.python-version); use `uv python pin 3.14` after cloning). Managed interpreters: [uv Python installs](https://docs.astral.sh/uv/concepts/python-versions/).

Run from repo root with `make` targets, or:

```bash
cd backend && uv sync --all-extras && uv run uvicorn ballotbox.main:app --reload
```

Lambda: mount the ASGI app with Mangum (see `ballotbox.main.app` and `handler`).
