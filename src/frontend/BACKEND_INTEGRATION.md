# Integração Backend PostgreSQL

Este documento descreve a estrutura de integração entre o frontend React e o backend PostgreSQL.

## 🏗️ Estrutura do Backend

### Docker Compose
- **PostgreSQL**: Porta 5432
- **Backend API**: Porta 8000
- **Database**: negociaai
- **Network**: negociaai-net

### Tabelas PostgreSQL
- `usuarios` - Dados dos usuários (tomadores e investidores)
- `scores_credito` - Scores de crédito com análise em JSON
- `negociacoes` - Negociações entre tomadores e investidores
- `propostas` - Propostas de taxa dentro das negociações
- `metricas_investidor` - Métricas e perfil dos investidores

## 📁 Arquivos de Integração

### 1. Configuração da API
**Arquivo**: `src/config/api.ts`
- Define a URL base da API
- Endpoints organizados por recurso
- Cliente HTTP com métodos GET, POST, PUT, DELETE

### 2. Serviços da API
**Arquivo**: `src/services/api.service.ts`
- Serviços organizados por domínio:
  - `usuariosService` - CRUD de usuários
  - `scoresService` - Consulta e atualização de scores
  - `negociacoesService` - Gerenciamento de negociações
  - `propostasService` - Criação e atualização de propostas
  - `metricasService` - Métricas de investidores

### 3. Mapeadores de Dados
**Arquivo**: `src/utils/dataMappers.ts`
- Converte dados do banco para tipos do frontend
- Funções principais:
  - `mapUsuarioToUser()` - Usuario → User
  - `mapNegociacaoToNegotiation()` - Negociacao → Negotiation
  - `mapPropostaToNegotiationProposal()` - Proposta → NegotiationProposal
- Helpers para parse e formatação de taxas

### 4. Hooks Customizados
**Arquivo**: `src/hooks/useBackendData.ts`
- `useBackendNegotiations()` - Busca negociações do backend
- `useBackendUser()` - Busca dados do usuário
- Flag `USE_BACKEND` para alternar entre mock e API real

### 5. Tipos TypeScript
**Arquivo**: `src/types/index.ts`
- Interfaces que espelham as tabelas do PostgreSQL:
  - `Usuario`
  - `ScoreCredito`
  - `Negociacao`
  - `Proposta`
  - `MetricasInvestidor`
- Tipos compostos:
  - `NegociacaoCompleta` - Negociação com dados relacionados
  - `PropostaCompleta` - Proposta com dados do autor

## 🔌 Como Integrar

### Passo 1: Configurar URL da API
Criar arquivo `.env` (se necessário) ou ajustar diretamente em `src/config/api.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:8000';
```

### Passo 2: Ativar Backend
Em `src/hooks/useBackendData.ts`, alterar:
```typescript
const USE_BACKEND = true; // Ativa integração real
```

### Passo 3: Substituir Mock Data
Nos componentes que usam `mockData`, substituir por:
```typescript
import { useBackendNegotiations } from '@/hooks/useBackendData';

const MyComponent = () => {
  const { negotiations, loading, error } = useBackendNegotiations({
    autoFetch: true,
    userId: currentUserId,
    userType: 'tomador', // ou 'investidor'
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <NegotiationList negotiations={negotiations} />;
};
```

## 📊 Mapeamento de Status

### Status de Negociação (backend → frontend)
- `em_negociacao` → Negociação ativa, aguardando resposta
- `em_andamento` → Negociação aceita, empréstimo em andamento
- `finalizada` → Negociação concluída e quitada
- `cancelada` → Negociação cancelada
- `pendente` → Aguardando primeira proposta

### Status de Proposta
- `pendente` → Aguardando análise
- `em_analise` → Em análise pela contraparte
- `aceita` → Proposta aceita
- `rejeitada` → Proposta rejeitada
- `cancelada` → Proposta cancelada

### Tipo de Proposta
- `inicial` → Primeira proposta da negociação
- `contraproposta` → Resposta a uma proposta anterior
- `final` → Proposta final aceita

## 🔐 Segurança

⚠️ **IMPORTANTE**: As credenciais do banco de dados **NÃO** devem ser armazenadas no código frontend.

O frontend se comunica apenas com a API backend (porta 8000), que gerencia a conexão segura com o PostgreSQL.

### Credenciais do Backend (apenas referência)
- Database: `negociaai`
- User: `grupo35`
- Essas credenciais ficam no backend e Docker, nunca no frontend

## 🧪 Testando a Integração

1. Garantir que o backend está rodando:
```bash
docker-compose up -d
```

2. Verificar saúde da API:
```bash
curl http://localhost:8000/health
```

3. Ativar flag `USE_BACKEND = true`

4. Acessar a aplicação e verificar dados reais

## 📝 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar tratamento de erros mais robusto
- [ ] Implementar retry automático em caso de falha
- [ ] Adicionar cache de dados com React Query
- [ ] Implementar WebSocket para atualizações em tempo real
- [ ] Adicionar testes de integração

## 🔄 Fluxo de Dados

```
Frontend (React)
    ↓
src/hooks/useBackendData.ts
    ↓
src/services/api.service.ts
    ↓
src/config/api.ts (HTTP Client)
    ↓
Backend API (Port 8000)
    ↓
PostgreSQL (Port 5432)
```
