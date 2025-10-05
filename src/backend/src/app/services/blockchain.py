# src/backend/src/app/services/blockchain.py

import os
import json
from web3 import Web3, HTTPProvider
from web3.middleware import construct_time_based_cache_middleware
import hashlib

# Dados do ambiente
RPC_URL = os.environ.get("POLYGON_RPC_URL")
CONTRACT_ADDRESS = os.environ.get("CONTRACT_ADDRESS")
PRIVATE_KEY = os.environ.get("WALLET_PRIVATE_KEY")

# ABI (Application Binary Interface) é a 'interface' do contrato. 
# Você a obtém após compilar o contrato no Remix.
# Deve ser um JSON longo, aqui é apenas um placeholder.
CONTRACT_ABI = json.loads(os.environ.get("CONTRACT_ABI_JSON", '[]')) 

# Inicializa a conexão Web3
w3 = Web3(HTTPProvider(RPC_URL))
# w3.middleware_onion.add(construct_time_based_cache_middleware(60)) # Cache

def hashear_contrato(dados_contrato: dict) -> bytes:
    """Gera uma hash SHA-256 (bytes32) a partir dos dados do contrato."""
    # Garante que os dados do contrato sejam ordenados de forma consistente
    contrato_str = json.dumps(dados_contrato, sort_keys=True).encode('utf-8')
    # Gera a hash SHA-256
    sha256_hash = hashlib.sha256(contrato_str).hexdigest()
    # # Converte para bytes (formato que o Solidity espera para bytes32)
    return sha256_hash

# def registrar_hash_na_blockchain(dados_contrato: dict):
#     """
#     Registra a hash de um contrato concluído na Polygon Testnet.
#     Retorna a hash da transação.
#     """
#     if not w3.is_connected():
#         raise ConnectionError("Falha ao conectar à Polygon Testnet.")

#     # 1. Gerar a hash do contrato
#     contrato_hash_bytes = hashear_contrato(dados_contrato)
    
#     # 2. Configurar o contrato e a conta
#     contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
#     account = w3.eth.account.from_key(PRIVATE_KEY)
    
#     # 3. Construir a transação
#     nonce = w3.eth.get_transaction_count(account.address)
    
#     # Chama a função 'registrar' do Smart Contract
#     tx_build = contract.functions.registrar(contrato_hash_bytes).build_transaction({
#         'from': account.address,
#         'nonce': nonce,
#         'gas': 300000, # Ajuste o limite de gás conforme o necessário
#         'gasPrice': w3.eth.gas_price
#     })
    
#     # 4. Assinar e Enviar a transação
#     signed_tx = w3.eth.account.sign_transaction(tx_build, private_key=PRIVATE_KEY)
#     tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    
#     # 5. Esperar a confirmação (opcional, mas recomendado)
#     tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
    
#     # 6. Salvar a hash da transação no banco (e retornar)
#     return tx_receipt.transactionHash.hex()
