// ================================================================
// ZeloUTF · Criar usuários via Supabase Admin API
// Requer Node.js 18+  |  Sem dependências extras
//
// Como usar:
//   1. Preencha SUPABASE_URL e SERVICE_KEY abaixo
//      (Supabase Dashboard → Settings → API)
//   2. node supabase/criar_usuarios.mjs
//
// Usuários criados: {perfil}{campus}@zelo.utfpr  senha = {perfil}{campus}
// Exemplo: dirpladct@zelo.utfpr  senha: dirpladct
// ================================================================

const SUPABASE_URL = 'COLE_SUA_PROJECT_URL_AQUI';   // ex: https://abcxyz.supabase.co
const SERVICE_KEY  = 'COLE_SUA_SERVICE_ROLE_KEY_AQUI'; // Settings → API → service_role

const campus   = ['ct','ld','cp','ap','cm','dv','fb','gp','md','pb','pg','sh','td'];
const prefixos = ['dirplad','dirge','deseg','depro','utfpr'];

const h = {
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'apikey': SERVICE_KEY,
  'Content-Type': 'application/json',
};

async function criarUsuario(email, password) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json.msg ?? json.message ?? JSON.stringify(json));
  return json.id;
}

async function vincularCampus(userId, campusId) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/gestao_acesso`, {
    method: 'POST',
    headers: { ...h, 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: userId, campus_ids: [campusId], papel: 'campus' }),
  });
  if (!r.ok) throw new Error(await r.text());
}

let ok = 0, erros = 0;

for (const c of campus) {
  for (const p of prefixos) {
    const usuario = p + c;
    const email   = `${usuario}@zelo.utfpr`;
    try {
      const uid = await criarUsuario(email, usuario);
      await vincularCampus(uid, c);
      console.log(`✓ ${email}`);
      ok++;
    } catch (e) {
      console.error(`✗ ${email}: ${e.message}`);
      erros++;
    }
  }
}

console.log(`\nConcluído: ${ok} criados, ${erros} erros.`);
