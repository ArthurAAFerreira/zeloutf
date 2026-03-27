const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ReportPayload = {
  nivel: 'geral' | 'campus' | 'local';
  contexto: string;
  solicitante: string;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as ReportPayload;
    const baseUrl = Deno.env.get('N8N_ZELOUTF_WEBHOOK_URL');

    if (!baseUrl) {
      return new Response(JSON.stringify({ error: 'Webhook n8n não configurado.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const params = new URLSearchParams({
      nivel: payload.nivel,
      contexto: payload.contexto,
      solicitante: payload.solicitante,
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`, { method: 'GET' });
    const text = await response.text();

    return new Response(JSON.stringify({ output: text }), {
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
