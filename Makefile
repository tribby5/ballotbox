.PHONY: install test check \
	frontend-install frontend-test frontend-check frontend-build \
	backend-install backend-test backend-check backend-run

# Whole repo (backend then frontend)
install: backend-install frontend-install

test: backend-test frontend-test

check: backend-check frontend-check

# Frontend (SvelteKit)
frontend-install:
	cd frontend && npm ci

frontend-test:
	cd frontend && npm test

frontend-check:
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
