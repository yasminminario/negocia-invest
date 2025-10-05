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

        # Se não há id_negociacoes, cria uma nova negociação
        if not proposta_data.id_negociacoes:
            
            # Determina quem é tomador e quem é investidor
            if proposta_data.autor_tipo == "tomador":
                id_tomador = proposta_data.id_autor
                # Para desenvolvimento, usa um investidor padrão ou deixa o mesmo ID
                id_investidor = proposta_data.id_autor + 1  # Assumindo que o próximo ID é um investidor
            else:  # autor_tipo == "investidor"
                id_investidor = proposta_data.id_autor
                # Para desenvolvimento, usa um tomador padrão ou deixa o mesmo ID
                id_tomador = proposta_data.id_autor + 1  # Assumindo que o próximo ID é um tomador
            
            # Converte taxa de string para float (remove o % e divide por 100)
            taxa_numerica = float(proposta_data.taxa_sugerida.replace('%', '')) / 100
            
            # Cria dados da negociação
            negociacao_data = NegociacaoCreate(
                id_tomador=id_tomador,
                id_investidor=id_investidor,
                status="em_negociacao",
                taxa=taxa_numerica,
                quant_propostas=1  # Primeira proposta
            )
            
            # Cria a negociação
            db_negociacao = Negociacao(**negociacao_data.model_dump())
            db.add(db_negociacao)
            db.flush()  # Para obter o ID sem fazer commit ainda
            
            # Atualiza a proposta com o ID da negociação criada
            proposta_dict = proposta_data.model_dump()
            proposta_dict['id_negociacoes'] = db_negociacao.id

        else:
            # Se já existe uma negociação, prepara os dados para atualização
            proposta_dict = proposta_data.model_dump()

            negociacao_existente = db.query(Negociacao).filter(
                Negociacao.id == proposta_data.id_negociacoes
            ).first()

            if negociacao_existente:
                # Prepara todos os dados relevantes para atualizar a negociação
                negociacao_update = {
                    "quant_propostas": str(negociacao_existente.quant_propostas + 1),
                    "taxa": str(float(proposta_data.taxa_sugerida.replace('%', '')) / 100) if proposta_data.taxa_sugerida else str(negociacao_existente.taxa),
                    "prazo": str(proposta_data.prazo_meses) if hasattr(proposta_data, "prazo_meses") else str(negociacao_existente.prazo),
                    "valor": str(proposta_data.valor) if hasattr(proposta_data, "valor") else str(negociacao_existente.valor),
                    "status": str(negociacao_existente.status),
                    "id_tomador": str(negociacao_existente.id_tomador),
                    "id_investidor": str(negociacao_existente.id_investidor),
                    "criado_em": str(negociacao_existente.criado_em),
                    "atualizado_em": str(datetime.utcnow())
                }
                NegociacaoService.atualizar_negociacao(db, negociacao_existente.id, negociacao_update)

        # Atualiza a proposta com o ID da negociação existente

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