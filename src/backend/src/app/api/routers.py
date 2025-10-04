"""
Este arquivo é responsável pelo roteamento dos endpoints do aplicativo.
Aqui são definidos os caminhos e associações entre URLs e suas respectivas funções de tratamento. Dentro de app/services estão as lógicas de negócio que processam as requisições recebidas.

"""

from fastapi import APIRouter, Request
from model.model_analise_credito import predict_default_probability, score_from_probability

router = APIRouter()

@router.post("/score")
async def calcular_score(features: dict):
    prob_default = predict_default_probability(features)
    score = score_from_probability(prob_default)
    return {"score": score, "prob_default": prob_default}