# Deploy na Vercel (zeloUTF web)

## 1) Importar projeto
- Na Vercel, clique em **Add New Project** e selecione este repositório.
- Em **Root Directory**, selecione `web`.

## 2) Build settings
A configuração padrão já está em `web/vercel.json`:
- Framework: `vite`
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite para `index.html`

## 3) Variáveis de ambiente
Defina no painel da Vercel (Project Settings > Environment Variables):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_SCHEMA`
- `VITE_SUPABASE_FUNCTIONS_BASE_URL`
- `VITE_SUPABASE_BUCKET_OCORRENCIAS`

## 4) Deploy
- Faça deploy da branch principal.
- Valide no ambiente publicado:
  - Navegação por etapas
  - Consulta por número
  - Upload de imagem
  - Modo gestão

## 5) Observações
- O bundle atual pode exibir warning de chunk > 500kb, mas isso não bloqueia deploy.
- Para reduzir bundle futuramente, aplicar code splitting por rota/componente.
