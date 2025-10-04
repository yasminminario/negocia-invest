
# Dockerfile para backend Python (FastAPI)
FROM python:3.10-slim

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos do backend para o container
COPY src/app /app
COPY requirements.txt /app/requirements.txt
COPY src/model/model_analise_credito.py /app/model/model_analise_credito.py

# Instala as dependências
RUN pip install --upgrade pip \
	&& pip install -r requirements.txt

# Expor porta padrão do FastAPI
EXPOSE 8000

# Comando para rodar FastAPI/Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
