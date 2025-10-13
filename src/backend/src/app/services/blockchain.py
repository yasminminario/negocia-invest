# src/backend/src/app/services/blockchain.py

import os
import json
from web3 import Web3, HTTPProvider
from web3.middleware import construct_time_based_cache_middleware
import hashlib

from solcx import compile_standard, install_solc
from pathlib import Path

# try import config defaults (config.py is at src/backend/src/config.py)
try:
    import config
except Exception:
    config = None

RPC_URL = os.getenv("POLKADOT_HUB_RPC_URL", "http://hardhat:8545")
w3 = Web3(HTTPProvider(RPC_URL))
POLKADOT_HUB_CHAIN_ID=31337
CONTRACT_ADDRESS = os.environ.get("CONTRACT_ADDRESS") or (getattr(config, 'CONTRACT_ADDRESS', None) if config else None)
PRIVATE_KEY = os.environ.get("WALLET_PRIVATE_KEY") or (getattr(config, 'WALLET_PRIVATE_KEY', None) if config else None)
DEPLOYER_KEY = os.environ.get("DEPLOYER_PRIVATE_KEY") or (getattr(config, 'DEPLOYER_PRIVATE_KEY', None) if config else None)

# ABI (Application Binary Interface) é a 'interface' do contrato. 
# Você a obtém após compilar o contrato no Remix.
# Deve ser um JSON longo, aqui é apenas um placeholder.
CONTRACT_ABI = json.loads(os.environ.get("CONTRACT_ABI_JSON", '[]')) 

# Inicializa a conexão Web3
w3 = Web3(HTTPProvider(RPC_URL))

try:
    if not w3.is_connected():
        print(f"⚠️ Aviso: Falha ao conectar à rede Paseo ({RPC_URL}). "
              f"As funções blockchain só funcionarão quando a rede estiver acessível.")
except Exception as e:
    print(f"⚠️ Erro ao tentar conectar à rede Paseo: {e}")

def deploy_contract_to_paseo(solidity_version: str = None) -> dict:
    """
    Compila e faz o deploy do contrato `ContratoExemplo.sol` na Polkadot Hub (Passet Hub Testnet).
    Retorna dict com address, tx_hash e abi.
    """
    RPC_URL = os.getenv("POLKADOT_HUB_RPC_URL", "http://hardhat:8545")
    CHAIN_ID = int(os.getenv("POLKADOT_HUB_CHAIN_ID", "31337"))

    key = DEPLOYER_KEY or PRIVATE_KEY
    if not key:
        raise RuntimeError("Chave privada não configurada (DEPLOYER_PRIVATE_KEY ou WALLET_PRIVATE_KEY).")

    contract_path = Path(__file__).resolve().parent.parent / 'hardhat' / 'contracts' / 'ContratoExemplo.sol'
    if not contract_path.exists():
        raise FileNotFoundError(f"Contrato não encontrado em {contract_path}")

    solc_ver = solidity_version or '0.8.28'
    install_solc(solc_ver)

    source = contract_path.read_text(encoding='utf-8')
    compiled = compile_standard({
        'language': 'Solidity',
        'sources': {contract_path.name: {'content': source}},
        'settings': {'outputSelection': {'*': {'*': ['abi', 'evm.bytecode']}}}
    }, solc_version=solc_ver)

    contract_name = list(compiled['contracts'][contract_path.name].keys())[0]
    abi = compiled['contracts'][contract_path.name][contract_name]['abi']
    bytecode = compiled['contracts'][contract_path.name][contract_name]['evm']['bytecode']['object']

    w3_local = Web3(HTTPProvider(RPC_URL))
    account = w3_local.eth.account.from_key(key)
    nonce = w3_local.eth.get_transaction_count(account.address, "pending")

    contract = w3_local.eth.contract(abi=abi, bytecode=bytecode)

    gas_price = max(w3_local.eth.gas_price, w3_local.to_wei(1, "gwei"))
    # Contract constructor is parameterless (registrador := msg.sender),
    # so build transaction without passing constructor arguments.
    tx = contract.constructor().build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 1_200_000,
        'gasPrice': gas_price,
    })

    signed_tx = w3_local.eth.account.sign_transaction(tx, private_key=key)
    tx_hash = w3_local.eth.send_raw_transaction(signed_tx.raw_transaction)

    print(f"🚀 Deploy enviado! Hash: {tx_hash.hex()}")
    receipt = w3_local.eth.wait_for_transaction_receipt(tx_hash, timeout=180)
    print(f"✅ Contrato deployado no endereço: {receipt.contractAddress}")

    # write artifact to app root (same path the router expects)
    out = Path(__file__).resolve().parent.parent / 'ContratoExemplo_abi.json'
    out.write_text(json.dumps({'abi': abi, 'address': receipt.contractAddress}, indent=2), encoding='utf-8')

    return {'address': receipt.contractAddress, 'tx_hash': tx_hash.hex(), 'abi': abi}


def compile_contract_only(solidity_version: str = None) -> dict:
    """
    Compile the local `ContratoExemplo.sol` and return ABI and bytecode without
    attempting any network or RPC calls. Useful as a dry-run when the RPC is
    unreachable or for unit tests.

    Returns: { 'contract_name': str, 'abi': list, 'bytecode': str, 'compiled': dict }
    """
    contract_path = Path(__file__).resolve().parent.parent / 'hardhat' / 'contracts' / 'ContratoExemplo.sol'
    if not contract_path.exists():
        raise FileNotFoundError(f"Contrato não encontrado em {contract_path}")

    solc_ver = solidity_version or (getattr(config, 'SOLIDITY_VERSION', None) if config else None) or '0.8.20'
    # Ensure the requested solc is installed locally (no network/RPC needed)
    install_solc(solc_ver)

    source = contract_path.read_text(encoding='utf-8')
    compiled = compile_standard({
        'language': 'Solidity',
        'sources': {contract_path.name: {'content': source}},
        'settings': {
            'outputSelection': {'*': {'*': ['abi', 'evm.bytecode']}},
        }
    }, solc_version=solc_ver)

    contract_name = list(compiled['contracts'][contract_path.name].keys())[0]
    abi = compiled['contracts'][contract_path.name][contract_name]['abi']
    bytecode = compiled['contracts'][contract_path.name][contract_name]['evm']['bytecode']['object']

    # Also persist the ABI+address placeholder to the expected artifacts file so
    # other parts of the backend (and the frontend status) can read it from disk.
    # persist to the app root so the API router and hardhat scripts can find it
    out = Path(__file__).resolve().parent.parent / 'ContratoExemplo_abi.json'
    try:
        out.write_text(json.dumps({'contract_name': contract_name, 'abi': abi, 'bytecode': bytecode}, indent=2), encoding='utf-8')
    except Exception as e:
        # Not fatal for compile-only; just log to console for debugging
        print(f"⚠️ Falha ao salvar ABI em {out}: {e}")

    return {'contract_name': contract_name, 'abi': abi, 'bytecode': bytecode, 'compiled': compiled}

def registrar_hash_na_blockchain(contrato_tx_hash: str, data: str = ''):
    """
    Recebe a hash do contrato já gerada e salva no banco,
    envia para a Polygon Testnet e retorna a hash da transação.
    """
    if not w3.is_connected():
        raise ConnectionError("Falha ao conectar à rede RPC configurada.")

    # Load ABI/address at runtime: prefer environment, fallback to artifact file
    contract_abi = None
    contract_address = os.environ.get('CONTRACT_ADDRESS') or CONTRACT_ADDRESS
    # Try env ABI JSON first
    try:
        env_abi = os.environ.get('CONTRACT_ABI_JSON')
        if env_abi:
            contract_abi = json.loads(env_abi)
    except Exception:
        contract_abi = None

    # If we don't have ABI or address yet, try reading the artifact file
    if (not contract_abi) or (not contract_address):
        abi_file = Path(__file__).resolve().parent.parent / 'ContratoExemplo_abi.json'
        if abi_file.exists():
            try:
                data = json.loads(abi_file.read_text(encoding='utf-8'))
                contract_abi = contract_abi or data.get('abi')
                contract_address = contract_address or data.get('address')
            except Exception:
                pass

    if not contract_abi:
        raise RuntimeError("ABI do contrato não encontrada. Rode /blockchain/compile ou providencie CONTRACT_ABI_JSON.")
    if not contract_address:
        raise RuntimeError("Endereço do contrato não configurado. Rode /blockchain/deploy ou configure CONTRACT_ADDRESS.")

    if not PRIVATE_KEY:
        raise RuntimeError("Chave privada para envio de transações não configurada (WALLET_PRIVATE_KEY).")

    # 1. Configurar o contrato e a conta
    contract = w3.eth.contract(address=contract_address, abi=contract_abi)
    account = w3.eth.account.from_key(PRIVATE_KEY)

    # 2. Construir a transação
    nonce = w3.eth.get_transaction_count(account.address)

    # Converte a hash do contrato para bytes, se necessário
    if not isinstance(contrato_tx_hash, str):
        raise TypeError("contrato_tx_hash deve ser uma string hex (ex: 0x...)")

    hex_str = contrato_tx_hash[2:] if contrato_tx_hash.startswith("0x") else contrato_tx_hash
    # Deve ter 64 caracteres (32 bytes) quando SHA256 em hex
    if len(hex_str) != 64:
        # permitir hashes menores/paddeds? por enquanto, rejeitamos
        raise ValueError("contrato_tx_hash inválido: deve ser um SHA256 hex de 32 bytes (64 hex chars)")

    contrato_hash_bytes = bytes.fromhex(hex_str)

    # Chama a função 'registrar' do Smart Contract (tenta chamar registrar(hash, data) se disponível,
    # caso contrário faz fallback para registrar(hash)).
    try:
        tx_build = contract.functions.registrar(contrato_hash_bytes, data).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': 300000,  # Ajustável conforme necessário.
            'gasPrice': w3.eth.gas_price,
        })
    except TypeError:
        # ABI may not accept data param; fallback to single-arg registrar
        tx_build = contract.functions.registrar(contrato_hash_bytes).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': 300000,
            'gasPrice': w3.eth.gas_price,
        })

    # 3. Assinar e Enviar a transação
    signed_tx = w3.eth.account.sign_transaction(tx_build, private_key=PRIVATE_KEY)
    hash_onchain = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

    # 4. Esperar a confirmação (opcional, mas recomendado)
    tx_receipt = w3.eth.wait_for_transaction_receipt(hash_onchain, timeout=60)

    if hasattr(tx_receipt, 'status') and tx_receipt.status != 1:
        raise RuntimeError(f"Transação revertida ou falhou: {tx_receipt}")

    # Serialize a minimal receipt for JSON transport (HexBytes -> hex strings)
    def hb_to_hex(x):
        try:
            return x.hex()
        except Exception:
            return x

    receipt_obj = {
        'transactionHash': hb_to_hex(tx_receipt.transactionHash),
        'blockHash': hb_to_hex(tx_receipt.blockHash) if getattr(tx_receipt, 'blockHash', None) else None,
        'blockNumber': getattr(tx_receipt, 'blockNumber', None),
        'transactionIndex': getattr(tx_receipt, 'transactionIndex', None),
        'status': getattr(tx_receipt, 'status', None),
        'gasUsed': getattr(tx_receipt, 'gasUsed', None),
        'cumulativeGasUsed': getattr(tx_receipt, 'cumulativeGasUsed', None),
        'contractAddress': getattr(tx_receipt, 'contractAddress', None),
        'logs': []
    }

    # serialize logs minimally
    try:
        for l in getattr(tx_receipt, 'logs', []):
            # prefer dict access for log fields, but support attribute objects
            addr = l['address'] if isinstance(l, dict) and 'address' in l else getattr(l, 'address', None)
            topics_raw = (l['topics'] if isinstance(l, dict) and 'topics' in l else getattr(l, 'topics', []))
            data_raw = (l['data'] if isinstance(l, dict) and 'data' in l else getattr(l, 'data', b''))

            # If data_raw is bytes and empty, try to provide the string we sent (best-effort not guaranteed)
            serialized_data = None
            try:
                if isinstance(data_raw, (bytes, bytearray)):
                    # empty bytes -> '', otherwise hex
                    serialized_data = hb_to_hex(data_raw) if data_raw else ''
                else:
                    # non-bytes (could be '') keep as-is
                    serialized_data = data_raw
            except Exception:
                serialized_data = ''

            receipt_obj['logs'].append({
                'address': addr,
                'topics': [hb_to_hex(t) for t in (topics_raw or [])],
                'data': serialized_data,
            })
    except Exception:
        # best-effort; ignore serialization failures in logs
        pass

    # If contractAddress was not set (null) but logs include the contract address, use it
    try:
        if not receipt_obj.get('contractAddress') and receipt_obj.get('logs') and len(receipt_obj['logs']) > 0:
            first_log_addr = receipt_obj['logs'][0].get('address')
            if first_log_addr:
                # ensure it's a string and prefixed with 0x
                addr_str = str(first_log_addr)
                if not addr_str.startswith('0x'):
                    addr_str = '0x' + addr_str
                receipt_obj['contractAddress'] = addr_str
    except Exception:
        pass

    # 5. Retornar a hash da transação e recibo serializado
    return {'tx_hash': receipt_obj['transactionHash'], 'receipt': receipt_obj}


def get_deployer_address() -> str | None:
    """Return the address derived from the configured deployer/private key, or None if not set."""
    key = DEPLOYER_KEY or PRIVATE_KEY
    if not key:
        return None
    try:
        w3_local = Web3(HTTPProvider(RPC_URL))
        acct = w3_local.eth.account.from_key(key)
        return acct.address
    except Exception:
        return None


def is_contract_onchain(address: str) -> bool:
    """Return True if the RPC reports non-empty bytecode at `address`."""
    try:
        w3_local = Web3(HTTPProvider(RPC_URL))
        code = w3_local.eth.get_code(address)
        # get_code returns bytes; empty code is b'' or '0x'
        if not code:
            return False
        # if it's bytes with length > 0, then contract exists
        return len(code) > 0
    except Exception:
        # If RPC is not reachable or address invalid, treat as not onchain
        return False


def get_address_status(address: str) -> dict:
    """Return a simple status for an address: balance (wei), nonce, and whether code exists."""
    try:
        w3_local = Web3(HTTPProvider(RPC_URL))
        balance = w3_local.eth.get_balance(address)
        nonce = w3_local.eth.get_transaction_count(address)
        code = w3_local.eth.get_code(address)
        return {
            'address': address,
            'balance_wei': balance,
            'balance_eth': float(w3_local.from_wei(balance, 'ether')),
            'nonce': nonce,
            'has_code': bool(code and len(code) > 0)
        }
    except Exception as e:
        return {'address': address, 'error': str(e)}


def get_contract_data(address: str) -> dict:
    """Try to read known contract getters such as `contractData` from an on-chain contract.

    Returns a dict with any discovered fields, e.g. { 'contractData': '...' }.
    If the ABI or RPC call fails, returns an empty dict.
    """
    try:
        # Load ABI from artifact file if available
        abi = None
        abi_file = Path(__file__).resolve().parent.parent / 'ContratoExemplo_abi.json'
        if abi_file.exists():
            try:
                data = json.loads(abi_file.read_text(encoding='utf-8'))
                abi = data.get('abi')
            except Exception:
                abi = None

        if not abi:
            return {}

        w3_local = Web3(HTTPProvider(RPC_URL))
        contract = w3_local.eth.contract(address=address, abi=abi)

        result: dict = {}
        # Try to call common getter `contractData()` if present
        try:
            if any(item.get('name') == 'contractData' and item.get('type') == 'function' for item in abi):
                val = contract.functions.contractData().call()
                # ensure Python str
                if isinstance(val, bytes):
                    try:
                        val = val.decode('utf-8')
                    except Exception:
                        val = str(val)
                result['contractData'] = val
        except Exception:
            # best-effort; don't raise
            pass

        return result
    except Exception:
        return {}
