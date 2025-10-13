# 5. Arquitetura do Frontend

## 5.1 Visão Geral da Stack
- **Base tecnológica:** Vite + React 18 com TypeScript, estilização via Tailwind CSS e componentes pré-construídos do shadcn/ui.
- **Gerenciamento de estado local:** Hooks e Context API (Auth, Profile, Notification), priorizando coesão por domínio.
- **Apoio visual:** ícones Lucide, tipagem rigorosa em `src/types` e utilitários em `src/lib` para consistência de formatação e regras de negócio.
- **Construção & build:** scripts npm (`dev`, `build`, `preview`) e integração com linting/formatadores definidos em `eslint.config.js` e Tailwind.

## 5.2 Organização de Pastas
```
src/
├─ app/              # Inicialização do React (AppProviders, AppRoutes)
├─ assets/           # Imagens, ícones e recursos estáticos
├─ components/
│  ├─ accessibility/ # Menus e recursos de inclusão (ex.: AccessibilityMenu)
│  ├─ common/        # Cabeçalhos, rodapés, menus compartilhados
│  ├─ help/          # Diálogos de onboarding, ajuda contextual
│  ├─ notifications/ # Bell, toast e lista de avisos
│  └─ ui/            # Átomos reutilizáveis (button, card, input, label, toast)
├─ config/           # Configurações globais (ex.: api.ts)
├─ contexts/         # React Contexts (AuthContext, ProfileContext, NotificationContext)
├─ hooks/            # Hooks customizados (ex.: useRealtimeNotifications)
├─ layouts/          # Layouts de página (MainLayout)
├─ lib/              # Funções utilitárias e helpers
├─ locales/          # Catálogo de traduções (pt, en, es)
├─ pages/            # Páginas segmentadas por domínio (auth, dashboard, market, negotiations, profile)
├─ routes/           # Proteção e definição de rotas (AppRoutes, ProtectedRoute)
└─ services/         # Camada de comunicação com backend (auth, negotiations, proposals, rates, score)
```

**Convenções principais:**
- Estrutura orientada a domínio para facilitar evolução independente de fluxos (auth, negotiations etc.).
- Componentes visuais básicos vivem em `components/ui`; peças compostas reaproveitáveis migram para `components/common`.
- Responsabilidades de API ficam isoladas em `services`, sempre tipadas e encapsuladas em funções puras.

## 5.3 Componentização
- **Átomos (`components/ui`):** implementam tokens de design (botões, inputs, cards, labels, textarea, toast). Eles recebem classes utilitárias Tailwind e podem ser estendidos via `className` para manter consistência.
- **Componentes Compostos:** `LanguageSwitcher`, `MobileMenu`, `Header`, `HelpDialog`, `AccessibilityMenu`, `NotificationBell` interligam múltiplos átomos respeitando acessibilidade (aria labels, tooltips, estados focados).
- **Layouts:** `MainLayout` integra cabeçalho, navegação lateral e conteúdo principal, garantindo responsividade e breakpoints definidos pelo Tailwind.
- **Páginas:** Cada pasta em `pages/` orquestra componentes e serviços para entregar fluxos completos (ex.: `pages/negotiations/NewNegotiationPage.tsx` consome serviços de negociações, contextos de usuário e ui components).

## 5.4 Estado Compartilhado & Hooks
- `AuthContext`: centraliza sessão, persistência de token e disponibiliza métodos de login/logout.
- `ProfileContext`: controla perfil ativo (investidor/tomador), habilitando rotas e dashboards específicos.
- `NotificationContext`: armazena notificações em tempo real, permite marcar uma ou todas como lidas e alimenta `NotificationBell`.
- Hooks customizados (`hooks/useRealtimeNotifications.ts`, `hooks/useToast`) encapsulam assinaturas e side effects, mantendo páginas enxutas.

## 5.5 Comunicação com APIs
- Arquivo `config/api.ts` define base URL, instância HTTP (axios/fetch) e interceptadores.
- `services/*.ts` exportam funções assíncronas por domínio (auth, proposals, negotiations, rates, score). Cada função:
  - Recebe parâmetros tipados;
  - Chama endpoint correspondente;
  - Normaliza a resposta para objetos consumidos pela UI.
- Tratamento de erros: funções propagam exceções padronizadas, habilitando toasts e feedbacks consistentes no front.

## 5.6 Internacionalização
- Biblioteca `react-i18next` configurada em `AppProviders.tsx`.
- Traduções agrupadas por língua em `locales/{pt,en,es}/common.json`, mantendo chaves estruturadas (`header.*`, `auth.*`, `dashboard.*`, `negotiations.*`, `help.*`).
- `LanguageSwitcher` expõe seletor global desde telas de login/cadastro, atualizando `i18n.language` e persistindo preferência.
- Testes de consistência: chave ausente aciona fallback visual e é monitorada durante builds (`npm run build`).

## 5.7 Acessibilidade & Usabilidade
- **Teclado:** Botões, diálogos e menus recebem `aria-label`, `role` e estados focados (`focus:ring`, `sr-only`), garantindo navegação sem mouse.
- **Conteúdo de apoio:** Ícones do cabeçalho trazem labels textuais em múltiplos idiomas, reforçando compreensão visual e auditiva.
- **Contraste & temática:** Tailwind tokens e tema shadcn mantêm contraste AA. Classes `bg-primary/20`, `text-muted-foreground` equilibram hierarquia.
- **Feedback imediato:** Toasts (`components/ui/toast.tsx` e `use-toast.ts`) sinalizam sucesso/erro; modais (`HelpDialog`, `AccessibilityMenu`) trazem explicações contextualizadas.
- **Preferências de acessibilidade:** `AccessibilityMenu` oferece ajustes de fonte, alto contraste e leitura guiada, persistindo escolhas do usuário.

## 5.8 Fluxos Principais da Interface
- **Onboarding & Autenticação (`pages/auth`)**
  - `LoginPage`, `RegisterPage`, `ProfilePage`: suporte a troca de idioma, explicações contextuais e validações inline.
  - `ProtectedRoute` protege áreas privadas, redirecionando conforme sessão.
- **Dashboard**
  - `pages/dashboard/DashboardPage.tsx` agrega KPIs, gráficos e alertas conforme perfil ativo.
  - Widgets reutilizam componentes `card`, `button` e gráficos conectados ao score.
- **Mercado & Negociações (`pages/market`, `pages/negotiations`)**
  - Listagem de oportunidades, filtros por taxa/prazo e detecção de match de perfil.
  - Fluxo de negociação inclui criação (`NewNegotiationPage`), detalhamento (`NegotiationDetailsPage`) e contrapropostas (`CounterProposalPage`) com feedback em tempo real.
- **Antecipação de Recebíveis**
  - Integrada ao dashboard do investidor, permitindo simulação de liquidez, cálculos com `services/rates.service.ts` e confirmação com toasts.
- **Perfil & Configurações (`pages/profile`)**
  - Ajuste de dados, preferências de notificação e segurança; integra `ProfileContext` e `services/usuario`.
- **Tutoriais e Ajuda**
  - `OnboardingTutorial` destaca funcionalidades chave; `HelpDialog` organiza FAQs, vídeos e suporte.

## 5.9 Boas Práticas de Desenvolvimento
- Componentes mantêm tipagem explícita (`React.FC<Props>`) e evitam lógica imperativa pesada dentro de JSX.
- Estilos seguem o padrão `className` com utilitários Tailwind, reduzindo CSS isolado.
- Traduções novas exigem sincronização entre `pt`, `en` e `es` para eliminar warnings.
- Cada fluxo possui feedbacks visuais em caso de erro (toasts) e carregamento (skeletons/spinners conforme necessário).

## 5.10 Próximos Passos Sugeridos
1. Adicionar testes de integração (Cypress/Playwright) para validar fluxos críticos (login, negociação, antecipação).
2. Expandir cobertura de acessibilidade com testes automatizados (axe) nos principais componentes.
3. Documentar contratos de API em paralelo (OpenAPI) para garantir aderência entre frontend e backend.
