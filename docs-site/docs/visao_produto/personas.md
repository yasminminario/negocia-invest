### 🧑 Persona 1: O Tomador Planejado (Carlos)

**Nome:**	Carlos, 30 anos 
**Profissão:**	Profissional de TI 
**Score:**	Excelente (790)

### Cenário:
Carlos é um profissional dedicado e financeiramente responsável. Ele sempre pagou suas contas em dia e construiu um ótimo score de crédito ao longo dos anos. Ele quer fazer um curso de especialização em Inteligência Artificial que custa R$10.000, um investimento que pode alavancar seu salário em até 30% em um ano, mas ele não quer descapitalizar sua reserva de emergência.

### Objetivos:

- Conseguir um empréstimo de R$10.000 com o mínimo de burocracia.

- Pagar uma taxa de juros justa, que reflita seu status de excelente pagador.

- Sentir que seu bom comportamento financeiro é reconhecido e recompensado.

### Frustrações (A Jornada que o trouxe até aqui):

- **A Frustração com os Grandes Bancos:** Carlos primeiro foi ao seu banco tradicional. Por ser cliente há anos, achou que teria uma boa oferta. O banco lhe ofereceu um crédito pré-aprovado, mas com uma taxa de juros padrão, alta, a mesma que ofereceriam para alguém com score muito inferior. Ele se sentiu apenas mais um número em uma planilha, e seu bom histórico não valeu nada.

- **A Frustração com as Fintechs Tradicionais:** Em seguida, ele tentou uma fintech de crédito conhecida. O processo foi rápido e digital, mas o algoritmo, apesar de reconhecer seu bom score, só liberou um limite de R$7.500 – insuficiente para seu curso. Não havia canal para explicar seu objetivo ou para solicitar uma reavaliação. A decisão foi final, fria e sem espaço para diálogo.

- **A Dor Principal do Carlos:** Ele percebe uma grande injustiça no mercado. *"De que adianta eu ser um ótimo pagador e ter um score excelente se, no final, sou tratado com as mesmas taxas abusivas ou com limites que não atendem minha necessidade? Eu não quero um favor, quero uma condição justa pelo meu bom perfil."*

### 👩 Persona 2: A Investidora Estratégica (Sofia)
**Nome:**	Sofia, 45 anos
**Profissão:**	Gerente de Projetos
**Perfil de Investidora:**	Moderado

### Cenário:
Sofia tem um bom capital guardado e busca diversificar seus investimentos. Ela já investe em opções de renda fixa (CDB, Tesouro), mas está frustrada com a baixa rentabilidade. Ela também tem ações, mas não gosta da volatilidade e da falta de controle.

### Objetivos:

- Obter uma rentabilidade superior à da renda fixa tradicional.

- Investir em ativos com um risco controlado e previsível.

- Ter transparência e controle sobre onde seu dinheiro está alocado.

### Frustrações (O que a faz buscar alternativas):

- **Renda Fixa:** Retornos muito baixos, mal acompanham a inflação.

- **Bolsa de Valores:** Muita volatilidade e requer um acompanhamento constante que ela não tem tempo para fazer.

- **Outras Plataformas P2P:** Ela já explorou outras plataformas P2P, mas o modelo era uma "caixa-preta". Ela colocava o dinheiro em um "fundo" de risco moderado, mas não sabia exatamente para quem estava emprestando. Ela não tinha poder de escolha ou negociação.

- **A Oportunidade que Sofia Vê:** *"Eu quero investir em pessoas, não apenas em siglas. Se uma plataforma pudesse me apresentar uma carteira de tomadores já pré-selecionados, com os melhores scores do Brasil, e me desse a chance de negociar um retorno justo diretamente com eles, eu teria o melhor dos dois mundos: risco baixo e rentabilidade atrativa."*

---

## 🔵 Fluxo 1: Jornada do Tomador (Carlos) – O Fluxo Principal

Jornada mais detalhada do protótipo, desde o **cadastro até a negociação** de um empréstimo.

### 1. Cadastro e Onboarding *(Cadastro 1-4 a 4-4)*
- Criação de conta com e-mail e senha.  
- Preenchimento de dados pessoais para análise de crédito.  
- Verificação facial (KYC – *Know Your Customer*).  
- Tela final de sucesso com direcionamento para login.  

### 2. Login e Seleção de Perfil *(Entrar 1-2, Entrar 2-2)*
- Após login, usuário escolhe entre **Tomador** ou **Investidor**.  
- Cards explicativos orientam sobre cada perfil.  
- Lembrete de como alternar entre perfis posteriormente.  

### 3. Dashboard do Tomador *(Dashboard Tomador)*
- **Anel de score** em destaque, com feedback visual do crédito.  
- Cards de **Produtos ativos**: *Empréstimos* e *Negociações*.  
- Pontos de entrada para:  
  - Empréstimos Solicitados.  
  - Negociações de Ofertas (Tomador).  

### 4. O Core da Solução – A Negociação
- **Passo 4a – Descoberta**: Dashboard → Detalhes da oferta.  
  - Lista de empréstimos disponíveis.  
  - Usuário visualiza condições propostas.  

- **Passo 4b – Ação**: Detalhes da oferta.  
  - Opções: *Aceitar oferta* ou *Iniciar negociação* (CTA principal).  

- **Passo 4c – A Proposta** *(Negociação 1-2)*  
  - Comparação entre oferta original e proposta do usuário.  
  - Ajuste de taxa em *slider* com “Zona sugerida”.  
  - Visualização em tempo real da economia estimada.  
  - Justificativa escrita para humanizar a negociação.  

- **Passo 4d – Sucesso** *(Negociação 2-2)*  
  - Confirmação da proposta enviada.  
  - Orientação para acompanhar via notificações.  

---

## 🟣 Fluxo 2: Jornada da Investidora (Sofia) – O Fluxo Complementar

Prototipado para mostrar momentos críticos de interação, mantendo consistência com o fluxo do Tomador.

### 1. Dashboard da Investidora *(Dashboard Investidor)*
- Interface muda para **roxo**.  
- Destaques: Rentabilidade e Lucro.  
- Cards de **Produtos ofertados ativos** levam para:  
  - Empréstimos Concedidos.  
  - Negociações de Ofertas (Investidor).  

### 2. A Análise e a Contraproposta – O Core do Investidor
- **Passo 2a – Análise (Detalhes da negociação)**  
  - Visualização da proposta original + contraproposta do tomador.  
  - Diferença de valores + justificativa escrita.  
  - Perfil detalhado do tomador (Pontuação, tempo de conta etc.).  

- **Passo 2b – Ação (Contraproposta)**  
  - Caso não aceite a proposta do tomador.  
  - Tela espelho da negociação do Tomador.  

### 3. A Antecipação de recebíveis

- **Passo 3a – Acessar Empréstimo em Andamento**  
    - Lista de empréstimos concedidos com status detalhado.  
    - Selecionar um empréstimo para abrir a tela de detalhes e ações disponíveis.  

- **Passo 3b – Simulação de Antecipação de Parcelas**  
    - Opção: "Antecipar parcelas" na tela do empréstimo.  
    - Escolha: selecionar número X de parcelas a antecipar (controle por slider ou campo numérico) ou opção "Antecipar todas".  
    - Botão "Simular" gera pré-visualização com:  
        - Parcelas selecionadas e soma do valor nominal.  
        - Taxa da antecipação: valor percentual proporcional às parcelas antecipadas que será repassado para a instituição financeira.  
        - Valor líquido a ser recebido pelo investidor após dedução da taxa.  
        - Impacto no retorno estimado. 
    - Exibir explicações rápidas sobre como a taxa é calculada (percentual sobre o valor antecipado).

- **Passo 3c – Confirmação da Antecipação**  
    - Tela com resumo detalhado (parcelas, valor bruto, taxa da antecipação, valor líquido, impacto no portfólio de empréstimos concedidos).  
    - Botão "Confirmar Antecipação".  
    - Confirmação da transação de antecipação na blockchain.

- **Passo 3d – Sucesso e Registro**  
    - Mensagem de sucesso.
    - Notificação enviada ao investidor.  
    - Atualização imediata no dashboard do investidor (saldo disponível, novo fluxo de caixa, histórico da operação).  

### 4. Telas Análogas
- Fluxo de criação de uma oferta *(Ofertar empréstimo 1-4 etc.)*.  
- Prototipado para mostrar consistência visual.  
- Fluxo completo seria análogo ao de *Solicitar Empréstimo* do Tomador.  

---