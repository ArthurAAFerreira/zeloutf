// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://jkmftolpmchsnxsjxoji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbWZ0b2xwbWNoc254c2p4b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5MTUsImV4cCI6MjA4NjIzNjkxNX0.WifDxpU_xqWA4Rx-OKSoeGAvPr4RTFK2NpJqC7gc_0M';
const db = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// --- ESTADO GLOBAL ---
let estado = { campusId: null, campusNome: null, sedeId: null, sedeNome: null, blocoNome: null, ambienteNome: null, categoriaId: null, categoriaNome: null, subcategoria: null, tipoRelato: null, deviceId: null, adminLogado: null, ultimoRelatorioUrlSufixo: '', ultimoRelatorioSubtitulo: '' };

document.addEventListener('DOMContentLoaded', () => { gerarDeviceId(); iniciarApp(); window.onpopstate = () => iniciarApp(); });

window.selecionarTipo = function(tipo) {
    estado.tipoRelato = tipo;
    document.getElementById('btn-reclamacao').classList.toggle('selected', tipo === 'Reclamação');
    document.getElementById('btn-melhoria').classList.toggle('selected', tipo === 'Melhoria');
}

function iniciarApp() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('c');
    const rota = parsearRota(code);

    if (!rota) {
        document.getElementById('campus-name').innerText = "ZeloUTF";
        renderizarListaCampus();
        mudarTela('step-campus');
        return;
    }

    estado.campusId = rota.campusId;
    const campus = DADOS_UNIDADES[rota.campusId];
    estado.campusNome = campus.nome;
    document.getElementById('campus-name').innerText = `UTFPR - ${campus.nome}`;

    if (campus.temSedes) {
        estado.sedeId = rota.sedeId || null;
        estado.sedeNome = rota.sedeId ? campus.sedes[rota.sedeId]?.nome || null : null;
        if (!rota.sedeId) {
            renderizarSedes(campus.sedes);
            mudarTela('step-sede');
            return;
        }

        const blocosDaSede = campus.sedes[rota.sedeId].blocos;
        if (!rota.blocoNome) {
            renderizarBlocos(blocosDaSede);
            mudarTela('step-bloco');
            return;
        }

        estado.blocoNome = rota.blocoNome;
        document.getElementById('titulo-bloco-selecionado').innerText = `Onde no ${rota.blocoNome}?`;
        renderizarAmbientes(blocosDaSede[rota.blocoNome]);
        verificarAvisosComunidade(rota.blocoNome);
        mudarTela('step-ambiente');
        return;
    }

    if (!rota.blocoNome) {
        renderizarBlocos(campus.blocos);
        mudarTela('step-bloco');
        return;
    }

    estado.blocoNome = rota.blocoNome;
    document.getElementById('titulo-bloco-selecionado').innerText = `Onde no ${rota.blocoNome}?`;
    renderizarAmbientes(campus.blocos[rota.blocoNome]);
    verificarAvisosComunidade(rota.blocoNome);
    mudarTela('step-ambiente');
}

function parsearRota(code) {
    if (!code) return null;

    const partes = code.split('.').filter(Boolean).map(normalizarToken);
    const campusId = partes[0];
    const campus = DADOS_UNIDADES[campusId];
    if (!campus) return null;

    const rota = { campusId, sedeId: null, blocoNome: null };

    if (campus.temSedes) {
        const sedeId = partes[1];
        if (!sedeId) return rota;
        if (!campus.sedes[sedeId]) return null;

        rota.sedeId = sedeId;

        const blocoToken = normalizarToken(partes[2]);
        if (!blocoToken) return rota;

        const blocoNome = encontrarBlocoPorToken(campus.sedes[sedeId].blocos, blocoToken);
        if (!blocoNome) return null;

        rota.blocoNome = blocoNome;
        return rota;
    }

    const blocoToken = normalizarToken(partes[1]);
    if (!blocoToken) return rota;

    const blocoNome = encontrarBlocoPorToken(campus.blocos, blocoToken);
    if (!blocoNome) return null;

    rota.blocoNome = blocoNome;
    return rota;
}


function normalizarToken(valor) {
    return (valor || '').toString().trim().toLowerCase();
}

function tokenizarBloco(blocoNome) {
    const nomeLimpo = blocoNome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (nomeLimpo === 'geral') return 'geral';
    if (nomeLimpo === 'areas de acesso') return 'acesso';
    if (nomeLimpo === 'area de circulacao') return 'circulacao';

    const matchBloco = blocoNome.match(/^Bloco\s+([A-Za-z0-9]+)/i);
    if (matchBloco) return matchBloco[1].toLowerCase();

    return nomeLimpo.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function encontrarBlocoPorToken(blocosObj, blocoToken) {
    const tokenNormalizado = normalizarToken(blocoToken);
    return Object.keys(blocosObj).find(blocoNome => tokenizarBloco(blocoNome) === tokenNormalizado) || null;
}

function gerarCodigoRota(campusId, sedeId = null, blocoNome = null) {
    const partes = [campusId];
    if (sedeId) partes.push(sedeId);
    if (blocoNome) partes.push(tokenizarBloco(blocoNome));
    return partes.join('.');
}

function renderizarListaCampus() {
    const container = document.getElementById('lista-campus'); container.innerHTML = '';
    for (const key in DADOS_UNIDADES) {
        criarBotao(container, 'location_on', DADOS_UNIDADES[key].nome, () => {
            history.pushState({id: key}, '', window.location.pathname + '?c=' + gerarCodigoRota(key));
            iniciarApp();
        });
    }
}

function renderizarSedes(sedes) {
    const container = document.getElementById('lista-sedes'); container.innerHTML = '';

    // Atualiza nome do botão do Câmpus
    const btnRelatorio = document.getElementById('btn-relatorio-campus');
    if(btnRelatorio) btnRelatorio.innerHTML = `<span class="material-icons-round">analytics</span> Relatório Inteligente UTFPR-${estado.campusId.toUpperCase()}`;

    for (const key in sedes) {
        criarBotao(container, 'business', sedes[key].nome, () => {
            estado.sedeId = key;
            estado.sedeNome = sedes[key].nome;
            history.pushState({}, '', window.location.pathname + '?c=' + gerarCodigoRota(estado.campusId, key));
            renderizarBlocos(sedes[key].blocos);
            mudarTela('step-bloco');
        });
    }
}

function renderizarBlocos(listaBlocosObj) {
    const container = document.getElementById('lista-blocos'); container.innerHTML = '';

    // Pega as chaves (nomes dos blocos) do objeto
    let blocosNomes = Object.keys(listaBlocosObj);

    // Lógica de Ordenação
    let blocosFinais = blocosNomes.filter(b => !['Geral', 'Áreas de Acesso', 'Área de Circulação'].includes(b));
    blocosFinais.sort();
    if (blocosNomes.includes('Área de Circulação')) blocosFinais.unshift('Área de Circulação');
    if (blocosNomes.includes('Áreas de Acesso')) blocosFinais.unshift('Áreas de Acesso');
    if (blocosNomes.includes('Geral')) blocosFinais.unshift('Geral');

    // Atualiza Botão Relatório (Mantido igual)
    const btnRelatorio = document.getElementById('btn-relatorio-local');
    if(btnRelatorio) {
        let nomeSufixo = estado.campusId.toUpperCase();
        if (estado.sedeId) nomeSufixo += '-' + estado.sedeId.charAt(0).toUpperCase() + estado.sedeId.slice(1);
        btnRelatorio.innerHTML = `<span class="material-icons-round">insights</span> Relatório Inteligente UTFPR-${nomeSufixo}`;
    }

    blocosFinais.forEach(blocoNome => {
        const isGeral = (blocoNome === 'Geral');
        const isAcesso = (blocoNome === 'Áreas de Acesso' || blocoNome === 'Área de Circulação');
        let icone = 'domain'; if(isGeral) icone = 'public'; if(isAcesso) icone = 'directions_walk';

        const btn = document.createElement('button');
        btn.className = isGeral ? 'card-btn geral' : 'card-btn';
        btn.innerHTML = `<span class="material-icons-round">${icone}</span> <span>${blocoNome}</span>`;
        btn.onclick = () => {
            estado.blocoNome = blocoNome;
            history.pushState({}, '', window.location.pathname + '?c=' + gerarCodigoRota(estado.campusId, estado.sedeId, blocoNome));
            document.getElementById('titulo-bloco-selecionado').innerText = `Onde no ${blocoNome}?`;
            // Passa a lista de IDs de ambiente para a próxima função
            renderizarAmbientes(listaBlocosObj[blocoNome]);
            verificarAvisosComunidade(blocoNome);
            mudarTela('step-ambiente');
        };
        container.appendChild(btn);
    });
}

function renderizarAmbientes(listaIdsAmbientes) {
    const container = document.getElementById('lista-ambientes'); container.innerHTML = '';

    listaIdsAmbientes.forEach(idAmb => {
        const amb = PROBLEMAS_POR_AMBIENTE[idAmb];
        if(amb) {
            criarBotao(container, amb.icone, amb.nome, () => {
                estado.ambienteId = idAmb; // Guarda o ID (ex: sala_aula_lab)
                estado.ambienteNome = amb.nome; // Guarda o Nome Bonito
                renderizarCategorias(amb.categorias);
                mudarTela('step-categoria');
            });
        }
    });
}

function renderizarCategorias(categoriasDoAmbiente) {
    const container = document.getElementById('lista-categorias'); container.innerHTML = '';

    // Mapeamento visual das categorias (ícones e nomes bonitos)
    const MAPA_CATEGORIAS = {
        'estrutura': { nome: 'Estrutura', icone: 'apartment' },
        'servicos': { nome: 'Serviços', icone: 'engineering' },
        'bens': { nome: 'Bens em Geral', icone: 'chair_alt' }
    };

    for (const key in categoriasDoAmbiente) {
        if(MAPA_CATEGORIAS[key]) {
            criarBotao(container, MAPA_CATEGORIAS[key].icone, MAPA_CATEGORIAS[key].nome, () => {
                estado.categoriaId = key;
                estado.categoriaNome = MAPA_CATEGORIAS[key].nome;
                // Passa a lista de problemas string direto
                preencherDetalhes(categoriasDoAmbiente[key]);
                mudarTela('step-detalhes');
                carregarRelatosExistentes();
            });
        }
    }
}

function preencherDetalhes(listaProblemas) {
    const select = document.getElementById('input-subcategoria');
    select.innerHTML = '<option value="">Selecione o problema...</option>';

    listaProblemas.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.innerText = item;
        select.appendChild(opt);
    });

    select.onchange = (e) => estado.subcategoria = e.target.value;
}

function criarBotao(container, icone, texto, onClick) {
    const btn = document.createElement('button'); btn.className = 'card-btn';
    btn.innerHTML = `<span class="material-icons-round">${icone}</span> <span>${texto}</span>`; btn.onclick = onClick; container.appendChild(btn);
}

window.mudarTela = function(id) { document.querySelectorAll('.step').forEach(el => el.classList.add('hidden')); document.getElementById(id).classList.remove('hidden'); }
window.voltar = function(step) { if (step === 'step-sede' && !DADOS_UNIDADES[estado.campusId].temSedes) { history.pushState({}, '', window.location.pathname); iniciarApp(); return; } if (step === 'step-campus') { history.pushState({}, '', window.location.pathname); iniciarApp(); return; } if (step === 'step-sede') { history.pushState({}, '', window.location.pathname + '?c=' + gerarCodigoRota(estado.campusId)); } if (step === 'step-bloco') { history.pushState({}, '', window.location.pathname + '?c=' + gerarCodigoRota(estado.campusId, estado.sedeId)); } mudarTela(step); };

window.abrirContatos = function() {
    const contato = DADOS_UNIDADES[estado.campusId]?.contato || 'Contato não cadastrado.';
    document.getElementById('conteudo-contatos').innerHTML = `<strong>${estado.campusNome}</strong><br><br><a href="mailto:${contato.split(' - ')[1]}">${contato}</a>`;
    document.getElementById('modal-contatos').classList.remove('hidden');
}
window.fecharModalContatos = function() { document.getElementById('modal-contatos').classList.add('hidden'); }


// --- INTEGRAÇÃO COM N8N (DINÂMICO) ---
window.abrirRelatorioInteligente = async function(nivelConsulta) {
    const senha = prompt("Acesso Restrito: Digite a Senha Mestre para IA");
    if (!senha || typeof SENHAS_MESTRE === 'undefined' || !SENHAS_MESTRE[senha]) { alert("Acesso Negado."); return; }

    estado.adminLogado = SENHAS_MESTRE[senha];

    document.getElementById('modal-ia').classList.remove('hidden');
    document.getElementById('conteudo-ia').innerHTML = `<div style="text-align:center; padding: 20px;">Conectando ao n8n e processando IA... 🤖⏳</div>`;
    document.getElementById('area-email-relatorio').classList.add('hidden');

    // DEFINIÇÃO DA URL E DO TÍTULO
    let urlSufixo = '';
    let subtitulo = 'UTFPR';

    if (nivelConsulta === 'campus') {
        urlSufixo = `-${estado.campusId}`;
        subtitulo = `UTFPR-${estado.campusId.toUpperCase()}`;
    } else if (nivelConsulta === 'local') {
        urlSufixo = `-${estado.campusId}`;
        subtitulo = `UTFPR-${estado.campusId.toUpperCase()}`;
        if (estado.sedeId) {
            urlSufixo += `-${estado.sedeId}`;
            subtitulo += `-${estado.sedeId.charAt(0).toUpperCase() + estado.sedeId.slice(1)}`;
        }
    }

    // Salva para usar no envio do email
    estado.ultimoRelatorioUrlSufixo = urlSufixo;
    estado.ultimoRelatorioSubtitulo = subtitulo;

    document.getElementById('modal-ia-subtitulo').innerText = subtitulo;

    // A URL VAI USAR WEBHOOK-TEST CONFORME SEU PEDIDO (Lembre-se de clicar em Listen no n8n)
    const n8nWebhookBaseUrl = `https://n8n.arthuraaferreira.com.br/webhook/ia-zelo-utfpr${urlSufixo}`;

    try {
        const params = new URLSearchParams({
            nivel: nivelConsulta,
            contexto: subtitulo,
            solicitante: estado.adminLogado
        });

        const response = await fetch(`${n8nWebhookBaseUrl}?${params.toString()}`, { method: 'GET' });
        if (!response.ok) throw new Error("O n8n retornou um erro ou está offline.");

        const textoIA = await response.text();
        document.getElementById('conteudo-ia').innerHTML = textoIA;
        document.getElementById('area-email-relatorio').classList.remove('hidden');

    } catch (e) {
        document.getElementById('conteudo-ia').innerHTML = `<p style="color:red; text-align:center;">Erro ao conectar com o n8n.<br><small>${e.message}</small></p>`;
    }
}
window.fecharModalIA = function() { document.getElementById('modal-ia').classList.add('hidden'); }

window.enviarRelatorioEmail = async function() {
    const inputEmail = document.getElementById('input-email-relatorio');
    const emailStr = inputEmail.value.trim();

    if(!emailStr.includes('@utfpr.edu.br') && !emailStr.includes('@alunos.utfpr.edu.br')) {
        alert("Por favor, informe um e-mail válido da UTFPR."); return;
    }

    const btn = event.target; const textoOriginal = btn.innerText;
    btn.innerText = "Enviando..."; btn.disabled = true;

    // Mantém exatamente a mesma URL-test
    const url = `https://n8n.arthuraaferreira.com.br/webhook/ia-zelo-utfpr${estado.ultimoRelatorioUrlSufixo}`;

    const params = new URLSearchParams({
        contexto: estado.ultimoRelatorioSubtitulo,
        solicitante: estado.adminLogado || 'Admin',
        acao: 'enviar_email',
        email_destino: emailStr
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
        if (!response.ok) throw new Error("Erro de conexão com servidor.");

        alert("Relatório encaminhado para " + emailStr + " com sucesso!");
        inputEmail.value = '';
    } catch (e) {
        alert("Falha ao enviar e-mail: " + e.message);
    }

    btn.innerText = textoOriginal; btn.disabled = false;
}


// --- RESTO DO SISTEMA ---
window.buscarRelato = async function() {
    const idCurto = document.getElementById('input-busca-id').value; if(!idCurto) return;
    const btn = event.target; btn.innerText = "...";
    const {data, error} = await db.from('ocorrencias').select('*').eq('id_curto', idCurto).single();
    btn.innerText = "Buscar";
    if(error || !data) { alert("Não encontrado!"); return; }
    const json = encodeURIComponent(JSON.stringify(data));
    data.status === 'resolvido' ? window.abrirModalDetalhes(json) : window.abrirModalAdmin(json);
}

async function verificarAvisosComunidade(bloco) {
    let q = db.from('ocorrencias').select('*').eq('comunidade_sugere_conclusao', true).neq('status', 'resolvido').eq('unidade', estado.campusNome).eq('bloco', bloco);
    if(estado.sedeNome) q = q.eq('sede', estado.sedeNome);
    const {data} = await q;
    const area = document.getElementById('area-validacao-comunidade'); const cnt = document.getElementById('lista-validacao-comunidade');
    area.classList.add('hidden'); cnt.innerHTML = '';
    if(data && data.length > 0) {
        area.classList.remove('hidden');
        data.forEach(r => { const d = document.createElement('div'); d.className = 'relato-item'; d.style.cursor = 'pointer'; d.innerHTML = `<strong>#${r.id_curto}</strong> - ${r.problema}`; d.onclick = () => window.abrirModalAdmin(encodeURIComponent(JSON.stringify(r))); cnt.appendChild(d); });
    }
}

window.carregarRelatosExistentes = async function() {
    const cAb = document.getElementById('container-relatos-antigos'); const cRe = document.getElementById('container-relatos-resolvidos');
    const txtStatus = document.getElementById('txt-status-carregamento');
    txtStatus.innerText = "Carregando..."; cAb.innerHTML = ''; cRe.innerHTML = '';

    let qAb = db.from('ocorrencias').select('*').in('status', ['pendente', 'em_verificacao']).eq('unidade', estado.campusNome).eq('bloco', estado.blocoNome).eq('local', estado.ambienteNome).eq('categoria_grupo', estado.categoriaNome).order('reforcos', {ascending: false}).limit(15);
    if(estado.sedeNome) qAb = qAb.eq('sede', estado.sedeNome);

    const d = new Date(); d.setDate(d.getDate() - 7);
    let qRe = db.from('ocorrencias').select('*').eq('status', 'resolvido').gte('resolvido_em', d.toISOString()).eq('unidade', estado.campusNome).eq('bloco', estado.blocoNome).eq('local', estado.ambienteNome).eq('categoria_grupo', estado.categoriaNome).order('resolvido_em', {ascending: false}).limit(10);
    if(estado.sedeNome) qRe = qRe.eq('sede', estado.sedeNome);

    const [rAb, rRe] = await Promise.all([qAb, qRe]);
    txtStatus.innerText = "📋 Relatos Abertos e em Andamento";

    if(rAb.data && rAb.data.length > 0) rAb.data.forEach(r => cAb.appendChild(criarCardAberto(r))); else cAb.innerHTML = '<p style="color:#999; text-align:center;">Nenhum relato aberto aqui.</p>';
    if(rRe.data && rRe.data.length > 0) rRe.data.forEach(r => cRe.appendChild(criarCardResolvido(r))); else cRe.innerHTML = '<p style="color:#ccc; text-align:center;">Nenhum concluído recentemente.</p>';
}

function criarCardAberto(r) {
    const d = document.createElement('div');
    const isVer = r.status === 'em_verificacao'; const hasCom = r.comunidade_sugere_conclusao; const isPen = r.status === 'pendente';
    d.className = `relato-item ${r.tipo ? r.tipo.toLowerCase() : 'reclamação'} ${isVer ? 'verificacao' : ''} ${hasCom ? 'comunidade-alerta' : ''}`;
    let bHtml = '';
    if(isPen) bHtml += `<span style="background:#ff9800; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:bold;">🔴 Aberto</span> `;
    if(isVer) bHtml += `<span style="background:#2196F3; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:bold;">🔵 Em Verificação / Acatado</span> `;
    if(hasCom) bHtml += `<span style="background:#e65100; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:bold;">📢 Validar Conclusão</span>`;

    d.innerHTML = `
        <div style="margin-bottom: 5px;">${bHtml}</div>
        <div class="relato-header"><span>${new Date(r.created_at).toLocaleDateString('pt-BR')} <span class="relato-id">#${r.id_curto || ''}</span></span> <strong>${r.tipo === 'Melhoria' ? '💡 Sugestão' : '⚠ Fato'}</strong></div>
        <div style="font-weight:bold;">${r.problema}</div><div style="font-size:0.9em; color:#555;">${r.descricao_detalhada || ''}</div>
        ${r.ambiente ? `<small style="display:block; color:#888;">Local: ${r.ambiente}</small>` : ''}
        <div class="acoes-linha-1">
            <button class="btn-acao reforco" onclick="reforcarRelato('${r.id}', ${r.reforcos||0})">👍 Reforçar (${r.reforcos||0})</button>
            <button class="btn-acao gerenciar" onclick="abrirModalAdmin('${encodeURIComponent(JSON.stringify(r))}')">⚙️ Gerenciar</button>
        </div>
        ${!hasCom ? `<div class="acoes-linha-2"><button class="btn-acao informar" onclick="abrirModalComunidade('${r.id}')">📢 Informar Conclusão</button></div>` : ''}
    `;
    return d;
}

function criarCardResolvido(r) {
    const d = document.createElement('div'); d.className = 'relato-item resolvido';
    d.innerHTML = `<div class="relato-header"><span>#${r.id_curto||''} - Encerrado em ${new Date(r.resolvido_em).toLocaleDateString('pt-BR')}</span></div><div style="font-weight:bold;">${r.problema}</div><button class="btn-acao" style="margin-top:10px; width:100%;" onclick="abrirModalDetalhes('${encodeURIComponent(JSON.stringify(r))}')">Ver Detalhes</button>`;
    return d;
}

window.reforcarRelato = async function(id, ref) {
    const k = `upvote_${id}`; if(localStorage.getItem(k)) { alert("Já reforçou!"); return; }
    const {error} = await db.from('ocorrencias').update({reforcos: ref+1, ultimo_reforco_em: new Date().toISOString()}).eq('id', id);
    if(!error) { localStorage.setItem(k, 'true'); carregarRelatosExistentes(); }
}

window.abrirModalComunidade = function(id) { document.getElementById('com-id').value = id; document.getElementById('modal-comunidade').classList.remove('hidden'); }
window.fecharModalComunidade = function() { document.getElementById('modal-comunidade').classList.add('hidden'); }
window.enviarResolucaoComunidade = async function() {
    const id = document.getElementById('com-id').value; const email = document.getElementById('com-email').value; const btn = document.querySelector('#modal-comunidade .btn-enviar');
    if(!email.includes('@utfpr.edu.br') && !email.includes('@alunos.utfpr.edu.br')) { alert("Use e-mail UTFPR."); return; }
    btn.disabled = true; let fUrl = null; if(document.getElementById('com-foto').files.length > 0) fUrl = await uploadFoto(document.getElementById('com-foto').files[0]);
    const {error} = await db.from('ocorrencias').update({comunidade_sugere_conclusao: true, comunidade_email: email, comunidade_descricao: document.getElementById('com-desc').value, comunidade_foto_url: fUrl}).eq('id', id);
    if(!error) { alert("Enviado!"); fecharModalComunidade(); carregarRelatosExistentes(); }
    btn.disabled = false;
}

function preencherSelectTransferencia() {
    const selBloco = document.getElementById('admin-transf-bloco'); selBloco.innerHTML = '<option value="">Manter no bloco atual</option>';
    let blocos = [];
    if(estado.sedeNome) { blocos = DADOS_UNIDADES[estado.campusId].sedes[estado.sedeId].blocos; } else { blocos = DADOS_UNIDADES[estado.campusId].blocos; }
    blocos.forEach(b => { const opt = document.createElement('option'); opt.value = b; opt.innerText = b; selBloco.appendChild(opt); });

    const selAmb = document.getElementById('admin-transf-ambiente'); selAmb.innerHTML = '<option value="">Manter no ambiente atual</option>';
    AMBIENTES_PADRAO.forEach(a => { const opt = document.createElement('option'); opt.value = a.nome; opt.innerText = a.nome; selAmb.appendChild(opt); });
}

window.abrirModalAdmin = function(json) {
    const senha = prompt("Senha Mestre:"); if(!senha || !SENHAS_MESTRE[senha]) { alert("Acesso Negado."); return; }
    const r = JSON.parse(decodeURIComponent(json));
    document.getElementById('admin-uuid').value = r.id;
    document.getElementById('admin-id-relato').innerText = r.id_curto ? `#${r.id_curto}` : '';
    document.getElementById('admin-local').innerText = `${r.bloco} - ${r.ambiente}`;
    document.getElementById('admin-problema').innerText = r.problema;
    document.getElementById('admin-descricao').innerText = r.descricao_detalhada || '';

    document.getElementById('admin-area-foto-original').innerHTML = r.foto_url ? `<a href="${r.foto_url}" target="_blank">🖼️ Ver Foto Original anexada</a>` : '';

    const alertaCom = document.getElementById('admin-alerta-comunidade');
    if(r.comunidade_sugere_conclusao) {
        alertaCom.classList.remove('hidden');
        document.getElementById('admin-com-email').innerText = `Por: ${r.comunidade_email}`;
        document.getElementById('admin-com-desc').innerText = r.comunidade_descricao || 'Sem descrição extra';
        document.getElementById('admin-com-foto').innerHTML = r.comunidade_foto_url ? `<br><a href="${r.comunidade_foto_url}" target="_blank">🖼️ Ver foto enviada pela comunidade</a>` : '';
    } else { alertaCom.classList.add('hidden'); }

    document.getElementById('admin-status').value = r.status || 'pendente';
    document.getElementById('admin-complemento').value = r.complemento_admin || '';
    document.getElementById('admin-foto').value = '';

    preencherSelectTransferencia();
    estado.adminLogado = SENHAS_MESTRE[senha]; document.getElementById('modal-admin').classList.remove('hidden');
}
window.fecharModalAdmin = function() { document.getElementById('modal-admin').classList.add('hidden'); }

window.recusarValidacaoComunidade = async function() {
    if(!confirm("Tem certeza que deseja recusar essa informação? A foto e os dados enviados pela comunidade serão apagados do sistema.")) return;

    const id = document.getElementById('admin-uuid').value; const btn = event.target; const textoOriginal = btn.innerText;
    btn.innerText = "Apagando..."; btn.disabled = true;

    const { error } = await db.from('ocorrencias').update({
        comunidade_sugere_conclusao: false, comunidade_email: null, comunidade_descricao: null, comunidade_foto_url: null
    }).eq('id', id);

    if (error) { alert("Erro ao recusar: " + error.message); btn.innerText = textoOriginal; btn.disabled = false; }
    else { alert("Validação recusada e dados limpos com sucesso."); fecharModalAdmin(); carregarRelatosExistentes(); }
}

window.salvarGerenciamento = async function() {
    const id = document.getElementById('admin-uuid').value; const status = document.getElementById('admin-status').value;
    const transfBloco = document.getElementById('admin-transf-bloco').value; const transfAmbiente = document.getElementById('admin-transf-ambiente').value;
    const btn = document.querySelector('#modal-admin .btn-enviar'); btn.disabled = true;

    let update = { complemento_admin: document.getElementById('admin-complemento').value, gerenciado_por: estado.adminLogado, status: status };
    if(document.getElementById('admin-foto').files.length > 0) update.foto_conclusao_url = await uploadFoto(document.getElementById('admin-foto').files[0]);

    if(status === 'resolvido') { update.resolvido_em = new Date().toISOString(); update.comunidade_sugere_conclusao = false; }
    if(transfBloco) update.bloco = transfBloco;
    if(transfAmbiente) update.local = transfAmbiente;

    const {error} = await db.from('ocorrencias').update(update).eq('id', id);
    if(!error) { alert("Salvo!"); fecharModalAdmin(); carregarRelatosExistentes(); } else alert("Erro.");
    btn.disabled = false;
}

window.abrirModalDetalhes = function(json) {
    const r = JSON.parse(decodeURIComponent(json)); document.getElementById('det-id-relato').innerText = `#${r.id_curto}`;

    let html = `<strong>Problema:</strong> ${r.problema} (${r.bloco} - ${r.ambiente}) <br><strong>Descrição original:</strong> <em>${r.descricao_detalhada}</em> <br><hr><strong style="color:green;">Concluído em:</strong> ${new Date(r.resolvido_em).toLocaleString('pt-BR')} <br><strong>Encerrado por:</strong> ${r.gerenciado_por || 'Sistema'} <br><strong>Anotação Admin:</strong> ${r.complemento_admin || '-'}`;
    if(r.foto_url) html += `<br><a href="${r.foto_url}" target="_blank">🖼️ Foto Original</a>`;
    if(r.foto_conclusao_url) html += `<br><a href="${r.foto_conclusao_url}" target="_blank">🖼️ Foto da Conclusão</a>`;

    document.getElementById('det-conteudo').innerHTML = html;
    document.getElementById('modal-detalhes').classList.remove('hidden');
}
window.fecharModalDetalhes = function() { document.getElementById('modal-detalhes').classList.add('hidden'); }

async function uploadFoto(arq) { const n = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`; const {error} = await db.storage.from('fotos').upload(n, arq); return error ? null : db.storage.from('fotos').getPublicUrl(n).data.publicUrl; }

const f = document.getElementById('form-report');
if(f) f.addEventListener('submit', async(e)=>{
    e.preventDefault(); if(!estado.tipoRelato) { alert("Selecione a Natureza do Relato."); return; }
    const btn = document.querySelector('.btn-enviar'); btn.disabled = true;
    const comp = document.getElementById('input-complemento').value; const desc = document.getElementById('input-descricao').value;
    if(!estado.subcategoria || !comp || !desc.trim()) { alert("Preencha o problema, o local exato e a descrição."); btn.disabled = false; return; }

    let fUrl = null; if(document.getElementById('input-foto').files.length>0) fUrl = await uploadFoto(document.getElementById('input-foto').files[0]);
    const {error} = await db.from('ocorrencias').insert([{ device_id: estado.deviceId, tipo: estado.tipoRelato, status: 'pendente', unidade: estado.campusNome, sede: estado.sedeNome, bloco: estado.blocoNome, local: estado.ambienteNome, categoria_grupo: estado.categoriaNome, problema: estado.subcategoria, ambiente: comp, descricao_detalhada: desc, identificacao_usuario: document.getElementById('input-identidade').value, foto_url: fUrl, descricao: `${estado.subcategoria} - ${estado.blocoNome}` }]);
    if(!error) mudarTela('step-sucesso'); btn.disabled = false;
});
function gerarDeviceId() { let id = localStorage.getItem('zelo_device_id'); if(!id) { id = Math.random().toString(36).substring(2,9); localStorage.setItem('zelo_device_id', id); } estado.deviceId = id; }
