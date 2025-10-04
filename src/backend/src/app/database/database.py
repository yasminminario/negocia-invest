import os # Novo import para acessar variáveis de ambiente
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

# 1. Recupera a variável de ambiente DATABASE_URL
# O Docker Compose garante que esta variável esteja definida no ambiente do container.
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    # Levanta um erro claro se o Docker Compose não passou a URL corretamente
    raise Exception("A variável de ambiente DATABASE_URL não foi definida. Verifique seu docker-compose.yml.")

# 2. Criação do Engine e Sessão
engine = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True  # Ajuda a manter a conexão viva em ambientes de container
)

# Cria uma classe Base para os modelos declarativos
Base = declarative_base()

# Configura a sessão de banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """Retorna uma sessão de DB para a requisição e a fecha no final."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()