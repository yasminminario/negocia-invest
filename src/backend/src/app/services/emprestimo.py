from sqlalchemy.orm import Session
from app.models.negociacao import Negociacao, NegociacaoCreate
from datetime import datetime
from typing import Optional, List
import hashlib
from app.services.blockchain import registrar_hash_na_blockchain
from app.models.emprestimo import Emprestimo

class EmprestimoService:
    @staticmethod
    def obter_emprestimo_por_id(db: Session, emprestimo_id: Optional[int] = None) -> Optional[Emprestimo] | List[Emprestimo]:
        """Se emprestimo_id for fornecido, retorna o empréstimo correspondente; caso contrário, lista todos."""
        query = db.query(Emprestimo)
        if emprestimo_id is None:
            return query.all()
        return query.filter(Emprestimo.id == emprestimo_id).first()