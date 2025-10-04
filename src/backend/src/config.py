"""
Este arquivo guarda as configurações principais da aplicação, lê variáveis do ambiente, conexão com o banco de dados e define constantes globais.
"""
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://grupo35:75N6uHRcrigx7qx9tPCyHmAel1Xa1INg@postgres:5432/negociaai"
)