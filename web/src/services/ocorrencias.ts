import { DB_SCHEMA, DB_TABLE_OCORRENCIAS, db } from '../lib/supabase';
import type { OcorrenciaInsert } from '../types/domain';

export interface OcorrenciaResumo {
  id: string;
  id_curto: number;
  created_at?: string;
  tipo?: 'Reclamação' | 'Melhoria';
  unidade?: string | null;
  sede?: string | null;
  status: 'pendente' | 'em_verificacao' | 'resolvido';
  problema: string;
  bloco: string;
  local: string;
  ambiente: string;
  descricao_detalhada: string;
  identificacao_usuario?: string | null;
  foto_url?: string | null;
  foto_conclusao_url?: string | null;
  reforcos: number;
  comunidade_sugere_conclusao?: boolean;
  comunidade_email?: string | null;
  comunidade_descricao?: string | null;
  comunidade_foto_url?: string | null;
  gerenciado_por: string | null;
  complemento_admin: string | null;
  resolvido_em: string | null;
}

export async function uploadFotoOcorrencia(file: File, deviceId: string): Promise<string> {
  const nomeSeguro = file.name.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-');
  const path = `${deviceId}/${Date.now()}-${nomeSeguro}`;

  const { error: uploadError } = await db
    .storage
    .from(STORAGE_BUCKET_OCORRENCIAS)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = db.storage.from(STORAGE_BUCKET_OCORRENCIAS).getPublicUrl(path);
  return data.publicUrl;
}

interface FeedContexto {
  unidade: string;
  sede: string | null;
  bloco: string;
  local: string;
  categoria_grupo?: string;
}

function locaisCompativeis(localAtual: string): string[] {
  const localNormalizado = localAtual.replace(/\s+/g, ' ').trim();
  const mapa: Record<string, string[]> = {
    'Áreas Gerais, Acadêmicas e Administrativas': ['Áreas Gerais e Administrativas', 'Áreas Gerais, Acadêmicas e Administrativas'],
    'Áreas Gerais e Administrativas': ['Áreas Gerais e Administrativas', 'Áreas Gerais, Acadêmicas e Administrativas'],
    'Áreas Gerais Acadêmicas e Administrativas': ['Áreas Gerais e Administrativas', 'Áreas Gerais, Acadêmicas e Administrativas', 'Áreas Gerais Acadêmicas e Administrativas'],
    'Salas de Aula / Laboratórios': ['Salas de Aula / Laboratórios', 'Salas de Aula / Lab'],
    'Salas de Aula / Lab': ['Salas de Aula / Lab', 'Salas de Aula / Laboratórios'],
    Sanitários: ['Sanitários', 'Sanitarios'],
    Sanitarios: ['Sanitários', 'Sanitarios'],
    'Área Externa': ['Área Externa', 'Area Externa'],
    'Area Externa': ['Área Externa', 'Area Externa'],
  };

  return Array.from(new Set(mapa[localNormalizado] ?? [localNormalizado]));
}

function blocosCompativeis(blocoAtual: string): string[] {
  const bloco = blocoAtual.replace(/\s+/g, ' ').trim();
  const match = /^bloco\s+(.+)$/i.exec(bloco);

  if (match) {
    const sufixo = match[1].trim();
    return Array.from(new Set([bloco, sufixo]));
  }

  if (/^[a-z0-9]+$/i.test(bloco)) {
    return Array.from(new Set([bloco, `Bloco ${bloco}`]));
  }

  return [bloco];
}

function unidadesCompativeis(unidadeAtual: string): string[] {
  const unidade = unidadeAtual.replace(/\s+/g, ' ').trim();
  const mapa: Record<string, string[]> = {
    Curitiba: ['Curitiba', 'CT', 'ct', 'Campus Curitiba', 'UTFPR Curitiba'],
    Londrina: ['Londrina', 'LD', 'ld', 'Campus Londrina', 'UTFPR Londrina'],
  };

  return Array.from(new Set(mapa[unidade] ?? [unidade, unidade.toLowerCase(), unidade.toUpperCase()]));
}

function sedesCompativeis(sedeAtual: string): string[] {
  const sede = sedeAtual.replace(/\s+/g, ' ').trim();
  const mapa: Record<string, string[]> = {
    'Sede Centro': ['Sede Centro', 'Centro', 'centro'],
    'Sede Neoville': ['Sede Neoville', 'Neoville', 'neoville'],
    'Sede Ecoville': ['Sede Ecoville', 'Ecoville', 'ecoville'],
  };

  return Array.from(new Set(mapa[sede] ?? [sede, sede.toLowerCase()]));
}

const STORAGE_BUCKET_OCORRENCIAS = import.meta.env.VITE_SUPABASE_BUCKET_OCORRENCIAS ?? 'ocorrencias-fotos';

export async function inserirOcorrencia(payload: OcorrenciaInsert) {
  const { error } = await db
    .schema(DB_SCHEMA)
    .from(DB_TABLE_OCORRENCIAS)
    .insert([payload]);

  if (error) throw error;
}

export async function buscarPorIdCurto(idCurto: number): Promise<OcorrenciaResumo | null> {
  const { data, error } = await db
    .schema(DB_SCHEMA)
    .from(DB_TABLE_OCORRENCIAS)
    .select('id,id_curto,created_at,tipo,unidade,sede,status,problema,bloco,local,ambiente,descricao_detalhada,identificacao_usuario,foto_url,foto_conclusao_url,reforcos,comunidade_sugere_conclusao,comunidade_email,comunidade_descricao,comunidade_foto_url,gerenciado_por,complemento_admin,resolvido_em')
    .eq('id_curto', idCurto)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return data as OcorrenciaResumo;
}

export async function listarFeedOcorrencias(contexto: FeedContexto): Promise<{ abertos: OcorrenciaResumo[]; resolvidos: OcorrenciaResumo[] }> {
  const locaisFiltro = locaisCompativeis(contexto.local);
  const blocosFiltro = blocosCompativeis(contexto.bloco);
  const unidadesFiltro = unidadesCompativeis(contexto.unidade);
  const sedesFiltro = contexto.sede ? sedesCompativeis(contexto.sede) : [];
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - 7);

  async function consultar(usarLocal: boolean, usarCategoria: boolean, usarUnidade: boolean, usarSede: boolean): Promise<{ abertos: OcorrenciaResumo[]; resolvidos: OcorrenciaResumo[] }> {
    let qAb = db
      .schema(DB_SCHEMA)
      .from(DB_TABLE_OCORRENCIAS)
      .select('id,id_curto,created_at,tipo,unidade,sede,status,problema,bloco,local,ambiente,descricao_detalhada,identificacao_usuario,foto_url,foto_conclusao_url,reforcos,comunidade_sugere_conclusao,gerenciado_por,complemento_admin,resolvido_em')
      .in('status', ['pendente', 'em_verificacao'])
      .in('bloco', blocosFiltro)
      .order('reforcos', { ascending: false })
      .limit(15);

    let qRe = db
      .schema(DB_SCHEMA)
      .from(DB_TABLE_OCORRENCIAS)
      .select('id,id_curto,created_at,tipo,unidade,sede,status,problema,bloco,local,ambiente,descricao_detalhada,identificacao_usuario,foto_url,foto_conclusao_url,reforcos,comunidade_sugere_conclusao,gerenciado_por,complemento_admin,resolvido_em')
      .eq('status', 'resolvido')
      .gte('resolvido_em', dataLimite.toISOString())
      .in('bloco', blocosFiltro)
      .order('resolvido_em', { ascending: false })
      .limit(10);

    if (usarUnidade) {
      qAb = qAb.in('unidade', unidadesFiltro);
      qRe = qRe.in('unidade', unidadesFiltro);
    }

    if (usarLocal) {
      qAb = qAb.in('local', locaisFiltro);
      qRe = qRe.in('local', locaisFiltro);
    }

    if (usarSede && contexto.sede) {
      qAb = qAb.in('sede', sedesFiltro);
      qRe = qRe.in('sede', sedesFiltro);
    }

    if (usarCategoria && contexto.categoria_grupo) {
      qAb = qAb.eq('categoria_grupo', contexto.categoria_grupo);
      qRe = qRe.eq('categoria_grupo', contexto.categoria_grupo);
    }

    const [abertos, resolvidos] = await Promise.all([qAb, qRe]);

    if (abertos.error) throw abertos.error;
    if (resolvidos.error) throw resolvidos.error;

    return {
      abertos: (abertos.data ?? []) as OcorrenciaResumo[],
      resolvidos: (resolvidos.data ?? []) as OcorrenciaResumo[],
    };
  }

  const consultas: Array<{ usarLocal: boolean; usarCategoria: boolean; usarUnidade: boolean; usarSede: boolean }> = [
    { usarLocal: true, usarCategoria: true, usarUnidade: true, usarSede: true },
    { usarLocal: true, usarCategoria: false, usarUnidade: true, usarSede: true },
    { usarLocal: false, usarCategoria: false, usarUnidade: true, usarSede: true },
    { usarLocal: true, usarCategoria: false, usarUnidade: true, usarSede: false },
    { usarLocal: false, usarCategoria: false, usarUnidade: true, usarSede: false },
    { usarLocal: true, usarCategoria: false, usarUnidade: false, usarSede: false },
    { usarLocal: false, usarCategoria: false, usarUnidade: false, usarSede: false },
  ];

  for (const tentativa of consultas) {
    const resultado = await consultar(tentativa.usarLocal, tentativa.usarCategoria, tentativa.usarUnidade, tentativa.usarSede);
    if (resultado.abertos.length > 0 || resultado.resolvidos.length > 0) {
      return resultado;
    }
  }

  return { abertos: [], resolvidos: [] };
}

export async function listarRelatosGestaoPorUnidade(unidade: string): Promise<{ abertos: OcorrenciaResumo[]; resolvidos: OcorrenciaResumo[] }> {
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - 7);

  const [abertos, resolvidos] = await Promise.all([
    db
      .schema(DB_SCHEMA)
      .from(DB_TABLE_OCORRENCIAS)
      .select('id,id_curto,created_at,tipo,unidade,sede,status,problema,bloco,local,ambiente,descricao_detalhada,identificacao_usuario,foto_url,foto_conclusao_url,reforcos,comunidade_sugere_conclusao,comunidade_email,comunidade_descricao,comunidade_foto_url,gerenciado_por,complemento_admin,resolvido_em')
      .in('status', ['pendente', 'em_verificacao'])
      .eq('unidade', unidade)
      .order('created_at', { ascending: false })
      .limit(40),
    db
      .schema(DB_SCHEMA)
      .from(DB_TABLE_OCORRENCIAS)
      .select('id,id_curto,created_at,tipo,unidade,sede,status,problema,bloco,local,ambiente,descricao_detalhada,identificacao_usuario,foto_url,foto_conclusao_url,reforcos,comunidade_sugere_conclusao,comunidade_email,comunidade_descricao,comunidade_foto_url,gerenciado_por,complemento_admin,resolvido_em')
      .eq('status', 'resolvido')
      .eq('unidade', unidade)
      .gte('resolvido_em', dataLimite.toISOString())
      .order('resolvido_em', { ascending: false })
      .limit(20),
  ]);

  if (abertos.error) throw abertos.error;
  if (resolvidos.error) throw resolvidos.error;

  return {
    abertos: (abertos.data ?? []) as OcorrenciaResumo[],
    resolvidos: (resolvidos.data ?? []) as OcorrenciaResumo[],
  };
}

export async function reforcarOcorrencia(id: string, reforcosAtuais: number) {
  const { error } = await db
    .schema(DB_SCHEMA)
    .from(DB_TABLE_OCORRENCIAS)
    .update({
      reforcos: reforcosAtuais + 1,
      ultimo_reforco_em: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

interface GerenciarPayload {
  id: string;
  status: 'pendente' | 'em_verificacao' | 'resolvido';
  complemento_admin?: string;
  gerenciado_por?: string;
  tipo?: 'Reclamação' | 'Melhoria';
  bloco?: string;
  local?: string;
  ambiente?: string;
  problema?: string;
}

interface ValidarSenhaPayload {
  validate_only: true;
}

interface ComunidadePayload {
  id: string;
  email: string;
  descricao: string;
}

export async function informarConclusaoComunidade(payload: ComunidadePayload) {
  const email = payload.email.trim().toLowerCase();
  const emailValido = email.endsWith('@utfpr.edu.br') || email.endsWith('@alunos.utfpr.edu.br');

  if (!emailValido) {
    throw new Error('Use e-mail institucional UTFPR para informar conclusão.');
  }

  const { error } = await db
    .schema(DB_SCHEMA)
    .from(DB_TABLE_OCORRENCIAS)
    .update({
      comunidade_sugere_conclusao: true,
      comunidade_email: email,
      comunidade_descricao: payload.descricao,
      comunidade_foto_url: null,
    })
    .eq('id', payload.id);

  if (error) throw error;
}

export async function recusarValidacaoComunidade(id: string) {
  const { error } = await db
    .schema(DB_SCHEMA)
    .from(DB_TABLE_OCORRENCIAS)
    .update({
      comunidade_sugere_conclusao: false,
      comunidade_email: null,
      comunidade_descricao: null,
      comunidade_foto_url: null,
    })
    .eq('id', id);

  if (error) throw error;
}

export async function gerenciarOcorrencia(payload: GerenciarPayload, adminKey: string) {
  await chamarManageOcorrencia(payload, adminKey);
}

export async function validarSenhaAdmin(adminKey: string) {
  try {
    await chamarManageOcorrencia({ validate_only: true }, adminKey);
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : '';
    if (/campo id.*obrigat/i.test(mensagem)) return;
    throw error;
  }
}

export interface EstatisticasCampus {
  totalRelatos: number;
  totalAbertos: number;
  totalEmAndamento: number;
  totalResolvidos: number;
  totalReforcos: number;
  relatosComReforco: number;
  porBloco: { bloco: string; abertos: number; resolvidos: number }[];
  porTipo: { tipo: string; total: number }[];
  porStatus: { status: string; label: string; total: number; cor: string }[];
}

export async function buscarEstatisticasCampus(unidade: string): Promise<EstatisticasCampus> {
  const { data, error } = await db
    .schema(DB_SCHEMA)
    .from(DB_TABLE_OCORRENCIAS)
    .select('status,bloco,tipo,reforcos')
    .eq('unidade', unidade);

  if (error) throw error;

  const items = (data ?? []) as { status: string; bloco: string | null; tipo: string | null; reforcos: number | null }[];
  const blocoMap: Record<string, { abertos: number; resolvidos: number }> = {};
  const tipoMap: Record<string, number> = {};
  const statusMap: Record<string, number> = {};
  let totalReforcos = 0;
  let relatosComReforco = 0;

  for (const o of items) {
    const bloco = o.bloco ?? 'Geral';
    if (!blocoMap[bloco]) blocoMap[bloco] = { abertos: 0, resolvidos: 0 };
    if (o.status === 'pendente' || o.status === 'em_verificacao') blocoMap[bloco].abertos++;
    else if (o.status === 'resolvido') blocoMap[bloco].resolvidos++;

    const tipo = o.tipo ?? 'Reclamação';
    tipoMap[tipo] = (tipoMap[tipo] ?? 0) + 1;
    statusMap[o.status] = (statusMap[o.status] ?? 0) + 1;

    const r = o.reforcos ?? 0;
    totalReforcos += r;
    if (r > 0) relatosComReforco++;
  }

  const STATUS_META: Record<string, { label: string; cor: string }> = {
    pendente: { label: 'Aberto', cor: '#f59e0b' },
    em_verificacao: { label: 'Em andamento', cor: '#3b82f6' },
    resolvido: { label: 'Concluído', cor: '#10b981' },
  };

  return {
    totalRelatos: items.length,
    totalAbertos: statusMap.pendente ?? 0,
    totalEmAndamento: statusMap.em_verificacao ?? 0,
    totalResolvidos: statusMap.resolvido ?? 0,
    totalReforcos,
    relatosComReforco,
    porBloco: Object.entries(blocoMap)
      .map(([bloco, v]) => ({ bloco, ...v }))
      .sort((a, b) => (b.abertos + b.resolvidos) - (a.abertos + a.resolvidos))
      .slice(0, 12),
    porTipo: Object.entries(tipoMap).map(([tipo, total]) => ({ tipo, total })),
    porStatus: Object.entries(statusMap).map(([s, total]) => ({
      status: s,
      label: STATUS_META[s]?.label ?? s,
      cor: STATUS_META[s]?.cor ?? '#94a3b8',
      total,
    })),
  };
}

export async function buscarResumoTodosCampus(): Promise<{ unidade: string; abertos: number; andamento: number; resolvidos: number; total: number }[]> {
  const { data, error } = await db
    .schema(DB_SCHEMA)
    .from(DB_TABLE_OCORRENCIAS)
    .select('status,unidade');

  if (error) throw error;

  const items = (data ?? []) as { status: string; unidade: string | null }[];
  const mapa: Record<string, { abertos: number; andamento: number; resolvidos: number }> = {};

  for (const o of items) {
    const u = o.unidade ?? 'Desconhecido';
    if (!mapa[u]) mapa[u] = { abertos: 0, andamento: 0, resolvidos: 0 };
    if (o.status === 'pendente') mapa[u].abertos++;
    else if (o.status === 'em_verificacao') mapa[u].andamento++;
    else if (o.status === 'resolvido') mapa[u].resolvidos++;
  }

  return Object.entries(mapa).map(([unidade, v]) => ({
    unidade,
    ...v,
    total: v.abertos + v.andamento + v.resolvidos,
  }));
}

async function chamarManageOcorrencia(payload: GerenciarPayload | ValidarSenhaPayload, adminKey: string) {
  const baseUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_BASE_URL;
  if (!baseUrl) {
    throw new Error('Defina VITE_SUPABASE_FUNCTIONS_BASE_URL no .env');
  }

  const response = await fetch(`${baseUrl}/manage-ocorrencia`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Falha ao gerenciar ocorrência.' }));
    throw new Error(body.error ?? 'Falha ao gerenciar ocorrência.');
  }
}
