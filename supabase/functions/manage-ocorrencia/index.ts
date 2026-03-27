import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { validarSenhaMestre } from './master-passwords.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
};

const SENHA_MESTRA_GLOBAL = 'federer';

type ManagePayload = {
  id?: string;
  validate_only?: boolean;
  status?: 'pendente' | 'em_verificacao' | 'resolvido';
  complemento_admin?: string;
  gerenciado_por?: string;
  tipo?: 'Reclamação' | 'Melhoria';
  bloco?: string;
  local?: string;
  ambiente?: string;
  problema?: string;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const adminHeader = req.headers.get('x-admin-key');
    const adminKey = Deno.env.get('ZELOUTF_ADMIN_KEY');
    const adminHeaderNormalizado = adminHeader?.trim() ?? '';
    const senhaValidaPorEnv = Boolean(adminHeaderNormalizado && adminKey && adminHeaderNormalizado === adminKey);
    const senhaValidaPorLegado = validarSenhaMestre(adminHeaderNormalizado);
    const senhaValidaGlobal = adminHeaderNormalizado.toLowerCase() === SENHA_MESTRA_GLOBAL;

    if (!senhaValidaPorEnv && !senhaValidaPorLegado && !senhaValidaGlobal) {
      return new Response(JSON.stringify({ error: 'Não autorizado.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = (await req.json()) as ManagePayload;

    if (payload?.validate_only) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!payload?.id) {
      return new Response(JSON.stringify({ error: 'Campo id é obrigatório.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const update: Record<string, string | null> = {};
    if (payload.status !== undefined) update.status = payload.status;
    if (payload.complemento_admin !== undefined) update.complemento_admin = payload.complemento_admin;
    if (payload.gerenciado_por !== undefined) update.gerenciado_por = payload.gerenciado_por;
    if (payload.tipo !== undefined) update.tipo = payload.tipo;
    if (payload.bloco !== undefined) update.bloco = payload.bloco;
    if (payload.local !== undefined) update.local = payload.local;
    if (payload.ambiente !== undefined) update.ambiente = payload.ambiente;
    if (payload.problema !== undefined) update.problema = payload.problema;

    if (payload.status === 'resolvido') {
      update.resolvido_em = new Date().toISOString();
      if (payload.gerenciado_por !== undefined) {
        update.resolvido_por = payload.gerenciado_por;
      }
    }

    if (payload.status && payload.status !== 'resolvido') {
      update.resolvido_em = null;
      update.resolvido_por = null;
    }

    const { error } = await supabase
      .schema('zeloutf')
      .from('ocorrencias')
      .update(update)
      .eq('id', payload.id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erro interno.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
