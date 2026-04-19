from fastapi import FastAPI
from mangum import Mangum

from ballotbox.config import get_settings

app = FastAPI(title="Ballotbox API", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/config/supabase")
def supabase_configured() -> dict[str, bool]:
    """Whether Supabase env vars are set (does not validate credentials)."""
    s = get_settings()
    return {"configured": bool(s.supabase_url and s.supabase_key)}


# Lambda / API Gateway
handler = Mangum(app, lifespan="off")
