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


MODEL_PATH = "../app/model/model_credit.joblib"
SCALER_PATH = "../app/model/scaler_credit.joblib"

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

def predict_default_probability(analise: dict):
	"""
	Recebe o dict do campo analise do backend, retorna probabilidade de default.
	"""
	model, scaler = load_artifacts()
	# Limpa NaN/None do dict analise
	for k, v in analise.items():
		if v is None or (isinstance(v, float) and np.isnan(v)):
			analise[k] = 0.0
	X = pd.DataFrame([analise])
	X_scaled = scaler.transform(X)
	prob_default = model.predict_proba(X_scaled)[0][1]
	return prob_default

def score_from_probability(prob_default: float) -> int:
	"""
	Converte probabilidade de default para score (0-1000)
	"""

	score = round(1000 * (1 - prob_default))
	return score


# Mock para treino do modelo (hackathon)
def load_mock_data():
	import random
	data = []
	for i in range(50):
		data.append({
			"tempo_na_plataforma_meses": random.randint(6, 48),
			"emprestimos_contratados": random.randint(3, 20),
			"emprestimos_quitados": random.randint(3, 20),
			"emprestimos_inadimplentes": 0,
			"taxa_inadimplencia": 0.0,
			"media_taxa_juros_paga": round(random.uniform(9.0, 15.0), 2),
			"media_prazo_contratado": random.randint(6, 18),
			"renda_mensal": random.randint(3500, 12000),
			"endividamento_estimado": round(random.uniform(0.1, 0.3), 2),
			"propostas_realizadas": random.randint(5, 25),
			"propostas_aceitas": random.randint(3, 20),
			"media_tempo_negociacao_dias": round(random.uniform(1.0, 4.0), 2),
			"default": 0
		})
	for i in range(50):
		inad = random.randint(1, 5)
		contratos = random.randint(inad, inad+10)
		quitados = max(0, contratos - inad)
		data.append({
			"tempo_na_plataforma_meses": random.randint(3, 24),
			"emprestimos_contratados": contratos,
			"emprestimos_quitados": quitados,
			"emprestimos_inadimplentes": inad,
			"taxa_inadimplencia": round(inad / contratos, 2),
			"media_taxa_juros_paga": round(random.uniform(16.0, 24.0), 2),
			"media_prazo_contratado": random.randint(5, 14),
			"renda_mensal": random.randint(2000, 6000),
			"endividamento_estimado": round(random.uniform(0.4, 0.85), 2),
			"propostas_realizadas": random.randint(2, 12),
			"propostas_aceitas": random.randint(0, quitados),
			"media_tempo_negociacao_dias": round(random.uniform(4.0, 10.0), 2),
			"default": 1
		})
	df = pd.DataFrame(data)
	return df

if __name__ == "__main__":
	print("[INFO] Treinando modelo com dados mockados...")
	df = load_mock_data()

	# Split treino/teste (80/20, estratificado)
	from sklearn.model_selection import train_test_split
	X = df.drop(columns=["default"])
	y = df["default"]
	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

	scaler = StandardScaler()
	X_train_scaled = scaler.fit_transform(X_train)
	model = LogisticRegression(max_iter=1000)
	model.fit(X_train_scaled, y_train)

	# Avaliação no teste
	X_test_scaled = scaler.transform(X_test)
	y_pred = model.predict(X_test_scaled)
	y_prob = model.predict_proba(X_test_scaled)[:,1]
	from sklearn.metrics import accuracy_score, roc_auc_score
	acc = accuracy_score(y_test, y_pred)
	auc = roc_auc_score(y_test, y_prob)
	print(f"Acurácia (teste): {acc:.2f}")
	print(f"AUC-ROC (teste): {auc:.2f}")

	save_artifacts(model, scaler)
	print("[INFO] Modelo treinado e artefatos salvos.")

	print("[INFO] Pronto para receber o dict analise do backend!")