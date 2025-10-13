"""Serviços para consulta e cálculo dos scores de crédito."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import text
from sqlalchemy.orm import Session

from model.model_analise_credito import predict_default_probability, score_from_probability
from app.models.score import ScoreCredito
from app.services.api_score import montar_analise_usuario
from app.services.score import calcular_score_final
from app.services.serasa import get_serasa_score


class ScoreCreditoService:
    """Operações relacionadas aos scores de crédito."""

    @staticmethod
    def obter_por_usuario(db: Session, usuario_id: int) -> Optional[ScoreCredito]:
        return (
            db.query(ScoreCredito)
            .filter(ScoreCredito.id_usuarios == usuario_id)
            .order_by(ScoreCredito.atualizado_em.desc())
            .first()
        )

    @staticmethod
    def calcular_score_usuario(db: Session, usuario_id: int) -> Dict[str, Any]:
        """Recalcula o score do usuário com base no modelo interno e dados externos."""

        analise = montar_analise_usuario(usuario_id, db)
        if not analise:
            raise ValueError("Não foi possível montar a análise do usuário para cálculo de score")

        analise_normalizada: Dict[str, float] = {}
        for chave, valor in analise.items():
            if valor is None:
                analise_normalizada[chave] = 0.0
            else:
                analise_normalizada[chave] = float(valor)

        prob_default = float(predict_default_probability(analise_normalizada))
        score_modelo = int(score_from_probability(prob_default))

        cpf = db.execute(
            text("SELECT cpf FROM usuarios WHERE id = :usuario_id"),
            {"usuario_id": usuario_id},
        ).scalar()
        score_serasa = float(get_serasa_score(cpf or "00000000000"))

        valor_score = float(calcular_score_final(score_modelo, score_serasa, usuario_id, db))

        registro = ScoreCreditoService.obter_por_usuario(db, usuario_id)
        if registro is None:
            registro = ScoreCredito(
                id_usuarios=usuario_id,
                valor_score=valor_score,
                atualizado_em=datetime.utcnow(),
                analise=analise_normalizada,
                risco=prob_default,
            )
            db.add(registro)
        else:
            registro.valor_score = valor_score
            registro.atualizado_em = datetime.utcnow()
            registro.analise = analise_normalizada
            registro.risco = prob_default

        db.commit()
        db.refresh(registro)

        return {
            "score": registro,
            "score_modelo": score_modelo,
            "score_serasa": score_serasa,
            "prob_default": prob_default,
            "analise": analise_normalizada,
        }

    @staticmethod
    def recalcular_todos(db: Session) -> List[Dict[str, Any]]:
        """Executa o recálculo de score para todos os usuários cadastrados."""

        usuarios_ids = list(db.execute(text("SELECT id FROM usuarios")).scalars())
        resultados: List[Dict[str, Any]] = []

        for usuario_id in usuarios_ids:
            resultado = ScoreCreditoService.calcular_score_usuario(db, usuario_id)
            resultados.append(resultado)

        return resultados
