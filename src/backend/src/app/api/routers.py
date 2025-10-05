"""
Este arquivo é responsável pelo roteamento dos endpoints do aplicativo.
Aqui são definidos os caminhos e associações entre URLs e suas respectivas funções de tratamento. Dentro de app/services estão as lógicas de negócio que processam as requisições recebidas.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from model.model_analise_credito import predict_default_probability, score_from_probability
from app.services.score import calcular_score_final
from app.services.api_score import montar_analise_usuario
from app.services.serasa import get_serasa_score
from app.database.database import get_db
from sqlalchemy import text

# Imports para Negociação
from app.services.negociacao import NegociacaoService
from app.models.negociacao import NegociacaoCreate, NegociacaoResponse 

# Imports para Proposta
from app.services.proposta import PropostaService
from app.models.proposta import PropostaCreate, PropostaResponse 

# -- ROTEADOR GERAL --
router = APIRouter()

# --- ENDPOINTS DE NEGOCIAÇÃO ---
@router.post("/negociacoes", response_model=NegociacaoResponse, status_code=status.HTTP_201_CREATED, tags=["Negociações"])
def criar_negociacao_endpoint(
    data: NegociacaoCreate,
    db: Session = Depends(get_db)
):
    return NegociacaoService.criar_negociacao(db, data)

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
    

# Novo endpoint: Score final (modelo + Serasa)

@router.post("/score/{user_id}")
def calcular_score_final_usuario(user_id: int, db: Session = Depends(get_db)):
    # 1. Monta análise do usuário (via queries)
    analise = montar_analise_usuario(user_id, db)

    # 2. Calcula score do modelo
    prob_default = predict_default_probability(analise)
    score_modelo = score_from_probability(prob_default)

    # 3. Mocka score do Serasa
    # Busca CPF se existir, senão usa mock
    cpf = analise.get("cpf", "00000000000")
    score_serasa = get_serasa_score(cpf)

    # 4. Calcula score final (média ponderada, usando user_id e db)
    score = calcular_score_final(score_modelo, score_serasa, user_id, db)

    # 5. Salva score final na tabela scores_credito
    db.execute(text("UPDATE scores_credito SET valor_score = :score WHERE id_usuarios = :id"), {"score": score, "id": user_id})
    db.commit()

    return {
        "user_id": user_id,
        "analise": analise,
        "score_modelo": score_modelo,
        "score_serasa": score_serasa,
        "valor_score": score,
        "prob_default": prob_default
    }