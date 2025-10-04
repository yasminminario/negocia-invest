from fastapi import FastAPI
from api.routers import router  # ajuste o import conforme o conteúdo do routers.py

app = FastAPI()
app.include_router(router)