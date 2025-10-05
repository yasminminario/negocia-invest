"""
Modelo de dados para a entidade Proposta, de acordo com o banco de dados. 
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean
from app.database.database import Base

# 1. SQLAlchemy Model (Definição da Tabela)
class Proposta(Base):
    __tablename__ = "propostas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_negociacoes = Column(Integer, nullable=True)
    id_autor = Column(Integer, nullable=False)
    autor_tipo = Column(String(12), nullable=False)
    taxa_analisada = Column(String, nullable=False)
    taxa_sugerida = Column(String, nullable=False)
    prazo_meses = Column(Integer, nullable=False)
    tipo = Column(String(50))
    status = Column(String(50))
    parcela = Column(Float)
    valor = Column(Float)
    negociavel = Column(Boolean)
    justificativa = Column(String(255), nullable=True)
    criado_em = Column(DateTime, default=datetime.now, nullable=False)

# 2. Pydantic Schemas (Definição da API)
class PropostaBase(BaseModel):
    id_negociacoes: Optional[int] = None
    id_autor: int
    autor_tipo: str
    taxa_analisada: str
    taxa_sugerida: str
    prazo_meses: int
    tipo: Optional[str] = None
    status: str
    parcela: Optional[float] = None
    valor: Optional[float] = None
    negociavel: bool
    justificativa: Optional[str] = None

class PropostaCreate(PropostaBase):
    pass

class PropostaResponse(PropostaBase):
    id: int
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)