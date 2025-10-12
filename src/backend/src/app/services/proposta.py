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

class PropostaService:
    
    @staticmethod
    def criar_proposta(db: Session, proposta_data: PropostaCreate) -> Proposta:
        """Cria uma proposta no banco de dados e automaticamente cria uma negociação relacionada."""

        proposta_dict = proposta_data.model_dump()

        # Se id_negociacoes não foi informado ou referencia uma negociação inexistente,
        # cria uma nova negociação (mesma lógica do fluxo sem id).
        if not proposta_data.id_negociacoes:
            negociacao_existente = None
        else:
            negociacao_existente = db.query(Negociacao).filter(
                Negociacao.id == proposta_data.id_negociacoes
            ).first()

        if not negociacao_existente:
            # Determina quem é tomador e quem é investidor
            if proposta_data.autor_tipo == "tomador":
                id_tomador = proposta_data.id_autor
                id_investidor = proposta_data.id_autor + 1
            else:
                id_investidor = proposta_data.id_autor
                id_tomador = proposta_data.id_autor + 1

            # Converte taxa (se disponível) para float seguro
            try:
                taxa_numerica = float(proposta_data.taxa_sugerida.replace('%', '')) / 100 if proposta_data.taxa_sugerida else 0.0
            except Exception:
                taxa_numerica = 0.0

            negociacao_data = NegociacaoCreate(
                id_tomador=id_tomador,
                id_investidor=id_investidor,
                status="em_negociacao",
                taxa=taxa_numerica,
                quant_propostas=1
            )

            db_negociacao = Negociacao(**negociacao_data.model_dump())
            db.add(db_negociacao)
            db.flush()
            proposta_dict['id_negociacoes'] = db_negociacao.id
        else:
            # Atualiza a negociação existente (mantendo tipos numéricos)
            proposta_dict['id_negociacoes'] = negociacao_existente.id

            quant = (negociacao_existente.quant_propostas or 0) + 1
            nova_taxa = None
            if proposta_data.taxa_sugerida:
                try:
                    nova_taxa = float(proposta_data.taxa_sugerida.replace('%', '')) / 100
                except Exception:
                    nova_taxa = negociacao_existente.taxa

            negociacao_update = {
                "quant_propostas": quant,
                "taxa": nova_taxa if nova_taxa is not None else negociacao_existente.taxa,
                "prazo": proposta_data.prazo_meses if getattr(proposta_data, "prazo_meses", None) is not None else negociacao_existente.prazo,
                "valor": proposta_data.valor if getattr(proposta_data, "valor", None) is not None else negociacao_existente.valor,
                "status": negociacao_existente.status,
                "id_tomador": negociacao_existente.id_tomador,
                "id_investidor": negociacao_existente.id_investidor,
                "criado_em": negociacao_existente.criado_em,
                "atualizado_em": datetime.utcnow()
            }
            NegociacaoService.atualizar_negociacao(db, negociacao_existente.id, negociacao_update)
 
        db_proposta = Proposta(**proposta_dict)
        db.add(db_proposta)
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