from fastapi import FastAPI
from app.api.routers import router 
from app.database.database import Base, engine 
from app.models import negociacao, proposta 

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NegociaAi API")

app.include_router(router)


