# 🔌 Guia Completo de Integração com Backend

Este projeto está **100% pronto** para integração com o backend FastAPI + PostgreSQL.

## ✅ O que já está pronto

### 1. Estrutura de Integração Completa
- ✅ `src/config/api.ts` - Configuração centralizada de endpoints
- ✅ `src/services/api.service.ts` - Serviços de API completos
- ✅ `src/utils/dataMappers.ts` - Mapeadores Backend ↔ Frontend
- ✅ `src/hooks/useBackendData.ts` - Hook para consumir dados reais
- ✅ `.env.example` - Template de variáveis de ambiente

### 2. Features Implementadas
- ✅ Design System completo com CSS variables
- ✅ Componentes reutilizáveis
- ✅ Sistema de notificações
- ✅ Seção de ajuda contextual por perfil
- ✅ Loading states com skeletons
- ✅ Confirmações para ações críticas
- ✅ Toast feedback
- ✅ Animações sutis
- ✅ SEO otimizado

---

## 🚀 Integração em 3 Passos

### Passo 1: Configurar Variáveis de Ambiente

```bash
# 1. Copie o template
cp .env.example .env

# 2. Edite o .env
VITE_API_URL=http://localhost:8000
```

### Passo 2: Ativar o Backend

Abra `src/hooks/useBackendData.ts` linha 12:

```typescript
// ANTES
const USE_BACKEND = false;

// DEPOIS
const USE_BACKEND = true;
```

### Passo 3: Testar

```bash
# Certifique-se que o backend está rodando
curl http://localhost:8000/usuarios

# Inicie o frontend
npm run dev
```

**Pronto! Os dados do PostgreSQL aparecerão automaticamente! 🎉**

---

## 📊 Endpoints Mapeados

| Recurso | Endpoint Backend | Serviço Frontend |
|---------|------------------|------------------|
| Usuários | `GET /usuarios` | `usuariosService.getAll()` |
| Scores | `GET /scores_credito` | `scoresService.getByUserId(id)` |
| Negociações | `GET /negociacoes` | `negociacoesService.getAll()` |
| Propostas | `POST /propostas` | `propostasService.create(data)` |
| Métricas | `GET /metricas_investidor` | `metricasService.getByUsuario(id)` |

---

## 🔄 Fluxo de Dados

```
Componente React
    ↓
useBackendData Hook (autoFetch: true)
    ↓
api.service (negociacoesService.getAll())
    ↓
api.ts (apiClient.get('/negociacoes'))
    ↓
FastAPI Backend (http://localhost:8000)
    ↓
PostgreSQL (negociaai)
    ↓
Dados retornam mapeados para o frontend
```

---

## 🛠️ Customização

### Adicionar Novo Endpoint

1. **Em `src/config/api.ts`:**
```typescript
export const API_ENDPOINTS = {
  // ... existentes
  meuEndpoint: '/meu-endpoint',
};
```

2. **Em `src/services/api.service.ts`:**
```typescript
export const meuService = {
  getAll: () => apiClient.get(API_ENDPOINTS.meuEndpoint),
};
```

3. **Usar no componente:**
```typescript
import { meuService } from '@/services/api.service';
const dados = await meuService.getAll();
```

### Adicionar Autenticação

Em `src/config/api.ts`:

```typescript
export const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};
```

---

## 📁 Arquivos Importantes

### `src/config/api.ts`
Configuração central da API com URL base e endpoints

### `src/services/api.service.ts`
Serviços organizados por recurso (usuários, scores, negociações, etc)

### `src/utils/dataMappers.ts`
Converte dados do backend (snake_case) para frontend (camelCase)

### `src/hooks/useBackendData.ts`
Hook React para buscar dados com loading/error states

---

## 🎨 Design System

Todas as cores são CSS variables em `src/index.css`:

```css
--borrower: 198 100% 55%;      /* Azul tomador */
--investor: 283 60% 50%;       /* Roxo investidor */
--positive: 142 76% 40%;       /* Verde sucesso */
--negative: 0 84% 60%;         /* Vermelho erro */
```

**Benefício:** Trocar cores em um único lugar atualiza todo o app!

---

## 🐛 Troubleshooting

### ❌ "API Error: Failed to fetch"
- Backend está rodando? `curl http://localhost:8000/usuarios`
- URL correta no `.env`? `VITE_API_URL=http://localhost:8000`
- CORS habilitado no backend?

### ❌ Dados não aparecem
- `USE_BACKEND = true` em `useBackendData.ts`?
- Console do navegador tem erros?
- Endpoints funcionam no Postman?

### ❌ Tipos TypeScript incompatíveis
- Verifique mapeadores em `src/utils/dataMappers.ts`
- Atualize tipos em `src/types/index.ts`

---

## 📚 Próximos Passos Sugeridos

1. **Autenticação Real** - JWT tokens + proteção de rotas
2. **Websockets** - Notificações em tempo real
3. **React Query** - Cache inteligente de dados
4. **Deploy** - CI/CD + variáveis de produção

---

## 📞 Documentação Completa

- `BACKEND_INTEGRATION.md` - Detalhes técnicos da arquitetura
- `INTEGRATION_GUIDE.md` - Guia passo a passo detalhado
- `.env.example` - Template de variáveis de ambiente

---

**Projeto pronto para integração! Clone, configure e conecte! 🚀**
