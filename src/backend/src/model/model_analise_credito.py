"""
Modelo interno de análise de crédito (score) dos usuários.
Pipeline supervisionado: Logistic Regression.
Funções para treino, persistência, inferência e conversão de score.
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os

MODEL_PATH = "model_credit.joblib"
SCALER_PATH = "scaler_credit.joblib"

def train_model(df: pd.DataFrame, label_col: str = "default"):
	"""
	Treina o modelo supervisionado de risco de crédito.
	df: DataFrame com features e coluna de rótulo (default: 0=quitado, 1=inadimplente)
	label_col: nome da coluna de rótulo
	"""
	X = df.drop(columns=[label_col])
	y = df[label_col]
	scaler = StandardScaler()
	X_scaled = scaler.fit_transform(X)
	model = LogisticRegression(max_iter=1000)
	model.fit(X_scaled, y)
	save_artifacts(model, scaler)
	return model, scaler

def save_artifacts(model, scaler):
	joblib.dump(model, MODEL_PATH)
	joblib.dump(scaler, SCALER_PATH)

def load_artifacts():
	if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
		raise FileNotFoundError("Modelo ou scaler não encontrado. Treine antes.")
	model = joblib.load(MODEL_PATH)
	scaler = joblib.load(SCALER_PATH)
	return model, scaler

def predict_default_probability(features: dict):
	"""
	Recebe um dict de features do usuário, retorna probabilidade de default.
	"""
	model, scaler = load_artifacts()
	X = pd.DataFrame([features])
	X_scaled = scaler.transform(X)
	prob_default = model.predict_proba(X_scaled)[0][1]
	return prob_default

def score_from_probability(prob_default: float) -> int:
	"""
	Converte probabilidade de default para score (0-1000)
	"""
	score = round(1000 * (1 - prob_default))
	return score