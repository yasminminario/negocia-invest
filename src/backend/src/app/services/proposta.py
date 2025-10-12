"""
Este arquivo é responsável pelas lógicas relacionadas às propostas e contrapropostas de empréstimos, incluindo a criação, atualização e consulta de propostas no banco de dados.
"""


from sqlalchemy.orm import Session
from app.models.proposta import Proposta, PropostaCreate
from typing import Optional, List
from app.services.calculo_taxas_juros import parse_taxa_range
from app.models.negociacao import Negociacao, NegociacaoCreate
from app.services.negociacao import NegociacaoService
from datetime import datetime


def _parse_taxa_media(taxa_sugerida: Optional[str]) -> Optional[float]:
    """Normaliza a taxa sugerida para uso na negociação (em pontos percentuais)."""
    if not taxa_sugerida:
        return None

    taxa_limpa = taxa_sugerida.replace('%', '').strip()

    if not taxa_limpa:
        return None

    if '-' in taxa_limpa:
        try:
            minimo, maximo = parse_taxa_range(taxa_limpa)
            return round((minimo + maximo) / 2, 4)
        except Exception:
            return None

    try:
        return float(taxa_limpa)
    except ValueError:
        return None

class PropostaService:
    
    @staticmethod
    def criar_proposta(db: Session, proposta_data: PropostaCreate) -> Proposta:
        """Cria uma proposta no banco de dados e automaticamente cria uma negociação relacionada."""

        proposta_dict = proposta_data.model_dump()

        # Decide se uma nova negociação deve ser criada
        negociacao_criada = False

        if not proposta_data.id_negociacoes:
            if proposta_data.autor_tipo == "tomador":
                id_tomador = proposta_data.id_autor
                id_investidor = proposta_data.id_investidor_destino
            else:
                id_investidor = proposta_data.id_autor
                id_tomador = proposta_data.id_tomador_destino

            if id_tomador is not None and id_investidor is not None:
                taxa_media = _parse_taxa_media(proposta_data.taxa_sugerida)

                negociacao_data = NegociacaoCreate(
                    id_tomador=id_tomador,
                    id_investidor=id_investidor,
                    status="em_negociacao",
                    taxa=taxa_media if taxa_media is not None else 0.0,
                    quant_propostas=1,
                    prazo=proposta_data.prazo_meses if hasattr(proposta_data, "prazo_meses") else None,
                    valor=proposta_data.valor,
                    parcela=proposta_data.parcela
                )

                db_negociacao = Negociacao(**negociacao_data.model_dump())
                db.add(db_negociacao)
                db.flush()

                proposta_dict["id_negociacoes"] = db_negociacao.id
                negociacao_criada = True

        if proposta_data.id_negociacoes or negociacao_criada:
            negociacao_id = proposta_dict.get("id_negociacoes")
            negociacao_existente = db.query(Negociacao).filter(
                Negociacao.id == negociacao_id
            ).first()

            if negociacao_existente:
                taxa_media = _parse_taxa_media(proposta_data.taxa_sugerida)
                atualizacoes = {
                    "quant_propostas": (negociacao_existente.quant_propostas or 0) + 1,
                    "atualizado_em": datetime.utcnow(),
                }

                if taxa_media is not None:
                    atualizacoes["taxa"] = taxa_media

                if proposta_data.prazo_meses is not None:
                    atualizacoes["prazo"] = proposta_data.prazo_meses

                if proposta_data.valor is not None:
                    atualizacoes["valor"] = proposta_data.valor

                if proposta_data.parcela is not None:
                    atualizacoes["parcela"] = proposta_data.parcela

                NegociacaoService.atualizar_negociacao(db, negociacao_existente.id, atualizacoes)

        # Remove campos auxiliares não persistidos
        proposta_dict.pop("id_tomador_destino", None)
        proposta_dict.pop("id_investidor_destino", None)

        # Cria a proposta
        db_proposta = Proposta(**proposta_dict)
        db.add(db_proposta)
        
        # Commit de tudo junto
        db.commit()
        db.refresh(db_proposta)
        
        return db_proposta

    @staticmethod
    def get_propostas_recomendadas(
        db: Session,
        user_id: int,
        perfil: str  # "investidor" ou "tomador"
    ) -> List[Proposta]:
        """
        Retorna propostas do tipo 'inicial' e status 'pendente' ordenadas por lógica de recomendação.
        Para investidores: prioriza diversidade em relação à carteira.
        Para tomadores: retorna todas ordenadas por data.
        """
        query = db.query(Proposta).filter(Proposta.tipo == "inicial", Proposta.status == "pendente")
        propostas = query.all()

        if perfil == "investidor":
            propostas_investidas = db.query(Proposta.valor, Proposta.prazo_meses, Proposta.taxa_sugerida).filter(Proposta.id_autor == user_id, Proposta.autor_tipo == "investidor").all()
            valores_investidos = set([float(p[0]) for p in propostas_investidas if p[0] is not None])
            prazos_investidos = set([int(p[1]) for p in propostas_investidas if p[1] is not None])
            taxas_investidas = set()
            for p in propostas_investidas:
                if p[2] is not None:
                    min_t, max_t = parse_taxa_range(p[2])
                    taxas_investidas.add(round(min_t,2))
                    taxas_investidas.add(round(max_t,2))

            def diversidade_score(proposta: Proposta) -> float:
                score = 0.0
                if proposta.valor is not None and proposta.valor not in valores_investidos:
                    score += 1.0
                if proposta.prazo_meses is not None and proposta.prazo_meses not in prazos_investidos:
                    score += 1.0
                if proposta.taxa_sugerida is not None:
                    try:
                        min_t, max_t = parse_taxa_range(proposta.taxa_sugerida)
                        if round(min_t,2) not in taxas_investidas:
                            score += 0.5
                        if round(max_t,2) not in taxas_investidas:
                            score += 0.5
                    except Exception:
                        pass
                return score

            propostas_ordenadas = sorted(propostas, key=diversidade_score, reverse=True)
            return propostas_ordenadas

        # Para tomador, retorna todas ordenadas por data
        return sorted(propostas, key=lambda p: p.criado_em, reverse=True)
    

    @staticmethod
    def get_propostas(db: Session, id_negociacoes: Optional[int] = None) -> List[Proposta]:
        """Retorna uma lista de propostas, podendo filtrar por id_negociacoes."""

        query = db.query(Proposta)

        if id_negociacoes:
            query = query.filter(Proposta.id_negociacoes == id_negociacoes)

        return query.order_by(Proposta.criado_em.desc()).all()

    @staticmethod
    def get_proposta_por_id(db: Session, proposta_id: int) -> Optional[Proposta]:
        """Obtém uma proposta específica."""

        return db.query(Proposta).filter(Proposta.id == proposta_id).first()