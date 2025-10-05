"""
Este arquivo é responsável pelas lógicas relacionadas às propostas e contrapropostas de empréstimos, incluindo a criação, atualização e consulta de propostas no banco de dados.
"""


from sqlalchemy.orm import Session
from app.models.proposta import Proposta, PropostaCreate
from typing import Optional, List
from app.services.calculo_taxas_juros import parse_taxa_range

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

        def compatibilidade(proposta: Proposta) -> float:
            score_val = 0.0
            # Matching por valor
            if valor is not None and proposta.valor is not None:
                score_val += 1 / (1 + abs(proposta.valor - valor) / (valor if valor else 1))
            # Matching por prazo
            if prazo is not None and proposta.prazo_meses is not None:
                score_val += 1 / (1 + abs(proposta.prazo_meses - prazo) / (prazo if prazo else 1))
            # Matching por taxa
            if taxa is not None and proposta.taxa_sugerida is not None:
                try:
                    min_t, max_t = parse_taxa_range(proposta.taxa_sugerida)
                    min_u, max_u = parse_taxa_range(taxa)
                    score_val += 1 / (1 + abs(min_t - min_u))
                    score_val += 1 / (1 + abs(max_t - max_u))
                except Exception:
                    pass
            # Matching por score (se investidor quiser diversificar)
            if perfil == "investidor" and score is not None:
                # Aqui pode-se usar dados de metricas_investidor para penalizar concentração
                pass  # MVP: não implementado
            return score_val

        propostas_ordenadas = sorted(propostas, key=compatibilidade, reverse=True)
        return propostas_ordenadas