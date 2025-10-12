"""
Este arquivo é responsável pelas lógicas de salvamento dos dados de negociação de empréstimos, incluindo a criação, atualização e consulta de negociações no banco de dados.
"""

from sqlalchemy.orm import Session
from app.models.negociacao import Negociacao, NegociacaoCreate
from datetime import datetime
from typing import Optional, List
import hashlib
from app.services.blockchain import registrar_hash_na_blockchain
from app.models.emprestimo import EmprestimoCreate, Emprestimo

class NegociacaoService:

    @staticmethod
    def atualizar_negociacao(db: Session, negociacao_id: int, negociacao_update: dict) -> Optional[Negociacao]:
        """
        Atualiza os dados de uma negociação existente.
        negociacao_update: dicionário com os campos a serem atualizados.
        """
        negociacao = db.query(Negociacao).filter(Negociacao.id == negociacao_id).first()
        if not negociacao:
            return None

        for key, value in negociacao_update.items():
            if hasattr(negociacao, key):
                setattr(negociacao, key, value)

        # Se o status foi atualizado para "aceita", gera o hash do contrato
        if negociacao.status == "aceita":
            # Prepara os dados do contrato para o hash
            dados_contrato = (
            f"{negociacao.id}|"
            f"{negociacao.id_tomador}|"
            f"{negociacao.id_investidor}|"
            f"{negociacao.taxa}|"
            f"{negociacao.prazo}|"
            f"{negociacao.valor}|"
            f"{negociacao.criado_em.isoformat() if negociacao.criado_em else ''}|"
            f"{negociacao.atualizado_em.isoformat() if negociacao.atualizado_em else ''}"
            )

            # Gera o hash SHA256 e converte para bytes32
            hash_bytes = hashlib.sha256(dados_contrato.encode("utf-8")).digest()
            negociacao.contrato_tx_hash = hash_bytes

  
            emprestimo = Emprestimo(
            id_negociacoes=negociacao.id,
            id_tomador=negociacao.id_tomador,
            id_investidor=negociacao.id_investidor,
            valor=negociacao.valor or 0.0,
            taxa=negociacao.taxa or 0.0,
            prazo=negociacao.prazo if negociacao.prazo is not None else 0,
            parcela=negociacao.parcela or 0.0,
            contrato_tx_hash=negociacao.contrato_tx_hash,
            hash_onchain=negociacao.hash_onchain, 
            status="ativo",
            liquidado=False
            )

            db.add(emprestimo)
            db.commit()
            db.refresh(emprestimo)
        negociacao.atualizado_em = datetime.utcnow()

        # Chama a função para registrar o hash na blockchain
        # registrar_hash_na_blockchain(contrato_tx_hash=negociacao.contrato_tx_hash)
        db.commit()
        db.refresh(negociacao)
        return negociacao

    @staticmethod
    def listar_negociacoes(db: Session, status: Optional[str] = None) -> List[Negociacao]:
        """Lista negociações, opcionalmente filtrando pelo status."""
        
        query = db.query(Negociacao)
        
        if status:
            query = query.filter(Negociacao.status == status)
            
        return query.all()
    
    @staticmethod
    def obter_negociacao_por_id(db: Session, negociacao_id: int) -> Optional[Negociacao]:
        """Obtém uma negociação pelo ID."""
        return db.query(Negociacao).filter(Negociacao.id == negociacao_id).first()

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
