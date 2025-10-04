from fastapi import FastAPI
from app.api.routers import router
import uvicorn

app = FastAPI(
    title="Negocia.ai API",
    description="API para gerenciamento de negociações e propostas.",
    version="1.0.0"
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)