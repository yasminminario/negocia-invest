"""
Este arquivo guarda as configurações principais da aplicação, lê variáveis do ambiente, conexão com o banco de dados e define constantes globais.
"""
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://grupo35:75N6uHRcrigx7qx9tPCyHmAel1Xa1INg@postgres:5432/negociaai"
)


POLKADOT_HUB_RPC_URL = os.getenv("POLKADOT_HUB_RPC_URL", "http://hardhat:8545")
POLKADOT_HUB_CHAIN_ID = int(os.getenv("POLKADOT_HUB_CHAIN_ID", 31337))
SOLIDITY_VERSION = "0.8.28"

CONTRACT_ADDRESS = None  # será preenchido após o deploy
WALLET_PRIVATE_KEY = os.getenv("WALLET_PRIVATE_KEY")
DEPLOYER_PRIVATE_KEY = os.getenv("DEPLOYER_PRIVATE_KEY")