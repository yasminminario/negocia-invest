"""
Modelo de dados para a entidade Negociação, de acordo com o banco de dados. 
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, String, Float, Integer, DateTime
from app.database.database import Base

# 1. SQLAlchemy Model (Definição da Tabela)
class Negociacao(Base):
    __tablename__ = "negociacoes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True) 
    id_tomador = Column(Integer, nullable=False, index=True)
    id_investidor = Column(Integer, nullable=False)
    prazo = Column(Integer, nullable=True)
    valor = Column(Float, nullable=True)
    parcela = Column(Float, nullable=True)
    status = Column(String(20), nullable=False)
    taxa = Column(Float, nullable=False)
    quant_propostas = Column(Integer, nullable=False, default=0)
    hash_onchain = Column(String, nullable=True)
    contrato_tx_hash = Column(String, nullable=True)
    assinado_em = Column(DateTime, nullable=True)
    criado_em = Column(DateTime, default=datetime.now, nullable=False)
    atualizado_em = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

# 2. Pydantic Schemas (Definição da API)
class NegociacaoBase(BaseModel):
    id_tomador: int
    id_investidor: int
    prazo: Optional[int] = None
    valor: Optional[float] = None
    parcela: Optional[float] = None
    status: str
    taxa: Optional[float] = None
    quant_propostas: Optional[float] = 0
    hash_onchain: Optional[str] = None
    contrato_tx_hash: Optional[str] = None
    assinado_em: Optional[datetime] = None

class NegociacaoCreate(NegociacaoBase):
    pass

class NegociacaoResponse(NegociacaoBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    model_config = ConfigDict(from_attributes=True)