"""
Este arquivo guarda as configurações principais da aplicação, lê variáveis do ambiente, conexão com o banco de dados e define constantes globais.
"""
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://grupo35:75N6uHRcrigx7qx9tPCyHmAel1Xa1INg@postgres:5432/negociaai"
)

POLYGON_RPC_URL = "https://rpc-amoy.polygon.technology/"

CONTRACT_ADDRESS = [...]

WALLET_PRIVATE_KEY="0x50fF233084e8A757169Bc132aC0636c35370e1DE"