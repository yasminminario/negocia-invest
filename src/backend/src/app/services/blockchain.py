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

def registrar_hash_na_blockchain(contrato_tx_hash: str):
    """
    Recebe a hash do contrato já gerada e salva no banco,
    envia para a Polygon Testnet e retorna a hash da transação.
    """
    if not w3.is_connected():
        raise ConnectionError("Falha ao conectar à Polygon Testnet.")

    # 1. Configurar o contrato e a conta
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    account = w3.eth.account.from_key(PRIVATE_KEY)

    # 2. Construir a transação
    nonce = w3.eth.get_transaction_count(account.address)

    # Converte a hash do contrato para bytes, se necessário
    if contrato_tx_hash.startswith("0x"):
        contrato_hash_bytes = bytes.fromhex(contrato_tx_hash[2:])
    else:
        contrato_hash_bytes = bytes.fromhex(contrato_tx_hash)

    # Chama a função 'registrar' do Smart Contract
    tx_build = contract.functions.registrar(contrato_hash_bytes).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 300000,  # Ajustável conforme necessário. A QI Tech será a patrocinadora do gás das transações.
        'gasPrice': w3.eth.gas_price
    })

    # 3. Assinar e Enviar a transação
    signed_tx = w3.eth.account.sign_transaction(tx_build, private_key=PRIVATE_KEY)
    hash_onchain = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

    # 4. Esperar a confirmação (opcional, mas recomendado)
    tx_receipt = w3.eth.wait_for_transaction_receipt(hash_onchain, timeout=60)

    # 5. Retornar a hash da transação na blockchain
    return tx_receipt.transactionHash.hex()
