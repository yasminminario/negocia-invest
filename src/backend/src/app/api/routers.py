
"""
Este arquivo é responsável pelo roteamento dos endpoints do aplicativo.
Aqui são definidos os caminhos e associações entre URLs e suas respectivas funções de tratamento. Dentro de app/services estão as lógicas de negócio que processam as requisições recebidas.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from model.model_analise_credito import predict_default_probability, score_from_probability
from app.services.score import calcular_score_final
from app.services.api_score import montar_analise_usuario
from app.services.serasa import get_serasa_score
from app.database.database import get_db
from sqlalchemy import text

# Imports para Negociação
from app.services.negociacao import NegociacaoService
from app.models.negociacao import NegociacaoCreate, NegociacaoResponse, NegociacaoUpdate 

# Imports para Proposta
from app.services.proposta import PropostaService
from app.models.proposta import PropostaCreate, PropostaResponse 

# Imports para Usuários, Scores e Métricas
from app.services.usuario import UsuarioService
from app.services.score_credito import ScoreCreditoService
from app.services.metricas import MetricasInvestidorService
from app.models.usuario import UsuarioResponse
from app.models.score import ScoreCreditoResponse
from app.models.metricas_investidor import MetricasInvestidorResponse

# Imports para Recomendação de Taxa
from app.services.calculo_taxas_juros import taxa_analisada
from fastapi import HTTPException
from datetime import datetime


# -- ROTEADOR GERAL --
router = APIRouter()

@router.put("/negociacoes/{negociacao_id}", response_model=NegociacaoResponse, tags=["Negociações"])
def atualizar_negociacao_endpoint(
    negociacao_id: int,
    dados_atualizacao: NegociacaoUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza uma negociação existente."""
    try:
        # Converte para dict excluindo campos None
        dados_dict = dados_atualizacao.model_dump(exclude_unset=True, exclude_none=True)
        
        negociacao = NegociacaoService.atualizar_negociacao(db, negociacao_id, dados_dict)
        if not negociacao:
            raise HTTPException(status_code=404, detail="Negociação não encontrada")
        return negociacao
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/negociacoes/{negociacao_id}", response_model=NegociacaoResponse, tags=["Negociações"])
def obter_negociacao_por_id_endpoint(
    negociacao_id: int,
    db: Session = Depends(get_db)
):
    negociacao = NegociacaoService.obter_negociacao_por_id(db, negociacao_id)
    if not negociacao:
        raise HTTPException(status_code=404, detail="Negociação não encontrada")
    return negociacao

@router.get("/negociacoes", response_model=list[NegociacaoResponse], tags=["Negociações"])
def listar_negociacoes_endpoint(
    status: str | None = None,
    db: Session = Depends(get_db)
):
    return NegociacaoService.listar_negociacoes(db, status=status)


@router.get("/negociacoes/tomador/{tomador_id}", response_model=list[NegociacaoResponse], tags=["Negociações"])
def listar_negociacoes_tomador_endpoint(
    tomador_id: int,
    status: str | None = None,
    db: Session = Depends(get_db)
):
    return NegociacaoService.listar_por_tomador(db, tomador_id, status=status)


@router.get("/negociacoes/investidor/{investidor_id}", response_model=list[NegociacaoResponse], tags=["Negociações"])
def listar_negociacoes_investidor_endpoint(
    investidor_id: int,
    status: str | None = None,
    db: Session = Depends(get_db)
):
    return NegociacaoService.listar_por_investidor(db, investidor_id, status=status)

# --- ENDPOINTS DE PROPOSTA ---
@router.post("/propostas", response_model=PropostaResponse, status_code=status.HTTP_201_CREATED, tags=["Propostas"])
def criar_proposta_endpoint(
    data: PropostaCreate,
    db: Session = Depends(get_db)
):
    return PropostaService.criar_proposta(db, data)

@router.get("/propostas", response_model=list[PropostaResponse], tags=["Propostas"])
def listar_propostas_endpoint(
    id_negociacoes: int | None = None,
    db: Session = Depends(get_db)
):
    return PropostaService.get_propostas(db, id_negociacoes=id_negociacoes)


@router.get("/propostas/{proposta_id}", response_model=PropostaResponse, tags=["Propostas"])
def obter_proposta_por_id_endpoint(
    proposta_id: int,
    db: Session = Depends(get_db)
):
    proposta = PropostaService.get_proposta_por_id(db, proposta_id)
    if not proposta:
        raise HTTPException(status_code=404, detail="Proposta não encontrada")
    return proposta
    

# Novo endpoint: Score final (modelo + Serasa)

@router.post("/score/{user_id}")
def calcular_score_final_usuario(user_id: int, db: Session = Depends(get_db)):
    # 1. Monta análise do usuário (via queries)
    analise = montar_analise_usuario(user_id, db)

    # 2. Calcula score do modelo
    prob_default = predict_default_probability(analise)
    score_modelo = score_from_probability(prob_default)

    # 3. Mocka score do Serasa
    # Busca CPF se existir, senão usa mock
    cpf = analise.get("cpf", "00000000000")
    score_serasa = get_serasa_score(cpf)

    # 4. Calcula score final (média ponderada, usando user_id e db)
    score = calcular_score_final(score_modelo, score_serasa, user_id, db)

    # 5. Salva score final na tabela scores_credito
    db.execute(text("UPDATE scores_credito SET valor_score = :score WHERE id_usuarios = :id"), {"score": score, "id": user_id})
    db.commit()

    return {
        "user_id": user_id,
        "analise": analise,
        "score_modelo": score_modelo,
        "score_serasa": score_serasa,
        "valor_score": score,
        "prob_default": prob_default
    }

@router.get("/recomendacao/taxa", tags=["Recomendação"])
def recomendar_taxa_endpoint(
    user_id: int,
    valor: float,
    prazo: int,
    score: int,
    tipo: str = "tomador",
    db: Session = Depends(get_db)
):
    """
    Endpoint para recomendar faixa de taxa (taxa_analisada) para nova proposta.
    Retorna faixa sugerida, faixa de mercado, mensagem e média do usuário.
    """
    resultado = taxa_analisada(db, user_id, valor, prazo, score, tipo)
    return resultado

@router.get("/internal/recommendations/solicitacoes/{user_id}", tags=["Recomendação"])
def get_recomendacoes_endpoint(
    user_id: int,
    perfil: str,
    db: Session = Depends(get_db)
):
    """
    Endpoint para retornar lista de propostas recomendadas, ordenadas por compatibilidade/diversidade.
    """
    propostas = PropostaService.get_propostas_recomendadas(
        db=db,
        user_id=user_id,
        perfil=perfil
    )
    return propostas


# --- ENDPOINTS DE USUÁRIO, SCORE E MÉTRICAS ---


@router.get("/usuarios", response_model=list[UsuarioResponse], tags=["Usuários"])
def listar_usuarios_endpoint(db: Session = Depends(get_db)):
    return UsuarioService.listar(db)


@router.get("/usuarios/{usuario_id}", response_model=UsuarioResponse, tags=["Usuários"])
def obter_usuario_por_id_endpoint(usuario_id: int, db: Session = Depends(get_db)):
    usuario = UsuarioService.obter_por_id(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario


@router.get(
    "/scores_credito/usuario/{usuario_id}",
    response_model=ScoreCreditoResponse,
    tags=["Scores"]
)
def obter_score_por_usuario_endpoint(usuario_id: int, db: Session = Depends(get_db)):
    score = ScoreCreditoService.obter_por_usuario(db, usuario_id)
    if not score:
        raise HTTPException(status_code=404, detail="Score não encontrado")
    return score


@router.get(
    "/metricas_investidor/usuario/{usuario_id}",
    response_model=MetricasInvestidorResponse,
    tags=["Métricas"]
)
def obter_metricas_investidor_usuario_endpoint(usuario_id: int, db: Session = Depends(get_db)):
    metricas = MetricasInvestidorService.obter_por_usuario(db, usuario_id)
    if not metricas:
        return MetricasInvestidorResponse(
            id=0,
            id_usuarios=usuario_id,
            valor_total_investido=0.0,
            rentabilidade_media_am=0.0,
            patrimonio=0.0,
            risco_medio=0.0,
            analise_taxa={},
            atualizado_em=datetime.utcnow(),
        )
    return metricas