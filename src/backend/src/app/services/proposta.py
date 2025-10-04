from datetime import datetime
from typing import Optional
import psycopg2
import uuid

"""
Este arquivo é responsável pelas lógicas relacionadas às propostas e contrapropostas de empréstimos, incluindo a criação, atualização e consulta de propostas no banco de dados.

"""

class PropostaService:
    def __init__(self, conn):
        self.conn = conn

    def criar_proposta(
        self,
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
        justificativa: Optional[str] = None
    ) -> dict:
        """
        Cria uma proposta no banco de dados.

        Args:
            id_negociacoes (str): UUID da negociação.
            id_autor (str): UUID do autor da proposta.
            autor_tipo (str): Tipo do autor ('tomador' ou 'investidor').
            taxa_analisada (str): Taxa analisada.
            taxa_sugerida (str): Taxa sugerida.
            prazo_meses (int): Prazo em meses.
            tipo (str): Tipo da proposta.
            status (str): Status da proposta.
            parcela (float): Valor da parcela.
            valor (float): Valor total.
            negociavel (bool): Se a proposta é negociável.
            justificativa (str, optional): Justificativa da proposta.

        Returns:
            dict: Dados da proposta criada.
        """
        proposta_id = str(uuid.uuid4())
        criado_em = datetime.now()

        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO propostas (
                    id, id_negociacoes, id_autor, autor_tipo, taxa_analisada, taxa_sugerida,
                    prazo_meses, criado_em, tipo, status, parcela, valor, justificativa, negociavel
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                proposta_id,
                id_negociacoes,
                id_autor,
                autor_tipo,
                taxa_analisada,
                taxa_sugerida,
                prazo_meses,
                criado_em,
                tipo,
                status,
                parcela,
                valor,
                justificativa,
                negociavel
            ))
            self.conn.commit()
            return {
                "id": proposta_id,
                "id_negociacoes": id_negociacoes,
                "id_autor": id_autor,
                "autor_tipo": autor_tipo,
                "taxa_analisada": taxa_analisada,
                "taxa_sugerida": taxa_sugerida,
                "prazo_meses": prazo_meses,
                "criado_em": criado_em,
                "tipo": tipo,
                "status": status,
                "parcela": parcela,
                "valor": valor,
                "justificativa": justificativa,
                "negociavel": negociavel
            }
        

    def get_propostas(self, id_negociacoes: Optional[str] = None) -> list:
        """
        Retorna uma lista de propostas, podendo filtrar por id_negociacoes.

        Args:
            id_negociacoes (str, optional): UUID da negociação para filtrar propostas.

        Returns:
            list: Lista de propostas encontradas.
        """
        with self.conn.cursor() as cur:
            if id_negociacoes:
                cur.execute("""
                    SELECT id, id_negociacoes, id_autor, autor_tipo, taxa_analisada, taxa_sugerida,
                            prazo_meses, criado_em, tipo, status, parcela, valor, justificativa, negociavel
                    FROM propostas
                    WHERE id_negociacoes = %s
                    ORDER BY criado_em DESC
                """, (id_negociacoes,))
            else:
                cur.execute("""
                    SELECT id, id_negociacoes, id_autor, autor_tipo, taxa_analisada, taxa_sugerida,
                            prazo_meses, criado_em, tipo, status, parcela, valor, justificativa, negociavel
                    FROM propostas
                    ORDER BY criado_em DESC
                """)
            rows = cur.fetchall()
            propostas = []
            for row in rows:
                propostas.append({
                    "id": row[0],
                    "id_negociacoes": row[1],
                    "id_autor": row[2],
                    "autor_tipo": row[3],
                    "taxa_analisada": row[4],
                    "taxa_sugerida": row[5],
                    "prazo_meses": row[6],
                    "criado_em": row[7],
                    "tipo": row[8],
                    "status": row[9],
                    "parcela": row[10],
                    "valor": row[11],
                    "justificativa": row[12],
                    "negociavel": row[13]
                })
            return propostas