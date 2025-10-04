# Este arquivo é o Dockerfile responsável pela configuração do banco de dados.
# Ele será utilizado para criar uma imagem Docker que, ao ser executada, irá gerar um container contendo o banco de dados configurado conforme as instruções abaixo. Também terá as mesmas configurações para o banco de dados de produção na RDS (AWS).

FROM postgres:15-alpine

# Variáveis de ambiente do PostgreSQL
ENV POSTGRES_DB=negociaai
ENV POSTGRES_USER=grupo35
ENV POSTGRES_PASSWORD=75N6uHRcrigx7qx9tPCyHmAel1Xa1INg


# Copiar scripts SQL para inicialização automática do banco
COPY create_database.sql /docker-entrypoint-initdb.d/01-create-database.sql
COPY insert_data.sql /docker-entrypoint-initdb.d/02-insert-initial-data.sql

# Expor a porta padrão do PostgreSQL
EXPOSE 5432