from sqlalchemy.orm import Session
from typing import Tuple, Dict, Any
from sqlalchemy import text

def parse_taxa_range(valor: str) -> Tuple[float, float]:
	"""
	Converte string de taxa ('1.2-2.4', '1.2') para tupla (min, max).
	"""
	if valor is None:
		return (0.0, 0.0)
	valor = valor.replace(',', '.').strip()
	if '-' in valor:
		partes = valor.split('-')
		try:
			min_t = float(partes[0].replace('%', '').strip())
			max_t = float(partes[1].replace('%', '').strip())
			return (min_t, max_t)
		except Exception:
			return (0.0, 0.0)
	else:
		try:
			t = float(valor.replace('%', '').strip())
			return (t, t)
		except Exception:
			return (0.0, 0.0)

"""
Este arquivo é responsável por guardar os cálculos estratégicos de taxas de juros aplicáveis aos empréstimos, com base nas regras de negócio definidas.
Inclui funções para recomendação de taxa (taxa_analisada) e matching de oportunidades.
"""


def faixa_mercado_por_score(db: Session, score: int) -> Tuple[float, float]:
	"""
	Busca no banco a faixa de mercado (min, max) para o score informado.
	Agrupa propostas aceitas por faixa de score do tomador.
	"""
	# Score ranges
	if score >= 800:
		score_min, score_max = 800, 1000
	elif score >= 500:
		score_min, score_max = 500, 799
	else:
		score_min, score_max = 0, 499

	# Busca taxas de propostas aceitas para tomadores na faixa
	query = db.execute(text(
		"""
		SELECT p.taxa_sugerida
		FROM propostas p
		JOIN negociacoes n ON n.id = p.id_negociacoes
		JOIN scores_credito s ON n.id_tomador = s.id_usuarios
		WHERE p.status = 'aceita'
			AND s.valor_score BETWEEN :score_min AND :score_max
		"""),
		{"score_min": score_min, "score_max": score_max}
	)
	taxas = [parse_taxa_range(row[0]) for row in query.fetchall() if row[0] is not None]
	min_taxa = min([t[0] for t in taxas]) if taxas else 10.0
	max_taxa = max([t[1] for t in taxas]) if taxas else 30.0
	return min_taxa, max_taxa



def taxa_analisada(
	db: Session,
	user_id: int,
	valor: float,
	prazo: int,
	score: int,
	tipo: str = "tomador"
) -> Dict[str, Any]:
	"""
	Calcula a taxa sugerida (taxa_analisada) para uma nova proposta, considerando:
	- Faixa de mercado (por score, buscada do banco)
	- Histórico do usuário (taxas médias de propostas semelhantes)
	Retorna taxa sugerida, faixa de mercado e mensagem de contexto.
	"""
	min_taxa, max_taxa = faixa_mercado_por_score(db, score)

	# Buscar histórico de taxas do usuário para propostas semelhantes


	query = db.execute(text(
		"""
		SELECT p.taxa_sugerida, p.valor, p.prazo_meses
		FROM propostas p
		WHERE p.id_autor = :user_id
			AND p.autor_tipo = :autor_tipo
			AND p.status = 'aceita'
		"""),
		{"user_id": user_id, "autor_tipo": tipo}
	)
	rows = query.fetchall()
	print('DEBUG taxas_usuario raw:', rows)
	# Média ponderada por distância
	min_weighted_sum = 0.0
	max_weighted_sum = 0.0
	total_weight = 0.0
	min_vals = []
	max_vals = []
	for row in rows:
		taxa_str, valor_hist, prazo_hist = row
		if taxa_str is not None and valor_hist is not None and prazo_hist is not None:
			min_t, max_t = parse_taxa_range(taxa_str)
			valor_hist_f = float(valor_hist)
			prazo_hist_f = float(prazo_hist)
			d = abs(valor_hist_f - valor) / valor + abs(prazo_hist_f - prazo) / (prazo if prazo else 1)
			peso = 1 / (1 + d)
			min_weighted_sum += min_t * peso
			max_weighted_sum += max_t * peso
			total_weight += peso
			min_vals.append(min_t)
			max_vals.append(max_t)
	if total_weight > 0:
		media_min = round(min_weighted_sum / total_weight, 2)
		media_max = round(max_weighted_sum / total_weight, 2)
	elif min_vals:
		media_min = round(sum(min_vals) / len(min_vals), 2)
		media_max = round(sum(max_vals) / len(max_vals), 2)
	else:
		media_min = None
		media_max = None

	# Lógica de sugestão: se histórico existe, pondera com faixa de mercado
	if media_min is not None and media_max is not None:
		faixa_min = round(0.5 * media_min + 0.5 * min_taxa, 2)
		faixa_max = round(0.5 * media_max + 0.5 * max_taxa, 2)
	else:
		faixa_min = min_taxa
		faixa_max = max_taxa

	# Mensagem de contexto
	mensagem = "Faixa sugerida baseada no histórico e mercado."

	return {
		"taxa_analisada": f"{faixa_min}-{faixa_max}",
		"faixa_mercado": [min_taxa, max_taxa],
		"mensagem": mensagem,
		"media_taxa_usuario": f"{media_min}-{media_max}" if media_min is not None and media_max is not None else None
	}