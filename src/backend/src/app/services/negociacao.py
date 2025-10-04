from datetime import datetime
from typing import Optional
import psycopg2
import uuid

"""
Este arquivo é responsável pelas lógicas de salvamento dos dados de negociação de empréstimos, incluindo a criação, atualização e consulta de negociações no banco de dados.

"""
class NegociacaoService:
    def __init__(self, conn):
        self.conn = conn

    def criar_negociacao(
        self,
        id_tomador: str,
        id_investidor: str,
        status: str,
        taxa: float,
        quant_propostas: int,
        hash_onchain: str,
        contrato_tx_hash: str,
        assinado_em: datetime
    ) -> dict:
        """
        Cria uma negociação no banco de dados.

        Args:
            id_tomador (str): UUID do tomador.
            id_investidor (str): UUID do investidor.
            status (str): Status da negociação.
            taxa (float): Taxa negociada.
            quant_propostas (int): Quantidade de propostas.
            hash_onchain (str): Hash onchain.
            contrato_tx_hash (str): Hash do contrato.
            assinado_em (datetime): Data de assinatura.

        Returns:
            dict: Dados da negociação criada.
        """
        negociacao_id = str(uuid.uuid4())
        criado_em = datetime.now()
        atualizado_em = datetime.now()

        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO negociacoes (
                    id, id_tomador, id_investidor, status, criado_em, atualizado_em,
                    taxa, quant_propostas, hash_onchain, contrato_tx_hash, assinado_em
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                negociacao_id,
                id_tomador,
                id_investidor,
                status,
                criado_em,
                atualizado_em,
                taxa,
                quant_propostas,
                hash_onchain,
                contrato_tx_hash,
                assinado_em
            ))
            self.conn.commit()
            return {
                "id": negociacao_id,
                "id_tomador": id_tomador,
                "id_investidor": id_investidor,
                "status": status,
                "taxa": taxa,
                "quant_propostas": quant_propostas,
                "hash_onchain": hash_onchain,
                "contrato_tx_hash": contrato_tx_hash,
                "assinado_em": assinado_em,
                "criado_em": criado_em,
                "atualizado_em": atualizado_em
            }


    def listar_negociacoes(self, status: Optional[str] = None) -> list:
        """
        Lista negociações, opcionalmente filtrando pelo status.

        Args:
            status (Optional[str]): Status para filtrar as negociações.

        Returns:
            list: Lista de negociações.
        """
        with self.conn.cursor() as cur:
            if status:
                cur.execute("""
                    SELECT id, id_tomador, id_investidor, status, criado_em, atualizado_em,
                            taxa, quant_propostas, hash_onchain, contrato_tx_hash, assinado_em
                    FROM negociacoes
                    WHERE status = %s
                """, (status,))
            else:
                cur.execute("""
                    SELECT id, id_tomador, id_investidor, status, criado_em, atualizado_em,
                            taxa, quant_propostas, hash_onchain, contrato_tx_hash, assinado_em
                    FROM negociacoes
                """)
            rows = cur.fetchall()
            negociacoes = []
            for row in rows:
                negociacoes.append({
                    "id": row[0],
                    "id_tomador": row[1],
                    "id_investidor": row[2],
                    "status": row[3],
                    "criado_em": row[4],
                    "atualizado_em": row[5],
                    "taxa": row[6],
                    "quant_propostas": row[7],
                    "hash_onchain": row[8],
                    "contrato_tx_hash": row[9],
                    "assinado_em": row[10]
                })
            return negociacoes