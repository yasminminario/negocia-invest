from fastapi import FastAPI
from api.routers import router  # ajuste o import conforme o conteúdo do routers.py

app = FastAPI(
    title="Negocia.ai API",
    description="API para gerenciamento de negociações e propostas.",
    version="1.0.0"
    )
app.include_router(router)