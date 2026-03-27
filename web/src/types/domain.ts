export type CategoriaGrupo = 'estrutura' | 'servicos' | 'bens';

export interface AmbienteConfig {
  nome: string;
  icone: string;
  categorias: Record<CategoriaGrupo, string[]>;
}

export interface UnidadeComSede {
  nome: string;
  temSedes: true;
  contato: string;
  sedes: Record<string, { nome: string; blocos: Record<string, string[]> }>;
}

export interface UnidadeSemSede {
  nome: string;
  temSedes: false;
  contato: string;
  blocos: Record<string, string[]>;
}

export type Unidade = UnidadeComSede | UnidadeSemSede;

export interface EstadoFluxo {
  campusId: string | null;
  sedeId: string | null;
  blocoNome: string | null;
  ambienteId: string | null;
  categoria: CategoriaGrupo | null;
}

export interface OcorrenciaInsert {
  device_id: string;
  tipo: 'Reclamação' | 'Melhoria';
  status: 'pendente';
  unidade: string;
  sede: string | null;
  bloco: string;
  local: string;
  categoria_grupo: string;
  problema: string;
  ambiente: string;
  descricao_detalhada: string;
  identificacao_usuario: string | null;
  foto_url: string | null;
  descricao: string;
}
