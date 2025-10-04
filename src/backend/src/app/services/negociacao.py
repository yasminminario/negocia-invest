"""
Este arquivo é responsável pelas lógicas de salvamento dos dados de negociação de empréstimos, incluindo a criação, atualização e consulta de negociações no banco de dados.
"""

from sqlalchemy.orm import Session
from app.models.negociacao import Negociacao, NegociacaoCreate
from datetime import datetime
from typing import Optional, List

class NegociacaoService:
    
    @staticmethod
    def criar_negociacao(db: Session, negociacao_data: NegociacaoCreate) -> Negociacao:
        """Cria uma negociação no banco de dados."""
        
        # Agora não precisa converter UUIDs - os IDs são inteiros diretos
        db_negociacao = Negociacao(**negociacao_data.model_dump())
        
        db.add(db_negociacao)
        db.commit()
        db.refresh(db_negociacao)
        
        return db_negociacao

    @staticmethod
    def listar_negociacoes(db: Session, status: Optional[str] = None) -> List[Negociacao]:
        """Lista negociações, opcionalmente filtrando pelo status."""
        
        query = db.query(Negociacao)
        
        if status:
            query = query.filter(Negociacao.status == status)
            
        return query.all()