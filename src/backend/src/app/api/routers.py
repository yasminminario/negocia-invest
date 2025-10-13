
"""
Este arquivo é responsável pelo roteamento dos endpoints do aplicativo.
Aqui são definidos os caminhos e associações entre URLs e suas respectivas funções de tratamento. Dentro de app/services estão as lógicas de negócio que processam as requisições recebidas.
"""

from fastapi import APIRouter, Depends, status, Body
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
from app.models.usuario import UsuarioCreate
from app.models.score import ScoreCreditoResponse
from app.models.metricas_investidor import MetricasInvestidorResponse

# Imports para Recomendação de Taxa
from app.services.calculo_taxas_juros import taxa_analisada
from fastapi import HTTPException
from app.services.emprestimo import EmprestimoService
from app.models.emprestimo import EmprestimoResponse
from fastapi import HTTPException, Body
import os
from app.services.blockchain import (
    compile_contract_only,
    deploy_contract_to_paseo,
    registrar_hash_na_blockchain,
)
from app.services.blockchain import get_address_status
from pathlib import Path
import json


# -- ROTEADOR GERAL --
router = APIRouter()


# --- Endpoints para interação com blockchain local/hardhat ---


@router.get("/blockchain/status", tags=["Blockchain"])
def blockchain_status():
    """Retorna informações básicas do contrato compilado/local salvo (ABI/address se existir)."""
    abi_file = Path(__file__).resolve().parent.parent / 'ContratoExemplo_abi.json'
    if not abi_file.exists():
        # also include whether the deployer key/address is configured
        from app.services.blockchain import get_deployer_address
        deployer = get_deployer_address()
        return {"deployed": False, "message": "ABI/address não encontrado localmente. Rode /blockchain/deploy ou o script de deploy do Hardhat.", "deployer_address": deployer, "deployer_present": bool(deployer)}
    data = json.loads(abi_file.read_text(encoding='utf-8'))
    from app.services.blockchain import get_deployer_address, is_contract_onchain
    deployer = get_deployer_address()
    address = data.get('address')
    onchain = False
    if address:
        onchain = is_contract_onchain(address)
    # attempt to read contract metadata if onchain
    contract_data = {}
    if onchain and address:
        try:
            from app.services.blockchain import get_contract_data
            contract_data = get_contract_data(address)
        except Exception:
            contract_data = {}

    return {"deployed": True, "address": address, "abi_present": 'abi' in data, "onchain": onchain, "deployer_address": deployer, "deployer_present": bool(deployer), "contract_data": contract_data}


@router.get("/blockchain/compile", tags=["Blockchain"])
def blockchain_compile():
    """Compila apenas o contrato local e retorna ABI e bytecode (sem deploy).
    Útil para o frontend obter o artifact e realizar o deploy com MetaMask/ethers."""
    try:
        compiled = compile_contract_only()
        return {"contract_name": compiled.get('contract_name'), 'abi': compiled.get('abi'), 'bytecode': compiled.get('bytecode')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/blockchain/deploy", tags=["Blockchain"])
def blockchain_deploy():
    """Compila e faz deploy do contrato local usando a chave do deployer configurada (env/CONFIG).
    Retorna address e tx_hash quando bem sucedido.
    """
    try:
        out = deploy_contract_to_paseo()
        return out
    except Exception as e:
        # imprimir stack no servidor para debugging (será visível nos logs do container)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/blockchain/registrar", tags=["Blockchain"])
def blockchain_registrar(body: dict = Body(...)):
    """Recebe uma hash hex (0x...) e chama a função registrar do contrato (usa CONTRACT_ADDRESS/ABI configurados ou arquivo salvo)."""
    try:
        # carregar ABI e endereço locais se variáveis de ambiente não estiverem setadas
        abi_file = Path(__file__).resolve().parent.parent / 'ContratoExemplo_abi.json'
        if abi_file.exists():
            data = json.loads(abi_file.read_text(encoding='utf-8'))
            # set env for blockchain service to pick up if needed
            os.environ.setdefault('CONTRACT_ABI_JSON', json.dumps(data.get('abi', [])))
            os.environ.setdefault('CONTRACT_ADDRESS', data.get('address'))

        contrato_hash = None
        extra_data = ''
        if isinstance(body, dict):
            contrato_hash = body.get('contrato_hash') or body.get('hash') or body.get('tx')
            extra_data = body.get('data', '') or ''
        if not contrato_hash:
            raise ValueError('Body must include contrato_hash (e.g. {"contrato_hash":"0x...", "data":"optional"})')

        result = registrar_hash_na_blockchain(contrato_hash, extra_data)
        # result may be a dict with tx_hash and receipt
        if isinstance(result, dict):
            return result
        return {"tx_hash": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/blockchain/address/{address}/status', tags=['Blockchain'])
def blockchain_address_status(address: str):
    try:
        data = get_address_status(address)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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


@router.get("/emprestimos", response_model=EmprestimoResponse | list[EmprestimoResponse], tags=["Empréstimos"])
def obter_emprestimo_por_id_endpoint(
    emprestimo_id: int | None = None,
    db: Session = Depends(get_db)
):
    emprestimo = EmprestimoService.obter_emprestimo_por_id(db, emprestimo_id)
    if not emprestimo:
        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")
    return emprestimo


# --- Endpoints para usuários ---
@router.post("/usuarios", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED, tags=["Usuários"])
def criar_usuario_endpoint(data: UsuarioCreate = Body(...), db: Session = Depends(get_db)):
    """Cria um usuário novo.

    Observação: o backend NÃO gera nem armazena carteiras/keys para o usuário. Se no futuro
    for necessário gerenciar chaves privadas, implemente armazenamento criptografado ou um KMS.
    """
    try:
        usuario = UsuarioService.criar_usuario(db, data)
        return usuario
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/usuarios/{usuario_id}", response_model=UsuarioResponse, tags=["Usuários"])
def obter_usuario_endpoint(usuario_id: int, db: Session = Depends(get_db)):
    """Retorna usuário por id."""
    usuario = UsuarioService.obter_por_id(db, usuario_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario
