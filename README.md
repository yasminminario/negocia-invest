# 📄 Documentação do Projeto: NegociaInvest

---

## 1. Introdução/Contexto
- Descrição breve do cenário atual, da QI
- Panorama do mercado --> falar do PEER to PEER
- Justificativa para o desenvolvimento da solução

---

## 2. Problema
- Problema principal identificado
- Impactos do problema (econômicos, sociais, operacionais)
- Exemplos práticos de dor do usuário
- Lacunas em soluções existentes

---

## 3. Solução Proposta
- Visão geral da solução
- Como resolve o problema identificado
- Diferenciais em relação a soluções existentes
- Principais benefícios para os usuários e stakeholders

---

## 4. Objetivos do Projeto
- Objetivo geral
- Objetivos específicos
- Metas de curto, médio e longo prazo

---

## 5. Personas
### 5.1 Persona 1
- Nome fictício
- Idade
- Profissão
- Necessidades/dor
- Como a solução atende

### 5.2 Persona 2
- Nome fictício
- Idade
- Profissão
- Necessidades/dor
- Como a solução atende

*(Adicionar quantas forem necessárias)*

---

## 6. Jornada do Usuário
- Fluxo passo a passo de como o usuário interage com a solução
- Cenários de uso (investidor, tomador, administrador, etc.)
- Pain points atuais e como são resolvidos

---

## 7. Estrutura de Banco de Dados
- Diagrama de Entidade-Relacionamento (DER)
- Principais tabelas e relacionamentos
- Campos críticos e justificativa
- Considerações de escalabilidade e segurança

---

## 8. Arquitetura do Sistema


# Estrutura de Pastas do negocia.ai

src/
└── backend/
    └── src/
        └── app/
            ├── api/
            │   └── routers.py
            ├── database/
            │   ├── create_database.sql
            │   └── Dockerfile
            ├── models/
            │   ├── negociacao.py
            │   ├── proposta.py
            │   └── usuario.py
            │   └── score.py
            │   └── metricas_investidor.py
            ├── services/
            │   ├── api_score.py
            │   ├── blockchain.py
            │   ├── calculo_taxas_juros.py
            │   ├── dashboard.py
            │   ├── negociacao.py
            │   ├── proposta.py
            │   └── usuario.py
            └── model/
                └── model_analise_credito.py
        ├── config.py
        ├── Dockerfile
        ├── requirements.txt
        └── docker-compose.yml
    frontend/
    (adicionar)
.env
README.md

## 📂 src/backend/src

Código-fonte principal da aplicação backend, organizado por camadas (API, database, models, services, ML).

### 📂 app/api
- **routers.py**  
  Define as rotas da API (endpoints HTTP) do FastAPI.  
  Centraliza a orquestração dos serviços e expõe as funcionalidades para o front-end/mobile.

### 📂 app/database
- **create_database.sql**  
  Script SQL inicial para criação das tabelas e relações do banco de dados (Postgres).  
- **Dockerfile**  
  Dockerfile específico para configurar a imagem do banco local (quando usado com `docker-compose`).

### 📂 app/models
Contém os modelos (entidades) que representam as tabelas do banco e objetos de negócio.  
- **negociacao.py** – Modelo da negociação entre tomador e investidor.  
- **proposta.py** – Modelo das propostas e contrapropostas.  
- **usuario.py** – Modelo dos usuários, incluindo dados cadastrais.  
- **score.py** – Modelo das análises de score de crédito. 
- **metricas_investidor.py** – Modelo das métricas do investidor.

### 📂 app/services
Serviços e regras de negócio que dão suporte às rotas.  
- **api_score.py** – Serviço responsável pela consulta/integração com API de score de crédito (integrada ao Serasa).  
- **blockchain.py** – Serviço para interação com a blockchain Polygon (registro de contratos e leitura de hashes).  
- **calculo_taxas_juros.py** – Funções auxiliares para cálculo de taxas e juros dos empréstimos.  
- **dashboard.py** – Serviço para agregação e cálculo de métricas exibidas nas dashboards dos usuários.  
- **negociacao.py** – Lógica de negócio das negociações (criação, atualização de status).  
- **proposta.py** – Lógica de envio/validação de propostas e contrapropostas.  
- **usuario.py** – Serviço para cadastro, login e gestão de dados de usuários.  

### 📂 model
- **model_analise_credito.py**  
  Implementação de modelo de análise de crédito (através de machine learning).  
  Utilizado para classificação de risco de tomadores de empréstimo.

---

## Arquivos de Configuração

- **config.py**  
  Configurações globais do backend (chaves de API, conexões de banco, parâmetros de blockchain).  

- **Dockerfiles**  
  Dockerfile para empacotar e rodar o backend no ECS Fargate (ou localmente), e outro para a construção da imagem do banco Postgres para testes locais, configurado de maneira análoga à instância RDS (AWS) em produção.  

- **requirements.txt**  
  Lista de dependências Python (FastAPI, Web3.py, scikit-learn, entre demais utilitários do aplicativo).  

- **docker-compose.yml**  
  Orquestração de containers para desenvolvimento local (ex.: Postgres + backend).  

- **.env**  
  Variáveis de ambiente sensíveis (senhas, tokens, chaves de API).  

- **README.md**  
  Documentação inicial do projeto, instruções de setup e guia rápido.  


- Visão geral da arquitetura (monolito, microserviços, serverless, etc.)
- Componentes principais
- Fluxo de dados entre front-end, backend e blockchain
- Integrações externas (ex.: APIs, parceiros)

---

## 9. Estrutura de Front-end
- Frameworks e bibliotecas utilizadas
- Estrutura de diretórios e componentes
- Padrões de UI/UX aplicados
- Responsividade e acessibilidade

---

## 10. Estrutura de Back-end
- Linguagem e framework
- Organização do código
- Padrões de segurança (ex.: autenticação, criptografia, logs)
- Estratégia de integração com blockchain e APIs externas

---

## 11. Escpecificação de Modelos

### 11.1 Motor de Score

#### 1) Objetivo

Calcular um **score final (0–1000)** que representa o risco de crédito do usuário como tomador combinando:

1.  **Fonte externa: Serasa** (para usuários sem histórico ou com histórico curto na plataforma -> "**cold start**" e "**thin file**").
2.  **Fonte interna:** baseada em **modelo supervisionado**, que utiliza os dados do histórico operacional do usuário na plataforma para estimar diretamente a **probabilidade de *default***. Essa probabilidade é então convertida em um score contínuo de 0 a 1000, refinando a avaliação de risco de cada tomador.

**Persistimos apenas:**

* `scores_credito.analise` (**JSON** com métricas agregadas).
* `scores_credito.valor_score` (resultado final **0–1000**).

O recálculo ocorre **1x ao dia (batch)** e também **sob demanda via listener** após atualizar `analise`.

#### 2) Escopo e Premissas

* O score **não considera ações como investidor** (emprestador); só como **tomador**.
* A análise interna adota diretamente um **modelo supervisionado**, que utiliza rótulos de inadimplência e quitação para treinar a previsão de risco. O modelo estima a **probabilidade de *default*** de cada tomador com base em seu histórico operacional e dados da plataforma, convertendo esse resultado em um score contínuo de **0 a 1000**. Dessa forma, a solução já nasce alinhada às práticas do mercado de crédito e evolui em precisão conforme mais dados históricos são acumulados.

Fluxo Geral:

![Fluxo de Score](docs/assets/fluxo_score.png)


#### 3) Fontes de Dados

##### 3.1 Off-chain (Banco existente)

Tabelas principais já existentes (não alterar):

* `usuarios`
* `negociacoes`
* `propostas`
* `scores_credito` (usaremos apenas `analise` e `valor_score` + `atualizado_em`)
* `metricas_investidor` (apenas se algum campo ajudar na extração; não entra no score final por ser ótica do investidor)

##### 3.2 Externa

* **API Serasa** (score externo para *cold start* e composição do score final).

#### 4) Especificação do `analise`

O `analise` consolida somente métricas de tomador:

```json
{
  "tempo_na_plataforma_meses": 0,
  "emprestimos_contratados": 0,
  "emprestimos_quitados": 0,
  "emprestimos_inadimplentes": 0,
  "taxa_inadimplencia": 0.0,
  "media_taxa_juros_paga": 0.0,
  "media_prazo_contratado": 0,
  "renda_mensal": 0.0,
  "endividamento_estimado": 0.0,
  "propostas_realizadas": 0,
  "propostas_aceitas": 0,
  "media_tempo_negociacao_dias": 0.0
}
```

#### 5) Coleta dos Dados (exemplos de SELECTs)

**Importante:** todos os filtros abaixo consideram o usuário como tomador (ex: `negociacoes.id_tomador = :user_id`).

* **tempo_na_plataforma_meses**

    ```sql
    SELECT EXTRACT(EPOCH FROM (NOW() - u.criado_em)) / 2629800.0 AS meses
    FROM usuarios u
    WHERE u.id = :user_id;
    ```

* **emprestimos_contratados** (negociação “fechada” = `assinado_em IS NOT NULL`)

    ```sql
    SELECT COUNT(*) FROM negociacoes n
    WHERE n.id_tomador = :user_id
      AND n.assinado_em IS NOT NULL;
    ```

* **emprestimos_quitados**

    ```sql
    SELECT COUNT(*) FROM negociacoes n
    WHERE n.id_tomador = :user_id AND n.status = 'quitado';
    ```

* **emprestimos_inadimplentes**

    ```sql
    SELECT COUNT(*) FROM negociacoes n
    WHERE n.id_tomador = :user_id AND n.status = 'inadimplente';
    ```

* **taxa_inadimplencia**

    ```sql
    WITH base AS (
      SELECT COUNT(*)::float AS total
      FROM negociacoes n
      WHERE n.id_tomador = :user_id AND n.assinado_em IS NOT NULL
    ), inad AS (
      SELECT COUNT(*)::float AS qte
      FROM negociacoes n
      WHERE n.id_tomador = :user_id AND n.status = 'inadimplente'
    )
    SELECT CASE WHEN base.total = 0 THEN 0 ELSE (inad.qte / base.total) END AS taxa
    FROM base, inad;
    ```

* **media_taxa_juros_paga / media_prazo_contratado** (assumindo proposta “aceita” referencia os termos finais)

    ```sql
    SELECT AVG(p.taxa_juros_am) AS media_taxa,
          AVG(p.prazo_meses)   AS media_prazo
    FROM propostas p
    JOIN negociacoes n ON n.id = p.id_negociacoes
    WHERE n.id_tomador = :user_id
      AND n.assinado_em IS NOT NULL
      AND p.status = 'aceita';
    ```

* **renda_mensal**

    ```sql
    SELECT COALESCE(u.renda_mensal, 0) FROM usuarios u WHERE u.id = :user_id;
    ```

* **endividamento_estimado** (aprox.: soma valores aceitos e ainda vigentes $\div$ renda)

    ```sql
    WITH renda AS (
      SELECT COALESCE(u.renda_mensal, 0) AS renda FROM usuarios u WHERE u.id = :user_id
    ),
    divida AS (
      SELECT COALESCE(SUM(p.valor), 0) AS aberto
      FROM propostas p
      JOIN negociacoes n ON n.id = p.id_negociacoes
      WHERE n.id_tomador = :user_id
        AND n.status IN ('em andamento')
        AND p.status = 'aceita'
    )
    SELECT CASE WHEN renda.renda = 0 THEN 0 ELSE (divida.aberto / renda.renda) END AS endividamento
    FROM renda, divida;
    ```

* **propostas_realizadas / propostas_aceitas** (como tomador)

    ```sql
    SELECT
      SUM(CASE WHEN p.autor_tipo = 'tomador' THEN 1 ELSE 0 END) AS propostas_realizadas,
      SUM(CASE WHEN p.autor_tipo = 'tomador' AND p.status = 'aceita' THEN 1 ELSE 0 END) AS propostas_aceitas
    FROM propostas p
    JOIN negociacoes n ON n.id = p.id_negociacoes
    WHERE n.id_tomador = :user_id;
    ```

* **media_tempo_negociacao_dias** (da 1ª proposta do tomador até `assinado_em`)

    ```sql
    WITH first_prop AS (
      SELECT MIN(p.criado_em) AS primeira_data
      FROM propostas p
      JOIN negociacoes n ON n.id = p.id_negociacoes
      WHERE n.id_tomador = :user_id
        AND p.autor_tipo = 'tomador'
    ),
    assinada AS (
      SELECT AVG(EXTRACT(EPOCH FROM (n.assinado_em - fp.primeira_data)) / 86400.0) AS media_dias
      FROM negociacoes n CROSS JOIN first_prop fp
      WHERE n.id_tomador = :user_id
        AND n.assinado_em IS NOT NULL
        AND fp.primeira_data IS NOT NULL
    )
    SELECT COALESCE(media_dias, 0.0) FROM assinada;
    ```

Esses `SELECTs` são executados pelo **Score Service** para montar o `analise`.

#### 6) Modelo Interno (Supervisionado)

##### 6.1 Abordagem para Score Interno

* **Por quê?** A solução de análise de crédito precisa gerar um score contínuo (0–1000) que reflita a probabilidade real de inadimplência do tomador. Por isso, adotamos diretamente uma estratégia **supervisionada**, alinhada às práticas consolidadas no mercado financeiro.
* **Abordagem Supervisionada:** Utilizamos dados do histórico operacional do usuário na plataforma (`analise`), combinados com o status das negociações (**quitado vs. inadimplente**).
* O modelo adotado é a **Logistic Regression**, por ser simples, explicável e amplamente usada no mercado de crédito. Esse será o algoritmo de referência para geração do score. Caso o volume e a complexidade dos dados aumentem significativamente, existe a possibilidade de migrar para modelos mais avançados, como XGBoost ou LightGBM, mas apenas como evolução futura.
* Essa probabilidade de default (**PD**) é então convertida em um score padronizado:
  ```
  score = round(1000 * (1 - prob_default))
  ```
* **Vantagens:** **Precisão**, **Escalabilidade** e **Alinhamento com mercado**.
* **Integração simples:** a saída é um único valor contínuo (0–1000), armazenado em `valor_score`, enquanto os insumos ficam no campo `analise`.
* **Tecnologias:**
    * `scikit-learn` $\rightarrow$ **Logistic Regression**, baseline supervisionado.
    * `FastAPI` $\rightarrow$ expor o endpoint `/score`.
    * `SQLAlchemy` $\rightarrow$ coleta de dados.
    * **Batch diário** $\rightarrow$ recalcula `analise` (features) e `valor_score` (score final).

##### 6.2 Pipeline do Modelo Interno

| Fase | Detalhes |
| :--- | :--- |
| **Extração** | Coletar o `analise` de todos os usuários. Buscar rótulos de cada negociação associada (`default` = 1 se inadimplente, 0 caso quitado/em dia). |
| **Preparação** | Conversão de tipos. **Imputação simples** (preencher valores ausentes com a mediana). **Normalização** (`StandardScaler`). Divisão treino/teste: 80% treino, 20% teste, com estratificação. |
| **Treino** (semanal ou mensal) | Algoritmo oficial: **Logistic Regression**. O modelo aprende a prever a probabilidade de default (PD). Persistência: salvar `scaler` + `modelo` em `.joblib`. Métricas de avaliação: AUC-ROC, KS Statistic. |
| **Inferência diária** | Para cada usuário ativo, coletar `analise` atualizado. Aplicar `scaler` + `modelo` treinado. Obter PD $\in [0,1]$. Converter em score interno 0–1000: $$\text{score}=\text{round}(1000\times(1-\text{PD}))$$ |

* **Exemplo:** Usuário com PD = 0.25 $\rightarrow$ Score = 750.
* **Observações:** O pipeline é determinístico e auditável. O cálculo diário garante que mudanças no comportamento do tomador sejam refletidas rapidamente.


#### 7) Fórmula do Score Final

**Média simples** (configurável por ENV; padrão 50/50):

```
final_score = round(0.5 * serasa_score + 0.5 * interno_score)
```

**Fallbacks:**

* Se Serasa indisponível $\rightarrow$ `final = interno_score`
* Se modelo interno indisponível $\rightarrow$ `final = serasa_score`

Não persistimos os intermediários; apenas `analise` e `valor_score` final.


#### 8) Orquestração (Batch diário + Listener)

##### 8.1 Batch Diário (02:00 America/Sao_Paulo)

1.  Para cada usuário tomador ativo: Rodar `SELECTs` $\rightarrow$ montar `analise`.
2.  Atualizar `scores_credito.analise` (`UPDATE`).
3.  **Publicar evento** `score.analise.updated:{user_id}` (Redis Pub/Sub).

  **Score Worker (listener) consome evento:**
  
  * Busca `analise`.
  * Chama Serasa API (com **cache de 24h**).
  * Roda modelo interno (Logistic Regression).
  * Calcula `final_score` (0–1000).
  * Atualiza `scores_credito.valor_score` e `atualizado_em`.

##### 8.2 Listener (on demand)

Toda vez que a aplicação fizer `UPDATE` em `scores_credito.analise`, publica o mesmo evento `score.analise.updated:{user_id}`. O fluxo do *worker* é idêntico ao *batch*.

#### 9) Serviço de Análise — FastAPI

##### 9.1 Endpoints (privados, behind-auth)

* `POST /internal/analysis/recalculate/{user_id}`: Executa `SELECTs`, monta e salva `analise`, publica evento.
* `POST /internal/scores/recalculate/{user_id}`: Força recálculo completo (busca Serasa, roda modelo, salva `valor_score`).
* `POST /internal/scores/recalculate-batch`: Dispara batch diário (com paginação).
* `GET /internal/scores/{user_id}`: Retorna `{ valor_score, atualizado_em }` (leitura do banco).
* `POST /internal/models/retrain`: Re-treina Logistic Regression (uso semanal/mensal).

##### 9.2 Stack e Operação

* **Stack:** FastAPI + Uvicorn, SQLAlchemy, Requests/HTTPX para Serasa, Redis (Pub/Sub).
* **Monitoramento:** Prometheus (`/metrics`) com duração de inferência e QPS.


#### 10) Integração Serasa

##### 10.1 Motivo de uso

* Atribuir score para usuários novos sem histórico (**“cold start”**).
* Servir de componente externo complementar.

##### 10.2 Implementação

* Connector com **cache por 24h** (Redis) para reduzir custos e latência.
* Circuit breaker + retry exponencial.

##### 10.3 Segurança & LGPD

* **Não persistir payload bruto** do Serasa.
* Armazenar apenas: `timestamp` de consulta e valor para composição (usado em memória).


#### 11) Versionamento de Modelo e Reprodutibilidade

* `model_version`: string (ex.: `iforest-2025-09-27`).
* **Artefatos:** `scaler.joblib`, `model.joblib`.
* **Logs de inferência** incluem: `user_id`, `model_version`, `score_interno`, `serasa_used`, `final_score`, `latency_ms`.


#### 12) Observabilidade e Qualidade

* **Métricas:** porcentagem de usuários com `final_score < 300`, mediana do score.
* **Saúde:** taxas de erro Serasa, *cache hit ratio*.
* **Drift check:** monitorar variação de distribuição dos *features* (KS-test simples em batch semanal).

#### 13) Resiliência & Fallback

* Serasa indisponível $\rightarrow$ segue com interno.
* Modelo indisponível $\rightarrow$ segue com Serasa.
* Ambos indisponíveis $\rightarrow$ mantém último `valor_score` e loga incidente.

#### 14) Segurança

* Secrets via Vault/Secrets Manager.
* Conexões TLS, IP allowlist para Serasa.
* **Princípio do mínimo privilégio** (somente SELECT/UPDATE nas colunas necessárias).


#### 15) Roadmap de Evolução (Modelo)

1.  **Fase 1:** Logistic Regression.
2.  **Fase 2:** Enriquecer features (sazonalidade, granularidade por parcela).
3.  **Fase 3:** Ensemble supervisionado (Logistic Regression + modelos de árvore, como XGBoost/LightGBM).

### 11.2 Motor de Recomendação

#### 1) Objetivo
Construir um mecanismo de recomendação que:
- **Para investidores**: sugira empréstimos que mantenham uma carteira diversificada (evitar concentração em apenas um perfil de risco).
- **Para tomadores**: sugira parâmetros de taxa justos e alinhados tanto ao mercado quanto ao histórico do próprio usuário.

A lógica não depende de Machine Learning neste estágio, mas de cálculos estatísticos, filtros e regras de negócio. Isso garante simplicidade, interpretabilidade e performance, além de atender diretamente às necessidades da solução.

#### 2) Escopo e Premissas
- **Investidores**:
  - Recebem recomendações de novos empréstimos no marketplace, baseadas em ranges de valor, taxa e prazo semelhantes aos já investidos, priorizando a diversificação da carteira.
  - Também recebem sugestões de taxa de juros (`taxa_analisada`) quando desejam abrir uma nova proposta de investimento, combinando parâmetros de mercado com seu histórico pessoal.
- **Tomadores**:
  - Recebem sugestão de taxa de juros (`taxa_analisada`) ao criar uma nova proposta de empréstimo, ajustada pela média de mercado e pelo histórico de propostas anteriores.
  - Também recebem recomendações de solicitações de empréstimos semelhantes às que já fizeram, organizadas por parâmetros como prazo, valor e taxa.
- A recomendação não substitui a decisão, apenas apoia com transparência e mensagens claras no front.
- **Orquestração**:
  - **Sugestão de taxa (`taxa_analisada`)**:
    - **Investidores e Tomadores**: a sugestão é calculada on-demand no front, no momento em que o usuário informa valor + prazo de uma nova proposta.
    - O cálculo da taxa combina dados de mercado (faixa média por score) + histórico pessoal.
    - A `taxa_analisada` é exibida em tela, podendo ser opcionalmente registrada em `analise_taxa` apenas para fins de auditoria/analytics.
  - **Recomendações de empréstimos (matching)**:
    - **Investidores**: listener recalcula recomendações sempre que um contrato novo é assinado ou quando novas solicitações entram no marketplace.
    - **Tomadores**: listener recalcula recomendações de solicitações semelhantes sempre que o próprio usuário cria/edita uma proposta ou quando há novas oportunidades no mercado.

Fluxo Geral

![Fluxo da Recomendação](docs/assets/fluxo_recomendacao.png)


#### 3) Fontes de Dados
##### 3.1 Off-chain (Banco existente)
- `usuarios` → perfil do investidor/tomador.
- `negociacoes` → histórico de contratos fechados.
- `propostas` → taxas, prazos e condições aceitas.
- `scores_credito` → score final do tomador.
- `metricas_investidor` → consolidação da carteira (diversificação, histórico).

##### 3.2 Derivados Internos (calculados a partir do banco)
- **Faixas de mercado**: valores agregados que representam a média/mediana das taxas praticadas por faixa de score.
- **Exemplo**:
  - Score 800–1000 → 10–13% a.m.
  - Score 500–799 → 14–18% a.m.
  - Score <500 → acima de 20% a.m.
- Esses dados não vêm de um sistema externo, mas são recalculados internamente em batch diário e usados como insumo para sugerir a `taxa_analisada`.

### 4) Lógica de Recomendação
##### 4.1 Recomendação de Empréstimos/Solicitações
- **Objetivo**: sugerir oportunidades relevantes (para investir ou para solicitar) que se encaixam melhor no perfil do usuário.
- **Passos**:
  1. Coletar histórico do usuário (investimentos ou solicitações anteriores):
     - Valor médio.
     - Faixa de taxa mais recorrente.
     - Prazo médio.
     - Score dos tomadores com quem já se relacionou.
  2. Montar um array de solicitações/empréstimos ativos no marketplace que batem com esse padrão.
  3. Ordenar esse array pelo grau de compatibilidade com o perfil.
- **Exibição no front**:
  - **Tela inicial** → mostrar apenas o primeiro item da lista (recomendação principal).
  - **Botão “Ver todos”** → exibir todas as oportunidades disponíveis, mas com as mais compatíveis no topo.

##### 4.2 Recomendação de Taxa (`taxa_analisada`)
- **Objetivo**: apoiar o usuário ao definir a taxa de uma nova proposta, equilibrando o histórico pessoal com a média de mercado.
- **Passos**:
  1. **Usuário decide abrir nova oferta/solicitação**:
     - Depois de tentar encontrar opções existentes no marketplace, o usuário escolhe abrir uma proposta nova.
  2. **Sistema sugere `taxa_analisada`**:
     - O sistema calcula a taxa sugerida com base em:
       - Média de mercado (faixa de taxa por categoria de score).
       - Histórico do usuário (taxas praticadas em propostas semelhantes calculadas em tempo real a partir dos parâmetros digitados na tela de “Encontrar ofertas/solicitações”, quando o usuário digita os dados de seu empréstimo ideal).
     - Essa taxa é exibida junto de mensagens de contexto (ex.: justa, alta, agressiva).
  3. **Usuário revisa e confirma**:
     - O usuário pode aceitar a taxa sugerida ou definir outra.
     - Nesse momento ele também revisa os demais parâmetros (valor, prazo, perfil de risco aceito).
- **Exibição no front**:
  - Mostrar a taxa sugerida.
  - Mostrar mensagens de contexto, como:
    - “Você definiu uma taxa justa e alinhada à média de mercado para este perfil de risco. Ótimo!”
    - “Esta taxa de juros é muito alta para o mercado. Sua oferta pode ficar muito tempo sem interessados.”
- **Proposta é criada no banco**:
  - Só após a confirmação, a oferta/solicitação é registrada em `propostas`.
  - A `taxa_analisada` pode ser salva para auditoria.

#### 5) Fluxo Técnico (Front ↔ Back)
- **Criação de proposta (investidor ou tomador)**:
  1. **Usuário decide abrir uma nova oferta/solicitação**:
     - Após consultar o marketplace e não encontrar algo compatível, o usuário opta por criar sua própria proposta.
     - Neste momento, ele já informou valor e prazo no front.
  2. **Front solicita recomendação de taxa**:
     - O front envia os parâmetros temporários (valor + prazo + score do tomador, se aplicável) para o serviço de recomendação.
     - O dado ainda não foi persistido no banco, é apenas input de tela.
  3. **Back calcula `taxa_analisada`**:
     - Com base em:
       - Faixa de mercado (média de taxas por score, derivada internamente a partir do histórico da plataforma).
       - Histórico do usuário (taxas médias de propostas anteriores semelhantes, filtradas por valor e prazo próximos aos informados).
     - O back retorna:
       - `taxa_analisada` (valor sugerido).
       - `faixa_mercado` (ex.: `[11%, 14%]`) para comparação.
  4. **Front exibe recomendação**:
     - Mostra a taxa sugerida (`taxa_analisada`).
     - Mostra mensagens de contexto de acordo com a posição da taxa escolhida pelo usuário em relação à `faixa_mercado`:
       - Dentro da faixa → “Taxa justa e alinhada à média de mercado.”
       - Acima da faixa → “Taxa alta, pode demorar a atrair interessados.”
       - Abaixo da faixa → “Taxa agressiva, pode atrair investidores rapidamente, mas avalie se é sustentável.”
  5. **Usuário revisa e confirma**:
     - Pode aceitar a taxa sugerida ou definir outra.
     - Também revisa demais parâmetros (valor, prazo, perfis de risco aceitos, possibilidade de negociação).
  6. **Persistência no banco**:
     - Só ao confirmar, o sistema cria o registro na tabela `propostas`.
     - A `taxa_analisada` pode ser opcionalmente salva em `analise_taxa` para auditoria/analytics, mas não é campo obrigatório da proposta.

#### 6) Serviço de Recomendação — FastAPI
##### Endpoints
- `GET /internal/recommendations/solicitacoes/{user_id}`
  → retorna lista de empréstimos/solicitações no marketplace, ordenados por compatibilidade com o perfil do usuário (investidor ou tomador).
- `GET /internal/recommendations/taxa?user_id=...&valor=...&prazo=...`
  → retorna `taxa_analisada` + faixa de mercado + mensagens de contexto para front exibir ao abrir nova proposta.
- `POST /internal/recommendations/recalculate/{user_id}`
  → força recálculo de métricas do investidor (ex.: diversificação de carteira) e das recomendações de matching.

##### Stack
- FastAPI + Uvicorn.
- SQLAlchemy para métricas de histórico.
- Redis → listener para eventos (assinatura de contratos).

#### 8) Roadmap de Evolução
- **Fase 1 (MVP)**: lógica de regras simples (ranges e médias).
- **Fase 2**: enriquecimento com dados setoriais (agro, serviços, etc.).
- **Fase 3**: possível evolução para ML (learning-to-rank, collaborative filtering) caso base cresça e justifique complexidade.

---

## 12. Smart Contracts (On-chain)
- Estrutura dos contratos
- Principais variáveis armazenadas on-chain
- Eventos emitidos
- Como se relacionam com os dados off-chain

---

## 12. Funcionalidades Principais
- Cadastro e onboarding
- Validação antifraude
- Solicitação de empréstimos
- Negociação (propostas e contrapropostas)
- Execução de smart contracts
- Dashboard de performance
- Recomendações de diversificação
- Integração futura com Open Finance

---

## 13. Requisitos Funcionais
*(Listar todos em formato objetivo, ex.: “O sistema deve...”)*

---

## 14. Requisitos Não Funcionais
*(Listar aspectos de segurança, escalabilidade, conformidade, desempenho, etc.)*

---

## 15. Protótipo no Figma
- Link para o protótipo
- Screenshots de telas principais
- Fluxos simulados
- Observações de design e UX

---

## 16. Fluxos de Integração
### 16.1 Integração com [API Externa X]
- Fluxo de dados
- Autenticação e segurança
- Tratamento de erros

### 16.2 Integração com Blockchain
- Eventos escutados
- Chamadas de função
- Estratégia de sincronização off-chain

---

## 17. Considerações de Arquitetura
- Segurança
- Escalabilidade
- Consistência
- Auditoria
- Conformidade regulatória (LGPD, Bacen, etc.)

---

## 18. Imagens e Diagramas
- Diagramas de fluxo
- Arquitetura de alto nível
- Mockups de telas
- Exemplos de jornadas

---

## 19. Código de Exemplo
- Estrutura mínima de API
- Exemplo de criação de contrato
- Exemplo de integração com frontend

---

## 20. Requisitos Técnicos
- Infraestrutura (servidores, bancos, cache, monitoramento)
- Integrações externas necessárias
- Custos estimados
- Licenciamento

---

## 21. KPIs e Métricas de Sucesso
### KPIs Técnicos
- Disponibilidade
- Latência
- Throughput
- Taxa de erro

### KPIs de Negócio
- Adoção de usuários
- Volume de transações
- Satisfação (NPS)
- Retorno para investidores

---

## 22. Roadmap / Próximos Passos
- Fases de implementação
- Funcionalidades futuras
- Escalabilidade planejada
- Evolução esperada da solução

---

## 23. Anexos
- Referências técnicas
- Links de artigos e papers
- Documentos legais
- Guias de APIs externas
