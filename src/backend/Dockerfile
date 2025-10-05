# Dockerfile para backend Python (FastAPI)
FROM python:3.10-slim

# Diretório de trabalho
WORKDIR /app

# Copia os requirements primeiro para cache das dependências
COPY requirements.txt /app/requirements.txt
COPY src/model/model_analise_credito.py /app/model/model_analise_credito.py
COPY src/model/model_credit.joblib /app/model/model_credit.joblib
COPY src/model/scaler_credit.joblib /app/model/scaler_credit.joblib

# Instala as dependências
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copia todo o código do backend
COPY src/ /app/

# Expor porta padrão do FastAPI
EXPOSE 8000

# Comando para rodar FastAPI/Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
