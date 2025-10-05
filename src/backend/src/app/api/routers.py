"""
Este arquivo é responsável pelo roteamento dos endpoints do aplicativo.
Aqui são definidos os caminhos e associações entre URLs e suas respectivas funções de tratamento. Dentro de app/services estão as lógicas de negócio que processam as requisições recebidas.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from model.model_analise_credito import predict_default_probability, score_from_probability
from app.database.database import get_db

# Imports para Negociação
from app.services.negociacao import NegociacaoService
from app.models.negociacao import NegociacaoCreate, NegociacaoResponse 

# Imports para Proposta
from app.services.proposta import PropostaService
from app.models.proposta import PropostaCreate, PropostaResponse 

# -- ROTEADOR GERAL --
router = APIRouter()

@router.get("/negociacoes", response_model=list[NegociacaoResponse], tags=["Negociações"])
def listar_negociacoes_endpoint(
    status: str | None = None,
    db: Session = Depends(get_db)
):
    return NegociacaoService.listar_negociacoes(db, status=status)

# --- ENDPOINTS DE PROPOSTA ---
@router.post("/propostas", response_model=PropostaResponse, status_code=status.HTTP_201_CREATED, tags=["Propostas"])
def criar_proposta_endpoint(
    data: PropostaCreate,
    db: Session = Depends(get_db)
):
    return PropostaService.criar_proposta(db, data)

@router.get("/propostas", response_model=list[PropostaResponse], tags=["Propostas"])
def listar_propostas_endpoint(
    id_negociacoes: int | None = None,
    db: Session = Depends(get_db)
):
    return PropostaService.get_propostas(db, id_negociacoes=id_negociacoes)
    
@router.post("/score")
async def calcular_score(features: dict, db: Session = Depends(get_db)):
    prob_default = predict_default_probability(features)
    score = score_from_probability(prob_default)
    return {"score": score, "prob_default": prob_default}