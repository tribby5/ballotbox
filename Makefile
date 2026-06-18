.PHONY: install test check code-quality root-install \
	frontend-install frontend-test frontend-fallow frontend-fallow-audit frontend-fallow-health frontend-check frontend-build \
	backend-install backend-test backend-check backend-run

# Whole repo (backend then frontend, then git hooks)
install: backend-install frontend-install root-install

test: backend-test frontend-test

code-quality: backend-check frontend-check

check: code-quality

root-install:
	npm ci

# Frontend (SvelteKit)
frontend-install:
	cd frontend && npm ci

frontend-test:
	cd frontend && npm test

frontend-fallow:
	cd frontend && npm run fallow

frontend-fallow-audit:
	cd frontend && npm run fallow:audit

frontend-fallow-health:
	cd frontend && npm run fallow:health

# check, lint, fallow audit (changed files), tests — fallow audit also runs via make code-quality
frontend-check: frontend-fallow-audit
	cd frontend && npm run check && npm run lint && npm test

frontend-build:
	cd frontend && npm run build

frontend-run:
	cd frontend && npm run dev

# Backend (uv + FastAPI)
backend-install:
	cd backend && uv sync --all-extras

backend-test:
	cd backend && uv run pytest

backend-check:
	cd backend && uv run ruff check . && uv run mypy src && uv run pytest

backend-run:
	cd backend && uv run uvicorn ballotbox.main:app --reload --host 127.0.0.1 --port 8000
