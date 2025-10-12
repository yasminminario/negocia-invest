# Frontend Architecture Plan

## Goals
- Deliver an accessible lending platform UI aligned with backend capabilities.
- Support dual-profile users (investor, borrower) with quick switching.
- Implement full auth (sign up, login, session persistence) and secure API interaction.
- Provide dashboards, negotiation flows, and proposal management for both profiles.
- Surface real-time updates via toasts and responsive UI states.

## Tech Stack Decisions
- React 18 with TypeScript (Vite scaffolded).
- React Router v6 for routing.
- @tanstack/react-query for data fetching, caching, and real-time refetch strategies.
- Axios for API client with interceptors (auth token injection, error handling).
- Tailwind CSS + shadcn/ui component primitives for accessible, theme-aware UI.
- Zustand for lightweight global state (profile switching) alongside React Context for auth and notifications.
- Socket.io-client (or native EventSource fallback) to consume backend real-time events when available.

## API Surface Mapping
- **Auth**: POST `/auth/register`, POST `/auth/login`, GET `/auth/me`, POST `/auth/logout` (confirm with backend).
- **Profiles**: GET `/usuarios/{id}` for user info, GET `/score/{user_id}` for credit score, GET `/metricas` (if available) or derive from negotiations/proposals.
- **Negotiations**: GET `/negociacoes`, GET `/negociacoes/{id}`, PUT `/negociacoes/{id}`, POST `/negociacoes`, POST `/negociacoes/{id}/counter` (to be confirmed), POST `/propostas`, GET `/propostas`, GET `/internal/recommendations/solicitacoes/{user_id}`.
- **Rates**: GET `/recomendacao/taxa` for rate suggestions when creating new proposals.

Pending confirmation for any missing endpoints (e.g., proposal acceptance, cancellation, notifications). We will coordinate with backend or add temporary mocks.

## Route Structure
- `/auth/login`
- `/auth/register`
- `/` (protected shell) -> layout that enforces auth and loads user profile.
  - `/dashboard`
  - `/negotiations`
  - `/negotiations/:id`
  - `/negotiations/:id/counter`
  - `/market`
  - `/profile`

## State Management
- **AuthContext**: handles token storage, login/logout, session refresh, and exposes `user` info.
- **ProfileContext** (or Zustand store): holds active profile (`investor` | `borrower`), toggles theme palettes, triggers refetch of role-dependent data.
- **NotificationContext**: wraps shadcn Toast provider, exposes `notify({ title, description, variant })` with optional action buttons.
- **Query Client**: central React Query provider with custom fetch wrappers.

## Theming Strategy
- Base dark layout using Tailwind with CSS variables for background/foreground.
- Role palette tokens:
  - Investor: primary `#9b59b6`, subtle `#efe4f3`.
  - Borrower: primary `#57d9ff`, subtle `#e4f9ff`.
- Provide accessible font sizes (minimum 16px), high contrast, large actionable buttons, clear labels.

## Real-Time Updates
- Integrate WebSocket listener (socket.io or custom) connecting to `/ws/notifications` (to confirm).
- Fallback to polling via React Query `refetchInterval` if websockets unavailable.
- Push incoming events into NotificationContext (toast + optional refresh of relevant queries).

## Implementation Phases
1. **Foundation**
   - Configure Tailwind + shadcn.
   - Set up routing, layout, providers (Auth, Query, Profile, Notification).
   - Implement theme switching tied to profile.
2. **Auth Flows**
   - Register, login forms with React Hook Form + Zod.
   - Persist token (localStorage) and guard routes.
3. **Dashboards**
   - Fetch metrics (scores, counts) based on active profile.
   - Provide quick actions (open negotiation/proposal, view market).
4. **Negotiations & Market**
   - List and filter negotiations/proposals by role.
   - Detail pages with timeline, actions (counter, accept, decline).
   - New negotiation wizard leveraging rate recommendation endpoint.
5. **Real-Time & Notifications**
   - Wire websocket/polling updates to refresh lists and show toasts.
6. **Polish**
   - Accessibility audit (keyboard navigation, ARIA labels).
   - Internationalization placeholders for future (optional).
   - Testing (React Testing Library + Vitest) and docs update.

## Outstanding Questions
- Confirm exact auth endpoints and payload schema.
- Identify backend endpoints for proposal acceptance/contraproposta actions.
- Determine websocket URL/spec or fallback interval expectations.
- Confirm data models for negotiations and proposals to build UI forms accurately.
