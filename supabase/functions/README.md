# Edge Functions - ZeloUTF

Funções iniciais para mover regras sensíveis para backend.

## Funções

- `manage-ocorrencia`: recebe alterações de status/complemento administrativo com validação por `x-admin-key`.
- `relay-relatorio`: faz relay seguro para webhook do n8n.

## Variáveis de ambiente

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ZELOUTF_ADMIN_KEY`
- `N8N_ZELOUTF_WEBHOOK_URL`

## Deploy (Supabase CLI)

- `supabase functions deploy manage-ocorrencia`
- `supabase functions deploy relay-relatorio`
