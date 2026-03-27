# ZeloUTF Web (React + TypeScript)

Nova base modernizada do frontend, mantida em paralelo ao legado (`public/`).

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Zod + React Hook Form
- Vitest (unit)
- Playwright (E2E)

## Rodar localmente

1. Copie `.env.example` para `.env`
2. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Instale dependências: `npm install`
4. Dev: `npm run dev`
5. Unit tests: `npm run test`
6. E2E: `npm run test:e2e`

## Observações

- O app atual em produção continua em `public/`.
- Esta base já contempla validação de schema no envio de relato.
- As Edge Functions em `supabase/functions/` são o início da migração de regras sensíveis para backend.
