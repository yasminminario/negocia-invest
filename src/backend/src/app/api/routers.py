"""
Este arquivo é responsável pelo roteamento dos endpoints do aplicativo.
Aqui são definidos os caminhos e associações entre URLs e suas respectivas funções de tratamento. Dentro de app/services estão as lógicas de negócio que processam as requisições recebidas.

"""

from fastapi import APIRouter, Depends, HTTPException, Query
from model.model_analise_credito import predict_default_probability, score_from_probability
from typing import Optional
from app.services.negociacao import NegociacaoService
from app.services.proposta import PropostaService
import psycopg2
from datetime import datetime
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

engine = create_engine(
    DATABASE_URL, pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Função de Dependência para o FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

# Negociação endpoints
@router.post("/negociacao")
def criar_negociacao(
    id_tomador: str,
    id_investidor: str,
    status: str,
    taxa: float,
    quant_propostas: int,
    hash_onchain: str = None,
    contrato_tx_hash: str = None,
    assinado_em: datetime = None,
    db=Depends(get_db)
):
    try:
        service = NegociacaoService(db)
        negociacao = service.criar_negociacao(
            id_tomador, id_investidor, status, taxa, quant_propostas,
            hash_onchain, contrato_tx_hash, assinado_em
        )
        return {"success": True, "data": negociacao}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar negociação: {str(e)}")

@router.get("/negociacao")
def listar_negociacoes(
    status: Optional[str] = Query(None),
    db=Depends(get_db)
):
    try:
        service = NegociacaoService(db)
        negociacoes = service.listar_negociacoes(status)
        return {"success": True, "data": negociacoes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar negociações: {str(e)}")

# Proposta endpoints

@router.post("/proposta")
def criar_proposta(
    id_negociacoes: str,
    id_autor: str,
    autor_tipo: str,
    taxa_analisada: str,
    taxa_sugerida: str,
    prazo_meses: int,
    tipo: str,
    status: str,
    parcela: float,
    valor: float,
    negociavel: bool,
    justificativa: Optional[str] = None,
    db=Depends(get_db)
):
    try:
        service = PropostaService(db)
        proposta = service.criar_proposta(
            id_negociacoes, id_autor, autor_tipo, taxa_analisada, taxa_sugerida,
            prazo_meses, tipo, status, parcela, valor, negociavel, justificativa
        )
        return {"success": True, "data": proposta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar proposta: {str(e)}")

@router.get("/proposta")
def get_propostas(
    id_negociacoes: Optional[str] = Query(None),
    db=Depends(get_db)
):
    try:
        service = PropostaService(db)
        propostas = service.get_propostas(id_negociacoes)
        return {"success": True, "data": propostas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar propostas: {str(e)}")

# Endpoint para testar conexão
@router.get("/health")
def health_check(db=Depends(get_db)):
    try:
        # Usando SQLAlchemy para testar conexão
        result = db.execute("SELECT 1").fetchone()
        return {"success": True, "message": "Banco de dados conectado", "result": result[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na conexão: {str(e)}")

@router.post("/score")
async def calcular_score(features: dict):
    prob_default = predict_default_probability(features)
    score = score_from_probability(prob_default)
    return {"score": score, "prob_default": prob_default}
