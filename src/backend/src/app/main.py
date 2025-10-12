from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import router
from app.database.database import Base, engine
from app.models import negociacao, proposta

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NegociaAi API")

app.add_middleware(
	CORSMiddleware,
	allow_origins=[
		"http://localhost",
		"http://localhost:5173",
		"http://127.0.0.1:5173",
	],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(router)


