# Negocia Invest Frontend

React interface para a plataforma Negocia Invest, reunindo tomadores e investidores com fluxos completos de autenticação, dashboards, negociações e notificações em tempo real.

## Highlights

- Dual-profile experience: borrower and investor dashboards with accessible UI.
- Authenticated flows with protected routes and session persistence.
- Negotiation lifecycle with requests, offers, counter proposals, and dashboards.
- Real-time notifications via WebSocket (polling fallback) through the notification center.
- Tailwind + shadcn-inspired component system for rapid UI composition.

## Tech Stack

- React 18 + TypeScript (Vite)
- React Router v6
- @tanstack/react-query
- Axios com interceptors
- Tailwind CSS + tailwindcss-animate
- Socket.io-client para eventos em tempo real


## Requirements

- Node.js 18+
- npm 9+

## Setup

1. Instale dependências com `npm install`.
2. Execute `npm run dev` e acesse `http://localhost:5173`.
3. Defina `VITE_API_URL` em `.env` apontando para o backend FastAPI.

## Scripts

- `npm run dev`: servidor de desenvolvimento Vite.
- `npm run build`: build de produção (`tsc -b && vite build`).
- `npm run lint`: lint opcional quando configurado.

## Estrutura essencial

- `src/contexts`: providers de autenticação, perfil e notificações.
- `src/services`: clientes HTTP para auth, negociações, propostas, score e taxas.
- `src/pages`: páginas de autenticação, dashboard, negociações, marketplace e perfil.
- `src/routes`: rotas protegidas + layout principal.
- `src/components/ui`: componentes base (button, card, toast, input etc.).

## Integração com backend

- Endpoints esperados: `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`, `/negociacoes`, `/propostas`, `/recomendacao/taxa`, `/score/{userId}`.
- Notificações em tempo real via `/ws/notifications`; fallback de polling configurado em `useRealtimeNotifications`.
- Ajuste os serviços conforme contratos finais do FastAPI.

## Desenvolvimento sem backend (mocks)

Para trabalhar no frontend sem um backend rodando, há um modo de mocks local. Defina a variável de ambiente no seu `.env` na raiz do frontend:

- `VITE_MOCK_AUTH=true` — ativa o mock de autenticação (registro/login armazenados no localStorage).
- `VITE_USE_MOCKS=true` — ativa mock das APIs de negociações, propostas, recomendação de taxa e score.

Com ambos ativados, as páginas funcionarão end-to-end emdev sem a necessidade do FastAPI. Os mocks armazenam dados em `localStorage` e retornam shapes compatíveis com os tipos do frontend.

## Próximos passos

- Adicionar testes (Vitest + React Testing Library).
- Refinar validações de formulários com esquemas definitivos da API.
- Documentar variáveis de ambiente e estratégia de deploy.

