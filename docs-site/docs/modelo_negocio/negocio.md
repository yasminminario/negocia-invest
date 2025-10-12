## 💵 Modelo de Negócio/Planejamento Financeiro

### Custos

#### Motor de Score (embutido no monólito)

| Item | Descrição | Frequência | Estimativa (R$/mês) |
|------|-----------|------------|----------------------|
| **Infraestrutura** | Uso do container único (backend monolítico) + Redis + Postgres | Contínuo | incluso na infra (~1.800) |
| **Integração Serasa** | Consulta de score externo com cache 24h | Variável (depende nº de usuários) | 2.000 |
| **Equipe Dev/Data** | Desenvolvimento inicial (2 devs backend + 1 data scientist por 3 meses) | Investimento único | 90.000 (único) |
| **Manutenção Modelo** | Re-treino mensal (data scientist) + monitoramento | Recorrente | 8.000 |
| **Segurança & Compliance** | Armazenamento seguro, LGPD, auditoria | Anual | 20.000 (≈1.700/mês) |

**Total Operacional Mensal (score)**: ~11.500  
**Investimento Inicial (score)**: ~90.000  


#### Motor de Recomendação (embutido no monólito)

| Item | Descrição | Frequência | Estimativa (R$/mês) |
|------|-----------|------------|----------------------|
| **Infraestrutura** | Uso do mesmo container monolítico + Redis | Contínuo | incluso na infra (~1.800) |
| **Desenvolvimento** | 2 devs backend por 2 meses (lógica de regras e API) | Investimento único | 60.000 (único) |
| **Manutenção** | Ajuste das regras de recomendação, melhorias de UX | Recorrente | 2.500 |
| **Batch diário** | Cálculo das faixas de mercado e estatísticas | Recorrente | incluso na infra |
| **Analytics/Auditoria** | Armazenamento de taxas sugeridas para análise | Recorrente | 500 |

**Total Operacional Mensal (recomendação)**: ~2.500  
**Investimento Inicial (recomendação)**: ~60.000  

#### Backend Consolidado (Infraestrutura)

| Item | Descrição | Frequência | Estimativa (R$/mês) |
|------|-----------|------------|----------------------|
| **Container Monolítico** | Execução do backend completo (incluindo os motores) | Contínuo | 1.800 |
| **Banco de Dados (RDS)** | Postgres relacional | Contínuo | incluso no valor acima |
| **Redis (ElastiCache)** | Fila/eventos | Contínuo | incluso no valor acima |

**Total Infra Consolidada**: ~1.800/mês   


#### Considerações Importantes

- Arquitetura baseada em **monólito containerizado na AWS** → simplifica custos de infra e orquestração.  
- Infraestrutura compartilhada (container, banco, Redis) → nada de microsserviços isolados neste estágio.  
- Estimativas baseadas em **MVP com 5k–10k usuários ativos/mês**.  
- **Score**: recalculado 1x/dia por usuário ativo (batch).  
- **Recomendação**: usado on-demand ao abrir/criar propostas.  
- **Consultas Serasa**: assumem cache de 24h, custo médio R$ 1–2 por requisição.  
- Principais custos vêm de **equipe de desenvolvimento/data science** e **integração externa**.  
- Modelo pensado para **simplicidade e velocidade no MVP**; no futuro pode evoluir para microsserviços se a escala justificar.

---

## 🔗 Uso da Blockchain Polygon e Smart Contracts

### 1. Por que Blockchain (e por que Polygon)

Imagine o cenário: Carlos (tomador) e Sofia (investidora) negociam um empréstimo dentro do app.  
Tudo corre bem até surgiram algumas dúvidas: **"Será que os termos aceitos são exatamente esses? Será que essa transação realmente foi oficializada?"**  

Tradicionalmente, seria preciso um contrato em papel, custas cartoriais ou confiança cega na plataforma. Contudo, aqui entra a vantagem de se utilizar blockchain: cada negociação aceita é registrada como um **carimbo digital imutável** na **Polygon**, uma rede pública, barata e confiável.  

Isso garante que:
- O **tomador** tem certeza de que as condições que aceitou são as que serão cumpridas.  
- O **investidor** confia que sua decisão está registrada de forma transparente e incontestável.  
- A **plataforma** se posiciona como um árbitro neutro, sem poder manipular acordos e controlando a custódia de valores conforme os termos combinados.  

Este tipo de utilização garante mais mais confiança, menos burocracia, custo muito menor que cartórios ou sistemas tradicionais. A Blockchain de escolha, considerando o cenário da nossa solução, foi a Polygon, já que ela oferece algumas vantagens:

- **Custos baixos**: transações custam centavos de dólar.  
- **Popularidade**: ampla aceitação no ecossistema Web3.  
- **Compatível com ERC-4337 (Account Abstraction)**: permite login com e-mail (Web3Auth), dispensando a gestão manual de chaves privadas pelo usuário.  

### 2. Decisões de design da blockchain pro MVP

- **On-chain**: registramos apenas um **hash da negociação** (evento-only), suficiente como prova pública.  
- **Off-chain**: todos os dados sensíveis (nome, CPF, score, histórico, valores) ficam no banco relacional (armazenado em nuvem, através do banco RDS).  
- **Wallet automática**: criada ou logada (caso existente) para o usuário via **Web3Auth** + **Account Abstraction**, simplificando a experiência, já que o usuário não passa pelo atrito de necessidade de gerenciamento de blockchain.  
- **Backend**: garante integridade (gera o hash canônico) e audita o status da transação.  

Em termos de negócio:  
- Reduzimos custo (pagando apenas por eventos de registro de empréstimo na blockchain).  
- Ganhamos a **força de uma evidência pública** em caso de disputas.  
- Entregamos ao usuário uma sensação de **segurança comparável a um cartório**, mas em segundos e dentro do app.

---

## Fluxo resumido de uso

1. **Onboarding**: Carlos cria conta com e-mail → app detecta que ele não tem uma smart wallet, portanto, gera uma automaticamente.  
2. **Perfil**: o backend consulta score do Serasa e cruza com histórico de uso.  
3. **Negociação**: Carlos e Sofia trocam propostas até chegarem a um acordo.  
4. **Registro on-chain**: o backend gera um `termsHash`, e a smart wallet do usuário assina o envio.  
5. **Confirmação**: a blockchain devolve um `tx_hash`, que é armazenado no banco e exibido para ambos.  

Assim, Carlos sabe que o contrato dele está **protegido contra alterações**, e Sofia sabe que sua decisão está **publicamente comprovada**.

## Análise de Custos Financeiros da Blockchain

### Premissas do Cenário
- **Usuários ativos**: 5.000  
- **Empréstimos/mês por usuário**: 5 (cenário improvável, mas bom para stress test)  
- **Total transações/mês** = 5.000 × 5 = **25.000**  
- **Total transações/ano** = 25.000 × 12 = **300.000**  

Cada transação corresponde ao **registro on-chain do hash da negociação** (evento-only).  
O custeio do gas será patrocinado pela solução, via **Paymaster**, evitando preocupações de custos do usuário.  

---

### 1. Custos de Gas – Polygon PoS
- **Gas médio por evento**: 50.000 gas  
- **Gas price médio**: 30 gwei (0,00000003 MATIC)  
- **Custo por transação** = 50.000 × 30 gwei = **0.0015 MATIC**  
- **Conversão (MATIC ~ US$ 0.50)** → **US$ 0.00075 por transação**

Totais:
- **Mensal (25.000 tx)** ≈ **US$ 18,75**  
- **Anual (300.000 tx)** ≈ **US$ 225,00**

---

## 2. Custos de Identidade – Web3Auth (AA + MPC)
- Free tier até 1.000 MAUs.  
- Estimativa: **US$ 0.05 / usuário ativo**.  

Totais:
- **Mensal (5.000 usuários)** ≈ **US$ 250**  
- **Anual** ≈ **US$ 3.000**

## Modelo de Negócio

### Custos

#### Motor de Score (embutido no monólito)

| Item | Descrição | Frequência | Estimativa (R$/mês) |
|------|-----------|------------|----------------------|
| **Infraestrutura** | Uso do container único (backend monolítico) + Redis + Postgres | Contínuo | incluso na infra (~1.800) |
| **Integração Serasa** | Consulta de score externo com cache 24h | Variável (depende nº de usuários) | 2.000 |
| **Equipe Dev/Data** | Desenvolvimento inicial (2 devs backend + 1 data scientist por 3 meses) | Investimento único | 90.000 (único) |
| **Manutenção Modelo** | Re-treino mensal (data scientist) + monitoramento | Recorrente | 8.000 |
| **Segurança & Compliance** | Armazenamento seguro, LGPD, auditoria | Anual | 20.000 (≈1.700/mês) |

**Total Operacional Mensal (score)**: ~11.500  
**Investimento Inicial (score)**: ~90.000  


#### Motor de Recomendação (embutido no monólito)

| Item | Descrição | Frequência | Estimativa (R$/mês) |
|------|-----------|------------|----------------------|
| **Infraestrutura** | Uso do mesmo container monolítico + Redis | Contínuo | incluso na infra (~1.800) |
| **Desenvolvimento** | 2 devs backend por 2 meses (lógica de regras e API) | Investimento único | 60.000 (único) |
| **Manutenção** | Ajuste das regras de recomendação, melhorias de UX | Recorrente | 2.500 |
| **Batch diário** | Cálculo das faixas de mercado e estatísticas | Recorrente | incluso na infra |
| **Analytics/Auditoria** | Armazenamento de taxas sugeridas para análise | Recorrente | 500 |

**Total Operacional Mensal (recomendação)**: ~2.500  
**Investimento Inicial (recomendação)**: ~60.000  


#### Backend Consolidado (Infraestrutura)

| Item | Descrição | Frequência | Estimativa (R$/mês) |
|------|-----------|------------|----------------------|
| **Container Monolítico** | Execução do backend completo (incluindo os motores) | Contínuo | 1.800 |
| **Banco de Dados (RDS)** | Postgres relacional | Contínuo | incluso no valor acima |
| **Redis (ElastiCache)** | Fila/eventos | Contínuo | incluso no valor acima |

**Total Infra Consolidada**: ~1.800/mês   


#### Considerações Importantes

- Arquitetura baseada em **monólito containerizado na AWS** → simplifica custos de infra e orquestração.  
- Infraestrutura compartilhada (container, banco, Redis) → nada de microsserviços isolados neste estágio.  
- Estimativas baseadas em **MVP com 5k–10k usuários ativos/mês**.  
- **Score**: recalculado 1x/dia por usuário ativo (batch).  
- **Recomendação**: usado on-demand ao abrir/criar propostas.  
- **Consultas Serasa**: assumem cache de 24h, custo médio R$ 1–2 por requisição.  
- Principais custos vêm de **equipe de desenvolvimento/data science** e **integração externa**.  
- Modelo pensado para **simplicidade e velocidade no MVP**; no futuro pode evoluir para microsserviços se a escala justificar.

### 💵 **Fontes de Receita Pensadas**

#### 1) Taxa sobre cada empréstimo
- **Descrição**: cobrança de uma taxa de intermediação em cada contrato fechado.  
- **Modelo possível**: percentual sobre o valor do empréstimo (ex.: 1%–3%).  
- **Observação**: precisa de validação jurídica para garantir conformidade com o Banco Central (SEP – Sociedade de Empréstimo entre Pessoas).

#### 2) Cobrança por inadimplência
- **Descrição**: taxa administrativa aplicada em casos de atraso, para cobrir custos de cobrança e eventual registro em bureaus de crédito (ex.: Serasa).  
- **Objetivo**: compensar o risco operacional e desestimular o atraso.

#### 3) Parcerias com empresas/serviços
- **Descrição**: acordos com terceiros para geração de receita indireta, como:  
  - Seguradoras (proteção contra inadimplência).  
  - Bureaus de crédito (consultas adicionais).  
  - Instituições financeiras (wallets digitais, custódia).  
- **Objetivo**: diversificar receitas sem onerar diretamente a operação principal.

--- 

## 📈 Planos Futuros e Evolução da Plataforma

Para garantir que o *Negoci.ai* continue na vanguarda da inovação em empréstimos P2P, planejamos três grandes evoluções para o futuro da plataforma, focadas em torná-la mais inclusiva, inteligente e precisa.