"""
Este arquivo é responsável pelas lógicas relacionadas às propostas e contrapropostas de empréstimos, incluindo a criação, atualização e consulta de propostas no banco de dados.
"""

from sqlalchemy.orm import Session
from app.models.proposta import Proposta, PropostaCreate
from typing import Optional, List

class PropostaService:
    
    @staticmethod
    def criar_proposta(db: Session, proposta_data: PropostaCreate) -> Proposta:
        """Cria uma proposta no banco de dados."""
        
        # Agora não precisa converter UUIDs - os IDs são inteiros diretos
        db_proposta = Proposta(**proposta_data.model_dump())
        
        db.add(db_proposta)
        db.commit()
        db.refresh(db_proposta)
        
        return db_proposta

    @staticmethod
    def get_propostas(db: Session, id_negociacoes: Optional[int] = None) -> List[Proposta]:
        """Retorna uma lista de propostas, podendo filtrar por id_negociacoes."""
        
        query = db.query(Proposta)
        
        if id_negociacoes:
            query = query.filter(Proposta.id_negociacoes == id_negociacoes)
            
        return query.order_by(Proposta.criado_em.desc()).all()