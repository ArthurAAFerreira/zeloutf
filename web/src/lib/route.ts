import { DADOS_UNIDADES } from '../data/catalog';

export interface RotaCompat {
  campusId: string;
  sedeId: string | null;
  blocoNome: string | null;
}

export function normalizarToken(valor: string | null | undefined): string {
  return (valor ?? '').toString().trim().toLowerCase();
}

export function tokenizarBloco(blocoNome: string): string {
  const nomeLimpo = blocoNome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (nomeLimpo === 'geral') return 'geral';
  if (nomeLimpo === 'areas de acesso') return 'acesso';
  if (nomeLimpo === 'area de circulacao') return 'circulacao';

  const matchBloco = blocoNome.match(/^Bloco\s+([A-Za-z0-9]+)/i);
  if (matchBloco) return matchBloco[1].toLowerCase();

  return nomeLimpo.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function gerarBuscaRota(campusId: string, sedeId?: string | null, blocoNome?: string | null): string {
  const params = new URLSearchParams();
  params.set('c', normalizarToken(campusId));
  if (sedeId) params.set('s', normalizarToken(sedeId));
  if (blocoNome) params.set('b', tokenizarBloco(blocoNome).toUpperCase());
  return `?${params.toString()}`;
}

export function gerarRotaCompacta(campusId: string, sedeId?: string | null, blocoNome?: string | null): string {
  const campusToken = normalizarToken(campusId);
  if (!campusToken) return '/';

  const sedeToken = sedeId ? normalizarToken(sedeId) : '';
  const blocoToken = blocoNome ? tokenizarBloco(blocoNome) : '';

  if (sedeToken) {
    return `/${campusToken}$${sedeToken}${blocoToken ? `&${blocoToken}` : ''}`;
  }

  return `/${campusToken}${blocoToken ? `&${blocoToken}` : ''}`;
}

function encontrarBlocoPorToken(blocosObj: Record<string, string[]>, blocoToken: string | null | undefined): string | null {
  const tokenNormalizado = normalizarToken(blocoToken);
  if (!tokenNormalizado) return null;
  return Object.keys(blocosObj).find((blocoNome) => tokenizarBloco(blocoNome) === tokenNormalizado) ?? null;
}

export function parsearRotaCompacta(pathname: string): RotaCompat | null {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  if (!slug) return null;

  const match = slug.match(/^([a-z]{2})(?:\$([a-z0-9_-]+))?(?:&([a-z0-9_-]+))?$/i);
  if (!match) return null;

  const campusId = normalizarToken(match[1]);
  if (!campusId || !DADOS_UNIDADES[campusId]) return null;

  const campus = DADOS_UNIDADES[campusId];
  const sedeToken = normalizarToken(match[2]);
  const blocoToken = normalizarToken(match[3]);

  if (campus.temSedes) {
    if (!sedeToken) return { campusId, sedeId: null, blocoNome: null };
    if (!campus.sedes[sedeToken]) return { campusId, sedeId: null, blocoNome: null };

    const blocoNome = blocoToken
      ? encontrarBlocoPorToken(campus.sedes[sedeToken].blocos, blocoToken)
      : null;

    return { campusId, sedeId: sedeToken, blocoNome };
  }

  const blocoNome = blocoToken ? encontrarBlocoPorToken(campus.blocos, blocoToken) : null;
  return { campusId, sedeId: null, blocoNome };
}

export function parsearRotaCompat(search: string): RotaCompat | null {
  const params = new URLSearchParams(search);

  const campusParam = normalizarToken(params.get('campus'));
  if (campusParam && DADOS_UNIDADES[campusParam]) {
    const campus = DADOS_UNIDADES[campusParam];
    const sedeParam = normalizarToken(params.get('sede')) || null;
    const blocoParam = params.get('bloco');

    if (campus.temSedes) {
      if (!sedeParam || !campus.sedes[sedeParam]) {
        return { campusId: campusParam, sedeId: null, blocoNome: null };
      }
      const blocoNome = blocoParam && campus.sedes[sedeParam].blocos[blocoParam] ? blocoParam : null;
      return { campusId: campusParam, sedeId: sedeParam, blocoNome };
    }

    const blocoNome = blocoParam && campus.blocos[blocoParam] ? blocoParam : null;
    return { campusId: campusParam, sedeId: null, blocoNome };
  }

  const campusToken = normalizarToken(params.get('c'));
  if (campusToken && DADOS_UNIDADES[campusToken]) {
    const campus = DADOS_UNIDADES[campusToken];
    if (campus.temSedes) {
      const sedeId = normalizarToken(params.get('s'));
      if (!sedeId || !campus.sedes[sedeId]) return { campusId: campusToken, sedeId: null, blocoNome: null };
      const blocoNome = encontrarBlocoPorToken(campus.sedes[sedeId].blocos, params.get('b'));
      return { campusId: campusToken, sedeId, blocoNome };
    }

    const blocoNome = encontrarBlocoPorToken(campus.blocos, params.get('b'));
    return { campusId: campusToken, sedeId: null, blocoNome };
  }

  const code = params.get('code');
  if (!code) return null;

  const partes = code.split('.').filter(Boolean).map(normalizarToken);
  const campusId = partes[0];
  if (!campusId || !DADOS_UNIDADES[campusId]) return null;

  const campus = DADOS_UNIDADES[campusId];
  if (campus.temSedes) {
    const sedeId = partes[1];
    if (!sedeId || !campus.sedes[sedeId]) return { campusId, sedeId: null, blocoNome: null };
    const blocoNome = encontrarBlocoPorToken(campus.sedes[sedeId].blocos, partes[2]);
    return { campusId, sedeId, blocoNome };
  }

  const blocoNome = encontrarBlocoPorToken(campus.blocos, partes[1]);
  return { campusId, sedeId: null, blocoNome };
}

export function parsearCampusDaRota(search: string): string | null {
  const params = new URLSearchParams(search);
  const campusId = normalizarToken(params.get('c'));
  if (!campusId || !DADOS_UNIDADES[campusId]) return null;
  return campusId;
}
