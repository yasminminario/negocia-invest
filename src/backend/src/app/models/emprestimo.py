from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    DateTime,
    Boolean,
    ForeignKey,
)
from app.database.database import Base

# 1. SQLAlchemy Model (Definição da Tabela)
class Emprestimo(Base):
    __tablename__ = "emprestimos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_negociacoes = Column(Integer, nullable=False, unique=True, index=True)
    id_tomador = Column(Integer, nullable=False, index=True)
    id_investidor = Column(Integer, nullable=False)
    valor = Column(Float, nullable=False)
    taxa = Column(Float, nullable=False)
    prazo = Column(Integer, nullable=False)
    parcela = Column(Float, nullable=False)
    contrato_tx_hash = Column(String, nullable=False)
    hash_onchain = Column(String, nullable=False)
    antecipacao_onchain = Column(String, nullable=True)
    contrato_antecipacao_hash = Column(String, nullable=True)
    status = Column(String(20), nullable=False, default="ativo")
    liquidado = Column(Boolean, nullable=False, default=False)
    criado_em = Column(DateTime, default=datetime.now, nullable=False)
    atualizado_em = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)
    liquidado_em = Column(DateTime, nullable=True)


# 2. Pydantic Schemas (Definição da API)
class EmprestimoBase(BaseModel):
    id_negociacoes: int
    id_tomador: int
    id_investidor: int
    valor: float
    taxa: float
    prazo: int
    parcela: float
    contrato_tx_hash: str
    hash_onchain: str
    antecipacao_onchain: Optional[str] = None
    contrato_antecipacao_hash: Optional[str] = None
    status: Optional[str] = "ativo"
    liquidado: Optional[bool] = False
    liquidado_em: Optional[datetime] = None


class EmprestimoCreate(EmprestimoBase):
    pass


class EmprestimoResponse(EmprestimoBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    model_config = ConfigDict(from_attributes=True)


class EmprestimoUpdate(BaseModel):
    id_negociacoes: Optional[int] = None
    id_tomador: Optional[int] = None
    id_investidor: Optional[int] = None
    valor: Optional[float] = None
    taxa: Optional[float] = None
    prazo: Optional[int] = None
    parcela: Optional[float] = None
    contrato_tx_hash: Optional[str] = None
    hash_onchain: Optional[str] = None
    antecipacao_onchain: Optional[str] = None
    contrato_antecipacao_hash: Optional[str] = None
    status: Optional[str] = None
    liquidado: Optional[bool] = None
    liquidado_em: Optional[datetime] = None