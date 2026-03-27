## ZeloUTF - Modernização em andamento

Este repositório agora possui duas versões do frontend:

- Legado (produção atual): `public/`
- Nova base moderna: `web/` (Vite + React + TypeScript)

### O que já foi implementado na nova base

- React + TypeScript com Vite
- Tailwind CSS (base de design system)
- Validação de formulário com Zod + React Hook Form
- Estrutura de serviços Supabase com schema configurável por env
- Testes unitários com Vitest
- Teste E2E inicial com Playwright
- Scaffolding de Edge Functions em `supabase/functions/`

### Banco e view

- Migração SQL consolidada em `database/schema.sql`
- Inclui schema `zeloutf`, melhorias em `ocorrencias` e view `zeloutf.vw_ocorrencias_feed`

### Próximos passos sugeridos

1. Rodar a nova base local (`web/`) e validar fluxo de envio
2. Migrar gradualmente o restante das telas (gerenciamento, feed, relatórios IA)
3. Alterar frontend para consumir Edge Functions nas ações sensíveis
4. Habilitar políticas RLS mais restritivas por perfil

### Executar com clique duplo

- Use `Abrir-ZeloUTF-Web.bat` na raiz do projeto.
- Na primeira execução, o script instala dependências automaticamente.
- Depois, ele sobe o app em modo dev e mostra a URL local no terminal.

