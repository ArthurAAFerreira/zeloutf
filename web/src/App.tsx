import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  Footprints,
  Globe,
  ImagePlus,
  Instagram,
  Mail,
  MapPin,
  Search,
  Send,
  ShieldCheck,
  Toilet,
  Trees,
} from 'lucide-react';
import { DADOS_UNIDADES, PROBLEMAS_POR_AMBIENTE } from './data/catalog';
import type { CategoriaGrupo, OcorrenciaInsert, Unidade } from './types/domain';
import { ocorrenciaFormSchema, type OcorrenciaFormData } from './schemas/ocorrencia';
import { getDeviceId } from './lib/device';
import { gerarRotaCompacta, parsearRotaCompacta, parsearRotaCompat } from './lib/route';
import {
  buscarPorIdCurto,
  gerenciarOcorrencia,
  informarConclusaoComunidade,
  inserirOcorrencia,
  listarFeedOcorrencias,
  listarRelatosGestaoPorUnidade,
  reforcarOcorrencia,
  uploadFotoOcorrencia,
  validarSenhaAdmin,
  type OcorrenciaResumo,
} from './services/ocorrencias';
import { Button } from './components/ui/Button';

const CATEGORIA_LABEL: Record<CategoriaGrupo, string> = {
  estrutura: 'Estrutura',
  servicos: 'Serviços',
  bens: 'Bens em Geral',
};

function parsearRotaRelato(pathname: string): number | null {
  const match = /^\/relato\/(\d+)$/i.exec(pathname);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isFinite(id) ? id : null;
}

export function App() {
  const [modo, setModo] = useState<'relatos' | 'gestao'>('relatos');
  const [gestaoTela, setGestaoTela] = useState<'campus' | 'painel'>('campus');
  const [campusId, setCampusId] = useState<string>('');
  const [gestaoCampusId, setGestaoCampusId] = useState<string>('');
  const [sedeId, setSedeId] = useState<string>('');
  const [bloco, setBloco] = useState<string>('');
  const [ambienteId, setAmbienteId] = useState<string>('');
  const [categoria, setCategoria] = useState<CategoriaGrupo | ''>('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<OcorrenciaResumo | null>(null);
  const [erroBusca, setErroBusca] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [statusAdmin, setStatusAdmin] = useState<'pendente' | 'em_verificacao' | 'resolvido'>('pendente');
  const [complementoAdmin, setComplementoAdmin] = useState('');
  const [mensagemAdmin, setMensagemAdmin] = useState<string | null>(null);
  const [feedAbertos, setFeedAbertos] = useState<OcorrenciaResumo[]>([]);
  const [feedResolvidos, setFeedResolvidos] = useState<OcorrenciaResumo[]>([]);
  const [carregandoFeed, setCarregandoFeed] = useState(false);
  const [erroFeed, setErroFeed] = useState<string | null>(null);
  const [feedReloadToken, setFeedReloadToken] = useState(0);
  const [comunidadeRelatoId, setComunidadeRelatoId] = useState<string | null>(null);
  const [comunidadeEmail, setComunidadeEmail] = useState('');
  const [comunidadeDescricao, setComunidadeDescricao] = useState('');
  const [mensagemComunidade, setMensagemComunidade] = useState<string | null>(null);
  const [detalheResolvido, setDetalheResolvido] = useState<OcorrenciaResumo | null>(null);
  const [relatoAbertoSelecionado, setRelatoAbertoSelecionado] = useState<OcorrenciaResumo | null>(null);
  const [paginaRelato, setPaginaRelato] = useState<OcorrenciaResumo | null>(null);
  const [adminTipoRelato, setAdminTipoRelato] = useState<'Reclamação' | 'Melhoria'>('Reclamação');
  const [adminBlocoRelato, setAdminBlocoRelato] = useState('');
  const [adminLocalRelato, setAdminLocalRelato] = useState('');
  const [adminAmbienteRelato, setAdminAmbienteRelato] = useState('');
  const [adminProblemaRelato, setAdminProblemaRelato] = useState('');
  const [adminSenhaValidada, setAdminSenhaValidada] = useState(false);
  const [alterandoBlocoRelato, setAlterandoBlocoRelato] = useState(false);
  const [validandoSenhaAdmin, setValidandoSenhaAdmin] = useState(false);
  const [salvandoGerenciamentoRelato, setSalvandoGerenciamentoRelato] = useState(false);
  const [mensagemGerenciamentoRelato, setMensagemGerenciamentoRelato] = useState<string | null>(null);
  const [consultaNumero, setConsultaNumero] = useState('');
  const [fotoRelatoArquivo, setFotoRelatoArquivo] = useState<File | null>(null);
  const [gestaoAbertos, setGestaoAbertos] = useState<OcorrenciaResumo[]>([]);
  const [gestaoResolvidos, setGestaoResolvidos] = useState<OcorrenciaResumo[]>([]);
  const [naturezaEscolhida, setNaturezaEscolhida] = useState(false);
  const [rastroClique, setRastroClique] = useState<{
    text: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    running: boolean;
  } | null>(null);
  const breadcrumbRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<OcorrenciaFormData>({
    resolver: zodResolver(ocorrenciaFormSchema),
    defaultValues: {
      tipo: 'Reclamação',
      problema: '',
      localExato: '',
      descricao: '',
      identificacao: '',
    },
  });

  const unidade = useMemo<Unidade | null>(() => {
    if (!campusId) return null;
    return DADOS_UNIDADES[campusId] ?? null;
  }, [campusId]);

  const blocos = useMemo(() => {
    if (!unidade) return {} as Record<string, string[]>;
    if (unidade.temSedes) {
      return sedeId ? unidade.sedes[sedeId]?.blocos ?? {} : {};
    }

    return unidade.blocos;
  }, [unidade, sedeId]);

  const ambientes = useMemo(() => (bloco ? blocos[bloco] ?? [] : []), [bloco, blocos]);

  const problemas = useMemo(() => {
    if (!ambienteId || !categoria) return [];
    return PROBLEMAS_POR_AMBIENTE[ambienteId]?.categorias[categoria] ?? [];
  }, [ambienteId, categoria]);

  const contextoFeed = useMemo(() => {
    if (!unidade || !bloco || !ambienteId) return null;

    return {
      unidade: unidade.nome,
      sede: unidade.temSedes ? (sedeId ? unidade.sedes[sedeId]?.nome ?? null : null) : null,
      bloco,
      local: PROBLEMAS_POR_AMBIENTE[ambienteId].nome,
      categoria_grupo: categoria ? CATEGORIA_LABEL[categoria] : undefined,
    };
  }, [unidade, bloco, ambienteId, categoria, sedeId]);

  const unidadeGestao = useMemo(() => {
    if (!gestaoCampusId) return null;
    return DADOS_UNIDADES[gestaoCampusId] ?? null;
  }, [gestaoCampusId]);

  const sedeUnicaId = useMemo(() => {
    if (!unidade || !unidade.temSedes) return null;
    const ids = Object.keys(unidade.sedes);
    return ids.length === 1 ? ids[0] : null;
  }, [unidade]);

  useEffect(() => {
    async function carregarEstadoInicial() {
      const idRelato = parsearRotaRelato(window.location.pathname);
      if (idRelato) {
        const relato = await buscarPorIdCurto(idRelato);
        if (relato) {
          abrirPaginaRelato(relato);
          return;
        }
      }

      const params = new URLSearchParams(window.location.search);
      const rotaCompacta = parsearRotaCompacta(window.location.pathname);
      const rotaCompat = rotaCompacta ?? parsearRotaCompat(window.location.search);

      if (rotaCompat) {
        setCampusId(rotaCompat.campusId);
        if (rotaCompat.sedeId) setSedeId(rotaCompat.sedeId);
        if (rotaCompat.blocoNome) setBloco(rotaCompat.blocoNome);
      }

      const modoParam = params.get('modo');
      if (modoParam === 'gestao') {
        setModo('gestao');
      }

      const gestaoTelaParam = params.get('gestaoTela');
      if (gestaoTelaParam === 'painel') {
        setGestaoTela('painel');
      }

      const campusGestaoParam = params.get('gestaoCampus');
      if (campusGestaoParam && DADOS_UNIDADES[campusGestaoParam]) {
        setGestaoCampusId(campusGestaoParam);
      }
    }

    void carregarEstadoInicial();
  }, []);

  useEffect(() => {
    if (unidade?.temSedes && !sedeId && sedeUnicaId) {
      setSedeId(sedeUnicaId);
    }
  }, [unidade, sedeId, sedeUnicaId]);

  useEffect(() => {
    if (modo !== 'relatos') return;
    if (paginaRelato) return;

    let rota = '/';
    if (campusId) {
      rota = gerarRotaCompacta(campusId, sedeId || undefined, bloco || undefined);
    }

    const atual = `${window.location.pathname}${window.location.search}`;
    if (atual !== rota) {
      window.history.pushState(null, '', rota);
    }
  }, [modo, campusId, sedeId, bloco, paginaRelato]);

  useEffect(() => {
    function onPopState() {
      const idRelato = parsearRotaRelato(window.location.pathname);
      if (idRelato) {
        void buscarPorIdCurto(idRelato).then((resultado) => {
          if (resultado) {
            abrirPaginaRelato(resultado);
            return;
          }
          setPaginaRelato(null);
        });
        return;
      }

      setPaginaRelato(null);
      const rotaCompacta = parsearRotaCompacta(window.location.pathname);
      const rotaCompat = rotaCompacta ?? parsearRotaCompat(window.location.search);

      if (!rotaCompat) {
        resetFluxoApartirCampus('');
        return;
      }

      setModo('relatos');
      setCampusId(rotaCompat.campusId);
      setSedeId(rotaCompat.sedeId ?? '');
      setBloco(rotaCompat.blocoNome ?? '');
      setAmbienteId('');
      setCategoria('');
      form.resetField('problema');
      form.setValue('tipo', 'Reclamação');
      setNaturezaEscolhida(false);
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [form]);

  useEffect(() => {
    async function carregarFeed() {
      if (!contextoFeed) {
        setFeedAbertos([]);
        setFeedResolvidos([]);
        setErroFeed(null);
        return;
      }

      setCarregandoFeed(true);
      setErroFeed(null);

      try {
        const resultado = await listarFeedOcorrencias(contextoFeed);
        setFeedAbertos(resultado.abertos);
        setFeedResolvidos(resultado.resolvidos);
      } catch (e) {
        setErroFeed(e instanceof Error ? e.message : 'Falha ao carregar feed de relatos.');
      } finally {
        setCarregandoFeed(false);
      }
    }

    void carregarFeed();
  }, [contextoFeed, feedReloadToken]);

  useEffect(() => {
    async function carregarGestao() {
      if (modo !== 'gestao' || !unidadeGestao) {
        setGestaoAbertos([]);
        setGestaoResolvidos([]);
        return;
      }

      try {
        const resultado = await listarRelatosGestaoPorUnidade(unidadeGestao.nome);
        setGestaoAbertos(resultado.abertos);
        setGestaoResolvidos(resultado.resolvidos);
      } catch {
        setGestaoAbertos([]);
        setGestaoResolvidos([]);
      }
    }

    void carregarGestao();
  }, [modo, unidadeGestao, feedReloadToken]);

  function resetFluxoApartirCampus(nextCampus: string) {
    setCampusId(nextCampus);
    setSedeId('');
    setBloco('');
    setAmbienteId('');
    setCategoria('');
    form.resetField('problema');
    setFotoRelatoArquivo(null);
    form.setValue('tipo', 'Reclamação');
    setNaturezaEscolhida(false);
  }

  async function reduzirImagemParaUpload(file: File): Promise<File> {
    if (!file.type.startsWith('image/')) return file;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Falha ao ler imagem.'));
      reader.readAsDataURL(file);
    });

    const imagem = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Falha ao processar imagem.'));
      img.src = dataUrl;
    });

    const maxDimensao = 1600;
    const escala = Math.min(1, maxDimensao / Math.max(imagem.width, imagem.height));
    const largura = Math.max(1, Math.round(imagem.width * escala));
    const altura = Math.max(1, Math.round(imagem.height * escala));

    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(imagem, 0, 0, largura, altura);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.72);
    });

    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '');
    return new File([blob], `${baseName}-otimizada.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  }

  async function onSubmit(values: OcorrenciaFormData) {
    if (!unidade || !bloco || !ambienteId || !categoria) {
      setErro('Selecione campus, bloco, ambiente e categoria antes de enviar.');
      return;
    }

    if (!naturezaEscolhida) {
      setErro('Selecione a natureza do relato antes de enviar.');
      return;
    }

    setErro(null);
    setEnviando(true);

    try {
      let fotoUrl: string | null = null;
      if (fotoRelatoArquivo) {
        const arquivoOtimizado = await reduzirImagemParaUpload(fotoRelatoArquivo);
        fotoUrl = await uploadFotoOcorrencia(arquivoOtimizado, getDeviceId());
      }

      const payload: OcorrenciaInsert = {
        device_id: getDeviceId(),
        tipo: values.tipo,
        status: 'pendente',
        unidade: unidade.nome,
        sede: unidade.temSedes ? (sedeId ? unidade.sedes[sedeId]?.nome ?? null : null) : null,
        bloco,
        local: PROBLEMAS_POR_AMBIENTE[ambienteId].nome,
        categoria_grupo: CATEGORIA_LABEL[categoria],
        problema: values.problema,
        ambiente: values.localExato,
        descricao_detalhada: values.descricao,
        identificacao_usuario: values.identificacao?.trim() || null,
        foto_url: fotoUrl,
        descricao: `${values.problema} - ${bloco}`,
      };

      await inserirOcorrencia(payload);
      setSucesso(true);
      form.reset();
      form.setValue('tipo', 'Reclamação');
      setNaturezaEscolhida(false);
      setFotoRelatoArquivo(null);
      setFeedReloadToken((v) => v + 1);
    } catch (submitError) {
      setErro('Falha ao enviar relato. Verifique as variáveis de ambiente e permissões no Supabase.');
      console.error(submitError);
    } finally {
      setEnviando(false);
    }
  }

  async function onValidarSenhaPaginaRelato() {
    const senha = adminKey.trim();
    if (!senha) {
      setErroFeed('Informe a senha admin para validar.');
      return;
    }

    setErroFeed(null);
    setMensagemGerenciamentoRelato(null);
    setValidandoSenhaAdmin(true);
    try {
      await validarSenhaAdmin(senha);
      setAdminKey(senha);
      setAdminSenhaValidada(true);
      setMensagemGerenciamentoRelato('Senha validada. Edição liberada.');
    } catch (e) {
      setAdminSenhaValidada(false);
      const mensagem = e instanceof Error ? e.message : 'Falha ao validar senha admin.';
      setErroFeed(/não autorizado/i.test(mensagem) ? 'Senha admin inválida.' : mensagem);
    } finally {
      setValidandoSenhaAdmin(false);
    }
  }

  const etapaNavegacao = useMemo(() => {
    if (!campusId) return 'campus';
    if (unidade?.temSedes && !sedeId) return 'sede';
    if (!bloco) return 'bloco';
    return 'detalhes';
  }, [campusId, unidade, sedeId, bloco]);

  function iconeAmbiente(id: string) {
    if (id === 'areas_gerais_academicas_adm') return Briefcase;
    if (id === 'circulacao') return Footprints;
    if (id === 'sanitarios') return Toilet;
    if (id === 'externa') return Trees;
    return Building2;
  }

  function animarSelecaoParaCaminho(text: string, event: MouseEvent<HTMLButtonElement>) {
    if (!breadcrumbRef.current) return;

    const origem = event.currentTarget.getBoundingClientRect();
    const destino = breadcrumbRef.current.getBoundingClientRect();

    setRastroClique({
      text,
      startX: origem.left + origem.width / 2,
      startY: origem.top + origem.height / 2,
      endX: destino.left + destino.width / 2,
      endY: destino.top + destino.height / 2,
      running: false,
    });

    requestAnimationFrame(() => {
      setRastroClique((prev) => (prev ? { ...prev, running: true } : prev));
    });

    setTimeout(() => {
      setRastroClique(null);
    }, 260);
  }

  function selecionarCampus(id: string, nome: string, event: MouseEvent<HTMLButtonElement>) {
    animarSelecaoParaCaminho(nome, event);
    resetFluxoApartirCampus(id);
  }

  function selecionarSede(id: string, nome: string, event: MouseEvent<HTMLButtonElement>) {
    animarSelecaoParaCaminho(nome, event);
    setSedeId(id);
    setBloco('');
    setAmbienteId('');
    setCategoria('');
    form.resetField('problema');
    form.setValue('tipo', 'Reclamação');
    setNaturezaEscolhida(false);
  }

  function selecionarBloco(nome: string, event: MouseEvent<HTMLButtonElement>) {
    animarSelecaoParaCaminho(nome, event);
    setBloco(nome);
    setAmbienteId('');
    setCategoria('');
    form.resetField('problema');
    form.setValue('tipo', 'Reclamação');
    setNaturezaEscolhida(false);
  }

  function voltarParaInicioRelatos() {
    setPaginaRelato(null);
    setRelatoAbertoSelecionado(null);
    setDetalhe(null);
    setDetalheResolvido(null);
    setModo('relatos');
    setGestaoTela('campus');
    setGestaoCampusId('');
    resetFluxoApartirCampus('');
    window.history.pushState(null, '', '/');
  }

  function abrirPainelGestao(campusSelecionado: string) {
    setGestaoCampusId(campusSelecionado);
    setGestaoTela('painel');
  }

  function voltarSelecaoCampusGestao() {
    setGestaoTela('campus');
  }

  function irParaPontoCaminho(ponto: 'campus' | 'sede' | 'bloco') {
    if (ponto === 'campus') {
      setSedeId('');
      setBloco('');
      setAmbienteId('');
      setCategoria('');
      form.resetField('problema');
      form.setValue('tipo', 'Reclamação');
      setNaturezaEscolhida(false);
      return;
    }

    if (ponto === 'sede') {
      setBloco('');
      setAmbienteId('');
      setCategoria('');
      form.resetField('problema');
      form.setValue('tipo', 'Reclamação');
      setNaturezaEscolhida(false);
      return;
    }

    if (ponto === 'bloco') {
      setBloco('');
      setAmbienteId('');
      setCategoria('');
      form.resetField('problema');
      form.setValue('tipo', 'Reclamação');
      setNaturezaEscolhida(false);
      return;
    }

  }

  async function onConsultaRapida() {
    setErroBusca(null);
    setMensagemAdmin(null);

    const idCurto = Number(consultaNumero);
    if (!idCurto) {
      setErroBusca('Informe um ID válido.');
      return;
    }

    try {
      const resultado = await buscarPorIdCurto(idCurto);
      if (!resultado) {
        setDetalhe(null);
        setErroBusca('Relato não encontrado.');
        return;
      }

      setDetalhe(resultado);
      setStatusAdmin(resultado.status);
      setComplementoAdmin(resultado.complemento_admin ?? '');
    } catch (e) {
      setDetalhe(null);
      setErroBusca(e instanceof Error ? e.message : 'Falha ao consultar relato no Supabase.');
    }
  }

  async function onSalvarGerenciamento() {
    if (!detalhe) return;
    const senha = adminKey.trim();
    if (!senha) {
      setErroBusca('Informe a senha admin.');
      return;
    }
    setMensagemAdmin(null);
    setErroBusca(null);

    try {
      await gerenciarOcorrencia(
        {
          id: detalhe.id,
          status: statusAdmin,
          complemento_admin: complementoAdmin,
          gerenciado_por: 'admin-web',
        },
        senha,
      );

      setDetalhe({
        ...detalhe,
        status: statusAdmin,
        complemento_admin: complementoAdmin,
      });
      setMensagemAdmin('Gerenciamento salvo com sucesso.');
      setFeedReloadToken((v) => v + 1);
    } catch (e) {
      setErroBusca(e instanceof Error ? e.message : 'Falha ao salvar gerenciamento.');
    }
  }

  async function onEnviarConclusaoComunidade() {
    if (!comunidadeRelatoId) return;
    setMensagemComunidade(null);
    setErroFeed(null);

    try {
      await informarConclusaoComunidade({
        id: comunidadeRelatoId,
        email: comunidadeEmail,
        descricao: comunidadeDescricao,
      });

      setMensagemComunidade('Informação enviada para validação administrativa.');
      setComunidadeRelatoId(null);
      setComunidadeEmail('');
      setComunidadeDescricao('');
      setFeedReloadToken((v) => v + 1);
    } catch (e) {
      setErroFeed(e instanceof Error ? e.message : 'Falha ao enviar informação de conclusão.');
    }
  }

  async function onReforcarRelato(relato: OcorrenciaResumo) {
    try {
      await reforcarOcorrencia(relato.id, relato.reforcos ?? 0);
      if (relatoAbertoSelecionado?.id === relato.id) {
        setRelatoAbertoSelecionado({
          ...relatoAbertoSelecionado,
          reforcos: (relatoAbertoSelecionado.reforcos ?? 0) + 1,
        });
      }
      setFeedReloadToken((v) => v + 1);
    } catch (e) {
      setErroFeed(e instanceof Error ? e.message : 'Falha ao reforçar relato.');
    }
  }

  function abrirRelatoAberto(relato: OcorrenciaResumo) {
    setRelatoAbertoSelecionado(relato);
    setStatusAdmin(relato.status);
    setComplementoAdmin(relato.complemento_admin ?? '');
    setAdminTipoRelato(relato.tipo ?? 'Reclamação');
    setAdminBlocoRelato(relato.bloco ?? '');
    setAdminLocalRelato(relato.local ?? '');
    setAdminAmbienteRelato(relato.ambiente ?? '');
    setAdminProblemaRelato(relato.problema ?? '');
    setMensagemGerenciamentoRelato(null);
    setMensagemComunidade(null);
  }

  function abrirPaginaRelato(relato: OcorrenciaResumo) {
    setPaginaRelato(relato);
    setAdminKey('');
    setAdminSenhaValidada(false);
    setAlterandoBlocoRelato(false);
    setStatusAdmin(relato.status);
    setComplementoAdmin(relato.complemento_admin ?? '');
    setAdminTipoRelato(relato.tipo ?? 'Reclamação');
    setAdminBlocoRelato(relato.bloco ?? '');
    setAdminLocalRelato(relato.local ?? '');
    setAdminAmbienteRelato(relato.ambiente ?? '');
    setAdminProblemaRelato(relato.problema ?? '');
    setMensagemGerenciamentoRelato(null);
    setErroFeed(null);
    const rotaRelato = `/relato/${relato.id_curto}`;
    const atual = `${window.location.pathname}${window.location.search}`;
    if (atual !== rotaRelato) {
      window.history.pushState(null, '', rotaRelato);
    }
  }

  function fecharPaginaRelato() {
    setPaginaRelato(null);
    let rota = '/';
    if (campusId) {
      rota = gerarRotaCompacta(campusId, sedeId || undefined, bloco || undefined);
    }
    window.history.pushState(null, '', rota);
  }

  async function onSalvarPaginaRelato() {
    if (!paginaRelato) return;
    const senha = adminKey.trim();
    if (!senha) {
      setErroFeed('Informe a senha admin.');
      return;
    }
    if (!adminSenhaValidada) {
      setErroFeed('Valide a senha admin para salvar alterações.');
      return;
    }

    setErroFeed(null);
    setMensagemGerenciamentoRelato(null);
    setSalvandoGerenciamentoRelato(true);

    try {
      await gerenciarOcorrencia(
        {
          id: paginaRelato.id,
          status: statusAdmin,
          complemento_admin: complementoAdmin,
          gerenciado_por: 'admin-web',
          tipo: adminTipoRelato,
          bloco: adminBlocoRelato,
          local: adminLocalRelato,
          ambiente: adminAmbienteRelato,
          problema: adminProblemaRelato,
        },
        senha,
      );

      const atualizado: OcorrenciaResumo = {
        ...paginaRelato,
        status: statusAdmin,
        tipo: adminTipoRelato,
        bloco: adminBlocoRelato,
        local: adminLocalRelato,
        ambiente: adminAmbienteRelato,
        problema: adminProblemaRelato,
        complemento_admin: complementoAdmin,
      };

      setPaginaRelato(atualizado);
      if (relatoAbertoSelecionado?.id === paginaRelato.id) {
        setRelatoAbertoSelecionado(atualizado);
      }
      if (detalhe?.id === paginaRelato.id) {
        setDetalhe(atualizado);
      }

      setMensagemGerenciamentoRelato('Relato atualizado com sucesso.');
      setFeedReloadToken((v) => v + 1);
    } catch (e) {
      setErroFeed(e instanceof Error ? e.message : 'Falha ao gerenciar relato.');
    } finally {
      setSalvandoGerenciamentoRelato(false);
    }
  }

  const tituloEtapa =
    etapaNavegacao === 'campus' ? null :
      etapaNavegacao === 'sede' ? 'Sede' :
        etapaNavegacao === 'bloco' ? 'Bloco' : 'Relato';

  const naturezaSelecionada = form.watch('tipo');
  const grupoSelecionado = categoria;
  const nomeSedeAtual = unidade?.temSedes && sedeId ? unidade.sedes[sedeId]?.nome ?? null : null;
  const unidadePaginaRelato = useMemo<Unidade | null>(() => {
    if (!paginaRelato?.unidade) return null;
    const entrada = Object.values(DADOS_UNIDADES).find((item) => item.nome === paginaRelato.unidade);
    return entrada ?? null;
  }, [paginaRelato?.unidade]);

  const blocosDisponiveisPaginaRelato = useMemo(() => {
    if (!paginaRelato || !unidadePaginaRelato) return [] as string[];
    if (unidadePaginaRelato.temSedes) {
      const sedeNome = paginaRelato.sede ?? '';
      const sedeEntrada = Object.values(unidadePaginaRelato.sedes).find((sede) => sede.nome === sedeNome);
      return sedeEntrada ? Object.keys(sedeEntrada.blocos) : [];
    }
    return Object.keys(unidadePaginaRelato.blocos);
  }, [paginaRelato, unidadePaginaRelato]);

  const gruposDisponiveisPaginaRelato = useMemo(() => {
    if (!paginaRelato || !unidadePaginaRelato || !adminBlocoRelato) return [] as string[];

    let ambientesDoBloco: string[] = [];
    if (unidadePaginaRelato.temSedes) {
      const sedeNome = paginaRelato.sede ?? '';
      const sedeEntrada = Object.values(unidadePaginaRelato.sedes).find((sede) => sede.nome === sedeNome);
      ambientesDoBloco = sedeEntrada?.blocos[adminBlocoRelato] ?? [];
    } else {
      ambientesDoBloco = unidadePaginaRelato.blocos[adminBlocoRelato] ?? [];
    }

    return Array.from(
      new Set(
        ambientesDoBloco
          .map((ambienteId) => PROBLEMAS_POR_AMBIENTE[ambienteId]?.nome)
          .filter((nome): nome is string => Boolean(nome)),
      ),
    );
  }, [paginaRelato, unidadePaginaRelato, adminBlocoRelato]);

  useEffect(() => {
    if (!paginaRelato || gruposDisponiveisPaginaRelato.length === 0) return;
    if (!gruposDisponiveisPaginaRelato.includes(adminLocalRelato)) {
      setAdminLocalRelato(gruposDisponiveisPaginaRelato[0]);
    }
  }, [paginaRelato, gruposDisponiveisPaginaRelato, adminLocalRelato]);

  if (paginaRelato) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-8">
        <header className="mb-6 text-center">
          <button type="button" className="badge-brand" onClick={voltarParaInicioRelatos}>Sistema <span className="text-brand-yellow">ZeloUTF</span> · UTFPR</button>
        </header>

        <section className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-zinc-500">Página do Relato #{paginaRelato.id_curto}</p>
              <h2 className="text-xl font-semibold text-zinc-900">{paginaRelato.problema}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-700">
                <span className="rounded-full bg-zinc-100 px-3 py-1"><strong>Campus:</strong> {paginaRelato.unidade || '-'}</span>
                <span className="rounded-full bg-zinc-100 px-3 py-1"><strong>Sede:</strong> {paginaRelato.sede || '-'}</span>
                <span className="rounded-full bg-zinc-100 px-3 py-1"><strong>Bloco:</strong> {adminBlocoRelato || '-'}</span>
              </div>
            </div>
            <Button type="button" onClick={fecharPaginaRelato}>Fechar</Button>
          </div>

          <div className="mt-4 grid gap-2 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-2.5">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-700" htmlFor="adminKeyPagina">Senha admin</label>
              <div className="flex gap-2">
                <input
                  id="adminKeyPagina"
                  type="password"
                  className="input h-10"
                  value={adminKey}
                  onChange={(e) => {
                    setAdminKey(e.target.value);
                    setAdminSenhaValidada(false);
                    setErroFeed(null);
                    setMensagemGerenciamentoRelato(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void onValidarSenhaPaginaRelato();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={onValidarSenhaPaginaRelato}
                  disabled={validandoSenhaAdmin}
                  className="h-10 w-10 px-0"
                  title="Validar senha"
                  aria-label="Validar senha"
                >
                  {validandoSenhaAdmin ? '...' : <CheckCircle2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5">
              <div className="mb-1 flex items-center justify-between gap-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-700" htmlFor="adminStatusPagina">Status</label>
                <Button
                  type="button"
                  className="px-2.5 py-1 text-[11px]"
                  disabled={!adminSenhaValidada || blocosDisponiveisPaginaRelato.length === 0}
                  onClick={() => setAlterandoBlocoRelato((v) => !v)}
                >
                  {alterandoBlocoRelato ? 'Fechar bloco' : 'Alterar bloco'}
                </Button>
              </div>
              <div className="grid gap-2">
                <select
                  id="adminStatusPagina"
                  className="input h-10"
                  value={statusAdmin}
                  disabled={!adminSenhaValidada}
                  onChange={(e) => setStatusAdmin(e.target.value as 'pendente' | 'em_verificacao' | 'resolvido')}
                >
                  <option value="pendente">Aberto</option>
                  <option value="em_verificacao">Andamento</option>
                  <option value="resolvido">Concluído</option>
                </select>

                {alterandoBlocoRelato ? (
                  <select
                    className="input h-10"
                    value={adminBlocoRelato}
                    disabled={!adminSenhaValidada || blocosDisponiveisPaginaRelato.length === 0}
                    onChange={(e) => {
                      setAdminBlocoRelato(e.target.value);
                      setMensagemGerenciamentoRelato(null);
                    }}
                  >
                    {blocosDisponiveisPaginaRelato.map((nomeBloco) => (
                      <option key={nomeBloco} value={nomeBloco}>{nomeBloco}</option>
                    ))}
                  </select>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="adminLocalPagina">Grupo</label>
              <select
                id="adminLocalPagina"
                className="input"
                value={adminLocalRelato}
                disabled={!adminSenhaValidada || gruposDisponiveisPaginaRelato.length === 0}
                onChange={(e) => setAdminLocalRelato(e.target.value)}
              >
                {gruposDisponiveisPaginaRelato.length === 0 ? (
                  <option value={adminLocalRelato || ''}>{adminLocalRelato || 'Sem grupos para este bloco'}</option>
                ) : (
                  gruposDisponiveisPaginaRelato.map((nomeGrupo) => (
                    <option key={nomeGrupo} value={nomeGrupo}>{nomeGrupo}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="adminAmbientePagina">Local</label>
              <input
                id="adminAmbientePagina"
                className="input"
                value={adminAmbienteRelato}
                disabled={!adminSenhaValidada}
                onChange={(e) => setAdminAmbienteRelato(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="adminTipoPagina">Tipo de relato</label>
              <select
                id="adminTipoPagina"
                className="input"
                value={adminTipoRelato}
                disabled={!adminSenhaValidada}
                onChange={(e) => setAdminTipoRelato(e.target.value as 'Reclamação' | 'Melhoria')}
              >
                <option value="Reclamação">Reclamação</option>
                <option value="Melhoria">Melhoria</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium" htmlFor="descricaoPagina">Descrição registrada</label>
            <textarea id="descricaoPagina" className="input min-h-20" value={paginaRelato.descricao_detalhada || ''} readOnly />
          </div>

          {paginaRelato.foto_url ? (
            <div className="mt-3 grid gap-3 md:grid-cols-[7rem_1fr] md:items-stretch">
              <a href={paginaRelato.foto_url} target="_blank" rel="noreferrer" className="inline-block">
                <img src={paginaRelato.foto_url} alt={`Foto do relato #${paginaRelato.id_curto}`} className="h-20 w-28 rounded-lg border border-zinc-200 object-cover" />
              </a>
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="adminCompPagina">Complemento</label>
                <textarea
                  id="adminCompPagina"
                  className="input min-h-20"
                  value={complementoAdmin}
                  disabled={!adminSenhaValidada}
                  onChange={(e) => setComplementoAdmin(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium" htmlFor="adminCompPagina">Complemento</label>
              <textarea
                id="adminCompPagina"
                className="input min-h-20"
                value={complementoAdmin}
                disabled={!adminSenhaValidada}
                onChange={(e) => setComplementoAdmin(e.target.value)}
              />
            </div>
          )}

          {!adminSenhaValidada ? <p className="mt-3 text-sm text-zinc-600">Valide a senha para liberar os campos de edição e o botão de salvar.</p> : null}

          {mensagemGerenciamentoRelato ? <p className="mt-3 text-sm text-emerald-700">{mensagemGerenciamentoRelato}</p> : null}
          {erroFeed ? <p className="mt-2 text-sm text-red-700">{erroFeed}</p> : null}

          {adminSenhaValidada ? (
            <div className="mt-5 flex justify-center">
              <Button type="button" variant="primary" disabled={salvandoGerenciamentoRelato} onClick={onSalvarPaginaRelato}>
                {salvandoGerenciamentoRelato ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-8">
      <header className="mb-6 text-center">
        <button type="button" className="badge-brand" onClick={voltarParaInicioRelatos}>Sistema <span className="text-brand-yellow">ZeloUTF</span> · UTFPR</button>
      </header>

      {modo === 'relatos' ? (
        (campusId || nomeSedeAtual || bloco) ? (
          <div ref={breadcrumbRef} className="mb-4 flex min-h-8 flex-wrap items-center justify-center gap-2 text-sm">
            <button type="button" className="crumb-btn" onClick={() => irParaPontoCaminho('campus')}>{unidade?.nome ?? 'Unidade'}</button>
            {nomeSedeAtual ? <button type="button" className="crumb-btn" onClick={() => irParaPontoCaminho('sede')}>{nomeSedeAtual}</button> : null}
            {bloco ? <button type="button" className="crumb-btn" onClick={() => irParaPontoCaminho('bloco')}>{bloco}</button> : null}
          </div>
        ) : <div ref={breadcrumbRef} className="mb-2 h-0" />
      ) : null}

      {rastroClique ? (
        <span
          className="breadcrumb-fly"
          style={{
            left: rastroClique.startX,
            top: rastroClique.startY,
            transform: rastroClique.running
              ? `translate(${rastroClique.endX - rastroClique.startX}px, ${rastroClique.endY - rastroClique.startY}px) scale(0.9)`
              : 'translate(-50%, -50%)',
            opacity: rastroClique.running ? 0.2 : 1,
          }}
        >
          {rastroClique.text}
        </span>
      ) : null}

      {modo === 'gestao' ? (
        <>
          {gestaoTela === 'campus' ? (
            <section className="card card-gestao mb-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-3xl font-semibold text-indigo-950">Campus da Gestão</h2>
                <Button type="button" onClick={voltarParaInicioRelatos}>Modo relato</Button>
              </div>

              <button className="quick-action-gestao mb-4" type="button">
                <BarChart3 className="h-4 w-4" /> Relatório Inteligente
              </button>

              <div className="grid gap-3 md:grid-cols-4">
                {Object.entries(DADOS_UNIDADES).map(([id, item]) => (
                  <button
                    key={id}
                    type="button"
                    className="step-card"
                    onClick={() => abrirPainelGestao(id)}
                  >
                    <ShieldCheck className="icon-3d" />
                    {item.nome}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {gestaoTela === 'painel' && unidadeGestao ? (
            <>
              <section className="card card-gestao mb-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-indigo-950">Painel de atendimento • {unidadeGestao.nome}</h2>
                  <div className="flex gap-2">
                    <Button type="button" onClick={voltarSelecaoCampusGestao}>Trocar campus</Button>
                    <Button type="button" onClick={voltarParaInicioRelatos}>Modo relato</Button>
                  </div>
                </div>

                <button className="quick-action-gestao mb-4" type="button">
                  <BarChart3 className="h-4 w-4" /> Relatório Inteligente
                </button>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-900">Abertos / Em verificação</h3>
                    <div className="space-y-2">
                      {gestaoAbertos.length === 0 ? <p className="text-sm text-zinc-500">Nenhum relato pendente.</p> : null}
                      {gestaoAbertos.map((r) => (
                        <div key={r.id} className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
                          <p className="text-xs text-zinc-500">#{r.id_curto} • {r.bloco} • {r.local}</p>
                          <p className="mt-1 font-semibold">{r.problema}</p>
                          <p className="mt-1 text-sm text-zinc-700">{r.descricao_detalhada || '-'}</p>
                          <div className="mt-2"><Button type="button" onClick={() => { setDetalhe(r); setStatusAdmin(r.status); setComplementoAdmin(r.complemento_admin ?? ''); }}>Atender</Button></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-800">Resolvidos recentes</h3>
                    <div className="space-y-2">
                      {gestaoResolvidos.length === 0 ? <p className="text-sm text-zinc-500">Nenhum relato resolvido recentemente.</p> : null}
                      {gestaoResolvidos.map((r) => (
                        <div key={r.id} className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
                          <p className="text-xs text-zinc-600">#{r.id_curto} • {r.bloco} • {r.local}</p>
                          <p className="mt-1 font-semibold">{r.problema}</p>
                          <div className="mt-2"><Button type="button" onClick={() => setDetalheResolvido(r)}>Ver imagens e detalhes</Button></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="card card-gestao">
                <h2 className="mb-3 text-lg font-semibold">Atendimento e atualização</h2>
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    className="input"
                    placeholder="Consultar relato pelo número (Ex: 15)"
                    value={consultaNumero}
                    onChange={(e) => setConsultaNumero(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void onConsultaRapida();
                      }
                    }}
                  />
                  <Button type="button" onClick={onConsultaRapida}>Buscar</Button>
                </div>

                {detalhe ? (
                  <div className="mt-4 rounded-xl border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">#{detalhe.id_curto} • {detalhe.bloco} • {detalhe.local}</p>
                    <p className="mt-1 font-semibold">{detalhe.problema}</p>
                    <p className="mt-1 text-sm text-zinc-700">{detalhe.descricao_detalhada}</p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium" htmlFor="adminStatusGestao">Novo status</label>
                        <select
                          id="adminStatusGestao"
                          className="input"
                          value={statusAdmin}
                          onChange={(e) => setStatusAdmin(e.target.value as 'pendente' | 'em_verificacao' | 'resolvido')}
                        >
                          <option value="pendente">pendente</option>
                          <option value="em_verificacao">em_verificacao</option>
                          <option value="resolvido">resolvido</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium" htmlFor="adminKeyGestao">Senha admin</label>
                        <input
                          id="adminKeyGestao"
                          type="password"
                          className="input"
                          value={adminKey}
                          onChange={(e) => setAdminKey(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="mb-1 block text-sm font-medium" htmlFor="adminCompGestao">Complemento administrativo</label>
                      <textarea
                        id="adminCompGestao"
                        className="input min-h-24"
                        value={complementoAdmin}
                        onChange={(e) => setComplementoAdmin(e.target.value)}
                      />
                    </div>

                    <div className="mt-3">
                      <Button type="button" variant="primary" onClick={onSalvarGerenciamento}>Salvar gerenciamento</Button>
                    </div>
                  </div>
                ) : null}
              </section>
            </>
          ) : null}
        </>
      ) : (
        <>
          {etapaNavegacao !== 'detalhes' ? (
            <section className="card card-top-compact mb-4">
            {tituloEtapa ? (
              <div className="mb-2 text-center">
                <h2 className="mt-1 text-center text-4xl font-semibold text-zinc-900 md:text-[2.65rem]">{tituloEtapa}</h2>
              </div>
            ) : null}

            {etapaNavegacao === 'campus' ? (
              <div className="grid gap-3 md:grid-cols-4">
                {Object.entries(DADOS_UNIDADES).map(([id, item]) => (
                  <button key={id} type="button" className="step-card" onClick={(e) => selecionarCampus(id, item.nome, e)}>
                    <MapPin className="icon-3d" />
                    {item.nome}
                  </button>
                ))}
              </div>
            ) : null}

            {etapaNavegacao === 'sede' && unidade?.temSedes ? (
              <div className="grid gap-3 md:grid-cols-3">
                {Object.entries(unidade.sedes).map(([id, sede]) => (
                  <button key={id} type="button" className="step-card" onClick={(e) => selecionarSede(id, sede.nome, e)}>
                    <Building2 className="icon-3d" />
                    {sede.nome}
                  </button>
                ))}
              </div>
            ) : null}

            {etapaNavegacao === 'bloco' ? (
              <div className="grid gap-3 md:grid-cols-3">
                {Object.keys(blocos).map((nome) => (
                  <button key={nome} type="button" className="step-card" onClick={(e) => selecionarBloco(nome, e)}>
                    {nome.toLowerCase() === 'geral' ? <Globe className="icon-3d-muted" /> : <Building2 className="icon-3d" />}
                    {nome}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-4 space-y-3">
              <div className="card p-3">
                <p className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-zinc-800"><Search className="h-4 w-4" /> Consultar Relato pelo Número</p>
                <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                  <input
                    className="input"
                    placeholder="Ex: 15"
                    value={consultaNumero}
                    onChange={(e) => setConsultaNumero(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void onConsultaRapida();
                      }
                    }}
                  />
                  <Button type="button" onClick={onConsultaRapida}>Buscar</Button>
                </div>

                {detalhe ? (
                  <div className="mt-3 rounded-xl border border-zinc-200 p-3 text-left">
                    <p className="text-xs font-semibold text-zinc-500">Resumo do Relato #{detalhe.id_curto}</p>
                    <p className="mt-1 font-semibold">{detalhe.problema}</p>
                    <p className="mt-1 text-xs font-semibold text-indigo-700">Campus: {detalhe.unidade || '-'}</p>
                    <p className="mt-1 text-sm text-zinc-700">{detalhe.bloco} • {detalhe.local}</p>
                    {detalhe.foto_url ? (
                      <img src={detalhe.foto_url} alt={`Foto do relato #${detalhe.id_curto}`} className="mt-2 h-14 w-20 rounded-lg border border-zinc-200 object-cover" />
                    ) : null}
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <Button type="button" onClick={() => onReforcarRelato(detalhe)}>👍 Reforçar ({detalhe.reforcos ?? 0})</Button>
                      <Button type="button" onClick={() => abrirPaginaRelato(detalhe)}>↗️ Acessar página do relato</Button>
                    </div>
                  </div>
                ) : null}
              </div>
              {etapaNavegacao === 'campus' ? (
                <Button type="button" className="btn-gradient w-full" onClick={() => { setModo('gestao'); setGestaoTela('campus'); }}>
                  Entrar no Modo Gestão
                </Button>
              ) : null}
            </div>
            </section>
          ) : null}

          {etapaNavegacao === 'detalhes' ? (
            <>
              <section className="card card-hover-lift card-relato-compact">
                <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="natureza">Natureza</label>
                    <div id="natureza" className="choice-wrap choice-wrap-natureza">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          className={naturezaEscolhida && naturezaSelecionada === 'Melhoria' ? 'chip-btn chip-btn-active' : 'chip-btn'}
                          onClick={() => {
                            form.setValue('tipo', 'Melhoria');
                            setNaturezaEscolhida(true);
                          }}
                        >
                          Sugestão de Melhoria
                        </button>
                        <button
                          type="button"
                          className={naturezaEscolhida && naturezaSelecionada === 'Reclamação' ? 'chip-btn chip-btn-active' : 'chip-btn'}
                          onClick={() => {
                            form.setValue('tipo', 'Reclamação');
                            setNaturezaEscolhida(true);
                          }}
                        >
                          Fato Ocorrido
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Local</label>
                    <div className="choice-wrap choice-wrap-local">
                      <div className="choice-card-grid">
                        {ambientes.map((id) => {
                          const IconeAmbiente = iconeAmbiente(id);
                          const nome = PROBLEMAS_POR_AMBIENTE[id]?.nome ?? id;

                          return (
                            <button
                              key={id}
                              type="button"
                              className={ambienteId === id ? 'choice-card-btn choice-card-btn-active' : 'choice-card-btn'}
                              onClick={() => {
                                setAmbienteId(id);
                                setCategoria('');
                                form.resetField('problema');
                              }}
                            >
                              <IconeAmbiente className="icon-3d" />
                              {nome}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Grupo</label>
                    <div className="choice-wrap choice-wrap-grupo">
                      <div className="flex flex-wrap justify-center gap-2">
                        {(['estrutura', 'servicos', 'bens'] as CategoriaGrupo[]).map((item) => (
                          <button
                            key={item}
                            type="button"
                            className={grupoSelecionado === item ? 'chip-btn chip-btn-active' : 'chip-btn'}
                            onClick={() => {
                              setCategoria(item);
                              form.setValue('problema', '');
                            }}
                          >
                            {CATEGORIA_LABEL[item]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="problema">Tipo de relato</label>
                    <select id="problema" className="input" {...form.register('problema')}>
                      <option value="">Selecione...</option>
                      {problemas.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    {form.formState.errors.problema ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.problema.message}</p> : null}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="localExato">Local Exato (Andar+Sala)</label>
                    <input id="localExato" className="input" placeholder="Ex: 1º Andar + Sala 104" {...form.register('localExato')} />
                    {form.formState.errors.localExato ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.localExato.message}</p> : null}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="descricao">Descrição</label>
                    <textarea id="descricao" className="input min-h-24" {...form.register('descricao')} />
                    {form.formState.errors.descricao ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.descricao.message}</p> : null}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="identificacao">Identificação (opcional)</label>
                    <input id="identificacao" className="input" {...form.register('identificacao')} />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor="fotoRelato">Imagem do local (opcional)</label>
                    <label htmlFor="fotoRelato" className="upload-card-compact upload-card-highlight block cursor-pointer">
                      <ImagePlus className="icon-3d" />
                      {fotoRelatoArquivo ? fotoRelatoArquivo.name : 'Selecionar imagem'}
                    </label>
                    <input
                      id="fotoRelato"
                      accept="image/*"
                      className="hidden"
                      type="file"
                      onChange={(e) => setFotoRelatoArquivo(e.target.files?.[0] ?? null)}
                    />
                  </div>

                  <Button className="btn-submit-main inline-flex w-full items-center justify-center gap-2" disabled={enviando} variant="primary" type="submit">
                    <Send className="h-4 w-4" />
                    {enviando ? 'Enviando...' : 'Enviar relato'}
                  </Button>
                </form>

                {erro ? <p className="mt-3 inline-flex items-center gap-2 text-sm text-red-700"><AlertCircle className="h-4 w-4" /> {erro}</p> : null}
                {sucesso ? <p className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Relato enviado com sucesso.</p> : null}

                {comunidadeRelatoId ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-700">Informar conclusão (comunidade)</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium" htmlFor="comEmail">E-mail institucional</label>
                        <input
                          id="comEmail"
                          className="input"
                          placeholder="nome@utfpr.edu.br"
                          value={comunidadeEmail}
                          onChange={(e) => setComunidadeEmail(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button type="button" variant="primary" onClick={onEnviarConclusaoComunidade}>Enviar</Button>
                        <Button type="button" onClick={() => setComunidadeRelatoId(null)}>Cancelar</Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="mb-1 block text-sm font-medium" htmlFor="comDesc">Descrição</label>
                      <textarea
                        id="comDesc"
                        className="input min-h-24"
                        value={comunidadeDescricao}
                        onChange={(e) => setComunidadeDescricao(e.target.value)}
                      />
                    </div>
                    {mensagemComunidade ? <p className="mt-2 text-sm text-emerald-700">{mensagemComunidade}</p> : null}
                  </div>
                ) : null}
              </section>

              <section className="card mt-4">
                <h2 className="mb-3 text-lg font-semibold">📋 Relatos Abertos e em Andamento</h2>

                {carregandoFeed ? <p className="text-sm text-zinc-500">Carregando relatos...</p> : null}
                {erroFeed ? <p className="text-sm text-red-700">{erroFeed}</p> : null}

                {contextoFeed ? (
                  <div className="space-y-5">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-700">Abertos / Em verificação</h3>
                      <div className="grid gap-3 md:grid-cols-3">
                        {feedAbertos.length === 0 ? <p className="text-sm text-zinc-500">Nenhum relato aberto aqui.</p> : null}
                        {feedAbertos.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                            onClick={() => abrirRelatoAberto(r)}
                          >
                            <p className="text-xs text-zinc-500">#{r.id_curto} • {r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '-'} • {r.status === 'em_verificacao' ? 'Em verificação' : 'Aberto'}</p>
                            <p className="mt-1 font-semibold">{r.problema}</p>
                            <p className="mt-1 text-sm text-zinc-700">{r.descricao_detalhada || '-'}</p>
                            <p className="mt-2 text-xs font-semibold text-emerald-700">Toque para abrir e agir neste relato</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-800">Concluídos recentes (7 dias)</h3>
                      <div className="space-y-2">
                        {feedResolvidos.length === 0 ? <p className="text-sm text-zinc-500">Nenhum concluído recentemente.</p> : null}
                        {feedResolvidos.map((r) => (
                          <div key={r.id} className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
                            <p className="text-xs text-zinc-600">#{r.id_curto} • Encerrado em {r.resolvido_em ? new Date(r.resolvido_em).toLocaleDateString('pt-BR') : '-'}</p>
                            <p className="mt-1 font-semibold">{r.problema}</p>
                            <div className="mt-2"><Button type="button" onClick={() => setDetalheResolvido(r)}>Ver detalhes</Button></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            </>
          ) : null}
        </>
      )}

      {detalheResolvido ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500">Relato resolvido #{detalheResolvido.id_curto}</p>
                <h3 className="text-lg font-semibold text-zinc-900">{detalheResolvido.problema}</h3>
              </div>
              <Button type="button" onClick={() => setDetalheResolvido(null)}>Fechar</Button>
            </div>

            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p><strong>Local:</strong> {detalheResolvido.bloco} - {detalheResolvido.ambiente}</p>
              <p><strong>Descrição:</strong> {detalheResolvido.descricao_detalhada || '-'}</p>
              <p><strong>Concluído em:</strong> {detalheResolvido.resolvido_em ? new Date(detalheResolvido.resolvido_em).toLocaleString('pt-BR') : '-'}</p>
              <p><strong>Anotação admin:</strong> {detalheResolvido.complemento_admin || '-'}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {detalheResolvido.foto_url ? <a className="btn-secondary" href={detalheResolvido.foto_url} rel="noreferrer" target="_blank">🖼️ Foto original</a> : null}
              {detalheResolvido.foto_conclusao_url ? <a className="btn-secondary" href={detalheResolvido.foto_conclusao_url} rel="noreferrer" target="_blank">🖼️ Foto da conclusão</a> : null}
            </div>
          </div>
        </div>
      ) : null}

      {relatoAbertoSelecionado ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500">Resumo do Relato #{relatoAbertoSelecionado.id_curto}</p>
                <h3 className="text-lg font-semibold text-zinc-900">{relatoAbertoSelecionado.problema}</h3>
                <p className="mt-1 text-xs font-semibold text-indigo-700">Campus: {relatoAbertoSelecionado.unidade || '-'}</p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setRelatoAbertoSelecionado(null);
                }}
              >
                Fechar
              </Button>
            </div>

            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p><strong>Status:</strong> {relatoAbertoSelecionado.status === 'em_verificacao' ? 'Em andamento' : relatoAbertoSelecionado.status}</p>
              <p><strong>Local:</strong> {relatoAbertoSelecionado.bloco} • {relatoAbertoSelecionado.local}</p>
              <p><strong>Ambiente:</strong> {relatoAbertoSelecionado.ambiente || '-'}</p>
              <p><strong>Descrição:</strong> {relatoAbertoSelecionado.descricao_detalhada || '-'}</p>
            </div>

            {relatoAbertoSelecionado.foto_url ? (
              <img src={relatoAbertoSelecionado.foto_url} alt={`Foto do relato #${relatoAbertoSelecionado.id_curto}`} className="mt-4 h-16 w-24 rounded-lg border border-zinc-200 object-cover" />
            ) : null}

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <Button type="button" onClick={() => onReforcarRelato(relatoAbertoSelecionado)}>👍 Reforçar ({relatoAbertoSelecionado.reforcos ?? 0})</Button>
              <Button
                type="button"
                onClick={() => {
                  abrirPaginaRelato(relatoAbertoSelecionado);
                  setRelatoAbertoSelecionado(null);
                }}
              >
                ↗️ Acessar página do relato
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {erroBusca ? <p className="mt-3 text-sm text-red-700">{erroBusca}</p> : null}
      {mensagemAdmin ? <p className="mt-3 text-sm text-emerald-700">{mensagemAdmin}</p> : null}

      <footer className="app-footer mt-8">
        <span>Desenvolvido por Arthur Ferreira | 2026</span>
        <div className="app-footer-links">
          <a href="mailto:arthurferreira@utfpr.edu.br" aria-label="Enviar e-mail para Arthur Ferreira">
            <Mail className="h-4 w-4" />
          </a>
          <a href="https://instagram.com/arthuraaferreira" aria-label="Instagram" rel="noreferrer" target="_blank">
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
