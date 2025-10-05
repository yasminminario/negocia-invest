"""
Este arquivo é responsável pelas lógicas de salvamento dos dados de negociação de empréstimos, incluindo a criação, atualização e consulta de negociações no banco de dados.
"""

from sqlalchemy.orm import Session
from app.models.negociacao import Negociacao, NegociacaoCreate
from datetime import datetime
from typing import Optional, List
# from app.services.blockchain import registrar_hash_na_blockchain

class NegociacaoService:

    @staticmethod
    def listar_negociacoes(db: Session, status: Optional[str] = None) -> List[Negociacao]:
        """Lista negociações, opcionalmente filtrando pelo status."""
        
        query = db.query(Negociacao)
        
        if status:
            query = query.filter(Negociacao.status == status)
            
        return query.all()
    


    # @staticmethod
    # def registrar_negociacao_na_blockchain(db: Session, negociacao_id: int):
    #     """
    #     Se a negociação estiver concluída, registra sua hash na blockchain.
    #     """

    #     negociacao = db.query(Negociacao).filter(Negociacao.id == negociacao_id).first()
    #     if not negociacao:
    #         raise ValueError("Negociação não encontrada.")

    #     if negociacao.status != "concluída":
    #         raise ValueError("Negociação não está concluída.")

    #     # Prepara os dados do contrato para registro
    #     dados_contrato = {
    #         "id": negociacao.id,
    #         "valor": negociacao.valor,
    #         "taxa_juros": negociacao.taxa_juros,
    #         "prazo": negociacao.prazo,
    #         "data_criacao": negociacao.data_criacao.isoformat() if negociacao.data_criacao else None,
    #         "data_conclusao": negociacao.data_conclusao.isoformat() if negociacao.data_conclusao else None,
    #         "status": negociacao.status,
    #         "id_emprestador": negociacao.id_emprestador,
    #         "id_tomador": negociacao.id_tomador
    #     }

    #     # Mock da função registrar_hash_na_blockchain
    #     tx_hash = "mocked_tx_hash"
    #     negociacao.contrato_tx_hash = tx_hash
    #     db.commit()
    #     db.refresh(negociacao)
    #     return tx_hash
    