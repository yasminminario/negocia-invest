# 🔌 Guia de Integração com Backend

Este projeto está **100% pronto** para integração com o backend FastAPI + PostgreSQL.

## ✅ Checklist de Preparação

### 1. Estrutura Existente
- ✅ `src/config/api.ts` - Configuração centralizada de endpoints
- ✅ `src/services/api.service.ts` - Serviços de API completos
- ✅ `src/utils/dataMappers.ts` - Mapeadores Backend ↔ Frontend
- ✅ `src/hooks/useBackendData.ts` - Hook para consumir dados reais
- ✅ Design System completo com CSS variables
- ✅ Componentes reutilizáveis
- ✅ Sistema de notificações
- ✅ Seção de ajuda contextual

---

## 🚀 Passo a Passo para Integração

### Passo 1: Configurar Variáveis de Ambiente

1. Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite `.env` e configure a URL do backend:
```env
VITE_API_URL=http://localhost:8000  # Ou URL de produção
```

### Passo 2: Ativar o Backend no Código

Abra `src/hooks/useBackendData.ts` e altere:

```typescript
// Linha 12
const USE_BACKEND = true; // Alterar de false para true
```

### Passo 3: Testar a Conexão

1. Certifique-se de que o backend está rodando em `http://localhost:8000`
2. Acesse o app e verifique os logs do console
3. Os dados reais do PostgreSQL devem aparecer automaticamente

---

## 📊 Estrutura de Dados

### Endpoints Mapeados

| Recurso | Endpoint | Serviço |
|---------|----------|---------|
| Usuários | `/usuarios` | `usuariosService` |
| Scores | `/scores_credito` | `scoresService` |
| Negociações | `/negociacoes` | `negociacoesService` |
| Propostas | `/propostas` | `propostasService` |
| Métricas | `/metricas_investidor` | `metricasService` |

### Mapeamento de Dados

O projeto possui mapeadores automáticos em `src/utils/dataMappers.ts`:

- `mapUsuarioToUser()` - Converte usuário do banco para o formato do frontend
- `mapNegociacaoToNegotiation()` - Converte negociação completa
- `mapPropostaToNegotiationProposal()` - Converte propostas
- Helpers para parsing de taxas e datas

---

## 🔄 Alternando entre Mock e Backend Real

### Usando Dados Mock (Desenvolvimento)
```typescript
// src/hooks/useBackendData.ts
const USE_BACKEND = false;
```

### Usando Backend Real
```typescript
// src/hooks/useBackendData.ts
const USE_BACKEND = true;
```

---

## 🛠️ Personalização da API

### Adicionar Novo Endpoint

1. **Adicione em `src/config/api.ts`:**
```typescript
export const API_ENDPOINTS = {
  // ... endpoints existentes
  meuNovoEndpoint: '/meu-endpoint',
};
```

2. **Crie o serviço em `src/services/api.service.ts`:**
```typescript
export const meuNovoService = {
  getAll: () => apiClient.get(API_ENDPOINTS.meuNovoEndpoint),
  // ... outros métodos
};
```

3. **Use no componente:**
```typescript
import { meuNovoService } from '@/services/api.service';

const dados = await meuNovoService.getAll();
```

### Adicionar Headers de Autenticação

Edite `src/config/api.ts`:

```typescript
export const getHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` }),
});
```

---

## 🎨 Design System

Todas as cores usam CSS variables em `src/index.css`:

```css
--borrower: 198 100% 55%;      /* Azul tomador */
--investor: 283 60% 50%;       /* Roxo investidor */
--positive: 142 76% 40%;       /* Verde sucesso */
--negative: 0 84% 60%;         /* Vermelho erro */
```

**Benefícios:**
- ✅ Fácil customização
- ✅ Modo escuro pronto (se necessário)
- ✅ Consistência visual garantida

---

## 📱 Funcionalidades Implementadas

### Para Tomadores (Borrowers)
- ✅ Dashboard com score e ações rápidas
- ✅ Buscar e filtrar ofertas
- ✅ Criar solicitações de empréstimo
- ✅ Negociar taxas com investidores
- ✅ Visualizar empréstimos ativos
- ✅ Histórico de propostas
- ✅ Notificações em tempo real

### Para Investidores (Investors)
- ✅ Dashboard com métricas de portfólio
- ✅ Buscar solicitações de tomadores
- ✅ Criar ofertas de empréstimo
- ✅ Negociar taxas
- ✅ Gerenciar empréstimos ativos
- ✅ Visualizar diversificação
- ✅ Notificações em tempo real

### Recursos Globais
- ✅ Sistema de notificações com bell icon
- ✅ Seção de ajuda contextual por perfil
- ✅ Loading states com skeletons
- ✅ Confirmações para ações críticas
- ✅ Toast feedback para todas ações
- ✅ Animações sutis (hover-scale, fade-in)
- ✅ SEO otimizado com meta tags
- ✅ Design responsivo completo

---

## 🐛 Troubleshooting

### Erro: "API Error: Failed to fetch"
- Verifique se o backend está rodando
- Confirme a URL em `.env`
- Verifique CORS no backend

### Dados não aparecem
- Confirme que `USE_BACKEND = true`
- Verifique logs do console
- Teste endpoints diretamente no Postman/Insomnia

### Tipos TypeScript incompatíveis
- Verifique os mapeadores em `src/utils/dataMappers.ts`
- Atualize tipos em `src/types/index.ts` se necessário

---

## 📚 Próximos Passos Sugeridos

1. **Autenticação Real**
   - Adicionar JWT tokens
   - Proteger rotas privadas
   - Persistir sessão do usuário

2. **Websockets para Real-time**
   - Notificações push
   - Atualizações de negociações em tempo real

3. **Deploy**
   - Configurar CI/CD
   - Variáveis de ambiente de produção
   - Monitoramento de erros

---

## 📞 Suporte

Se encontrar problemas durante a integração:

1. Verifique o console do navegador para erros
2. Teste endpoints diretamente com Postman
3. Revise os mapeadores de dados
4. Confirme tipos no TypeScript

**Projeto 100% pronto para receber dados do backend! 🚀**
