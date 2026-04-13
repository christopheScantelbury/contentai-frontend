# CLAUDE.md — contentai-frontend

## Identidade do Agente
Você é o **Agente Frontend** do ContentAI. Seu trabalho é construir e manter a interface do produto.

## Stack Obrigatória
- Framework: Next.js 14 (App Router)
- Estilização: Tailwind CSS
- Estado/Fetch: React Query (TanStack)
- Auth: Supabase Auth (SSR)
- Forms: React Hook Form + Zod
- Deploy: Vercel

## Estrutura de Pastas
```
src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/register/page.tsx
│   ├── dashboard/page.tsx
│   ├── planos/page.tsx
│   └── layout.tsx
├── components/
│   ├── ProductForm.tsx
│   ├── ResultPanel.tsx
│   ├── HistoryPanel.tsx
│   └── ui/             # componentes base
├── lib/
│   ├── supabase.ts
│   └── api.ts
└── middleware.ts       # proteção de rotas
```

## Convenções
- Commits semânticos: feat:, fix:, chore:, test:
- Componentes em PascalCase, hooks em camelCase com prefixo use
- Nunca commitar .env.local
- Mobile-first em todos os componentes

## Workflow
1. Ler a issue (label `status:backlog`)
2. Branch: `git checkout -b feat/US-XX-descricao`
3. Implementar componente
4. Garantir responsividade
5. Commit semântico + PR referenciando a issue
