// public/assets/js/app.js

// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://jkmftolpmchsnxsjxoji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbWZ0b2xwbWNoc254c2p4b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5MTUsImV4cCI6MjA4NjIzNjkxNX0.WifDxpU_xqWA4Rx-OKSoeGAvPr4RTFK2NpJqC7gc_0M';
const db = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// --- ESTADO GLOBAL ---
let estado = {
    campusId: null,
    campusNome: null,
    sedeId: null,
    sedeNome: null,
    blocoNome: null,
    ambienteNome: null,
    categoriaId: null,
    categoriaNome: null,
    subcategoria: null,
    tipoRelato: 'Reclamação',
    deviceId: null,
    adminLogado: null
};

// Quando o site termina de carregar, ele liga tudo
document.addEventListener('DOMContentLoaded', () => {
    gerarDeviceId();
    iniciarApp();
    window.onpopstate = () => iniciarApp();
});

// --- CONTROLE DE TIPO (Reclamação vs Melhoria) ---
window.selecionarTipo = function(tipo) {
    estado.tipoRelato = tipo;
    document.getElementById('btn-reclamacao').classList.toggle('selected', tipo === 'Reclamação');
    document.getElementById('btn-melhoria').classList.toggle('selected', tipo === 'Melhoria');

    const listaContainer = document.getElementById('container-relatos-antigos');
    if (listaContainer.innerHTML !== '') {
        carregarRelatosExistentes();
    }
}

function iniciarApp() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('c');

    if (code && DADOS_UNIDADES[code]) {
        estado.campusId = code;
        const campus = DADOS_UNIDADES[code];
        estado.campusNome = campus.nome;
        document.getElementById('campus-name').innerText = `UTFPR - ${campus.nome}`;

        if (campus.temSedes) {
            renderizarSedes(campus.sedes);
            mudarTela('step-sede');
        } else {
            renderizarBlocos(campus.blocos);
            mudarTela('step-bloco');
        }
    } else {
        document.getElementById('campus-name').innerText = "ZeloUTF";
        renderizarListaCampus();
        mudarTela('step-campus');
    }
}

// --- RENDERIZADORES ---
function renderizarListaCampus() {
    const container = document.getElementById('lista-campus');
    container.innerHTML = '';
    for (const key in DADOS_UNIDADES) {
        criarBotao(container, 'location_on', DADOS_UNIDADES[key].nome, () => {
            const novaUrl = window.location.pathname + '?c=' + key;
            history.pushState({id: key}, '', novaUrl);
            iniciarApp();
        });
    }
}

function renderizarSedes(sedes) {
    const container = document.getElementById('lista-sedes');
    container.innerHTML = '';
    for (const key in sedes) {
        criarBotao(container, 'business', sedes[key].nome, () => {
            estado.sedeId = key;
            estado.sedeNome = sedes[key].nome;
            renderizarBlocos(sedes[key].blocos);
            mudarTela('step-bloco');
        });
    }
}

function renderizarBlocos(listaBlocos) {
    const container = document.getElementById('lista-blocos');
    container.innerHTML = '';
    listaBlocos.forEach(blocoNome => {
        criarBotao(container, 'domain', blocoNome, () => {
            estado.blocoNome = blocoNome;
            document.getElementById('titulo-bloco-selecionado').innerText = `Onde no ${blocoNome}?`;
            renderizarAmbientes();
            mudarTela('step-ambiente');
        });
    });
}

function renderizarAmbientes() {
    const container = document.getElementById('lista-ambientes');
    container.innerHTML = '';
    AMBIENTES_PADRAO.forEach(amb => {
        criarBotao(container, amb.icone, amb.nome, () => {
            estado.ambienteNome = amb.nome;
            renderizarCategorias();
            mudarTela('step-categoria');
        });
    });
}

function renderizarCategorias() {
    const container = document.getElementById('lista-categorias');
    container.innerHTML = '';
    for (const key in CATEGORIAS) {
        const cat = CATEGORIAS[key];
        criarBotao(container, cat.icone, cat.nome, () => {
            estado.categoriaId = key;
            estado.categoriaNome = cat.nome;
            preencherDetalhes(cat);
            mudarTela('step-detalhes');
            document.getElementById('container-relatos-antigos').innerHTML = '';
            document.getElementById('container-relatos-resolvidos').innerHTML = '';
        });
    }
}

function preencherDetalhes(cat) {
    const select = document.getElementById('input-subcategoria');
    select.innerHTML = '<option value="">Selecione o problema...</option>';
    cat.itens.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.innerText = item;
        select.appendChild(opt);
    });
    select.onchange = (e) => estado.subcategoria = e.target.value;
}

function criarBotao(container, icone, texto, onClick) {
    const btn = document.createElement('button');
    btn.className = 'card-btn';
    btn.innerHTML = `<span class="material-icons-round">${icone}</span> <span>${texto}</span>`;
    btn.onclick = onClick;
    container.appendChild(btn);
}

window.mudarTela = function(id) {
    document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

window.voltar = function(stepDestino) {
    if (stepDestino === 'step-sede') {
        const campus = DADOS_UNIDADES[estado.campusId];
        if (!campus.temSedes) {
            history.pushState({}, '', window.location.pathname);
            iniciarApp();
            return;
        }
    }
    if (stepDestino === 'step-campus') {
        history.pushState({}, '', window.location.pathname);
        iniciarApp();
    } else {
        mudarTela(stepDestino);
    }
};

// --- FILTRAGEM DE RELATOS E EXIBIÇÃO ---
window.carregarRelatosExistentes = async function() {
    const containerAbertos = document.getElementById('container-relatos-antigos');
    const containerResolvidos = document.getElementById('container-relatos-resolvidos');
    const btn = document.querySelector('.btn-ver-relatos');

    btn.innerText = "Carregando...";
    containerAbertos.innerHTML = '';
    containerResolvidos.innerHTML = '';

    // 1. Busca os Abertos
    let queryAbertos = db.from('ocorrencias').select('*')
        .eq('status', 'pendente')
        .eq('unidade', estado.campusNome).eq('bloco', estado.blocoNome)
        .eq('local', estado.ambienteNome).eq('categoria_grupo', estado.categoriaNome)
        .order('reforcos', { ascending: false }).order('created_at', { ascending: false }).limit(15);

    if (estado.sedeNome) queryAbertos = queryAbertos.eq('sede', estado.sedeNome);

    // 2. Busca os Resolvidos (Últimos 7 dias)
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    let queryResolvidos = db.from('ocorrencias').select('*')
        .eq('status', 'resolvido')
        .gte('resolvido_em', seteDiasAtras.toISOString())
        .eq('unidade', estado.campusNome).eq('bloco', estado.blocoNome)
        .eq('local', estado.ambienteNome).eq('categoria_grupo', estado.categoriaNome)
        .order('resolvido_em', { ascending: false }).limit(10);

    if (estado.sedeNome) queryResolvidos = queryResolvidos.eq('sede', estado.sedeNome);

    // Executa as buscas
    const [resAbertos, resResolvidos] = await Promise.all([queryAbertos, queryResolvidos]);

    btn.innerText = "📋 Relatos Abertos neste Local";

    // --- RENDERIZA ABERTOS ---
    if (resAbertos.error) {
        containerAbertos.innerHTML = '<p style="color:red;">Erro ao carregar lista.</p>';
    } else if (resAbertos.data.length === 0) {
        containerAbertos.innerHTML = '<p style="text-align:center; color:#999;">Nenhum relato pendente aqui.</p>';
    } else {
        resAbertos.data.forEach(r => containerAbertos.appendChild(criarCardRelato(r, true)));
    }

    // --- RENDERIZA RESOLVIDOS ---
    if (!resResolvidos.error && resResolvidos.data.length > 0) {
        resResolvidos.data.forEach(r => containerResolvidos.appendChild(criarCardRelato(r, false)));
    } else {
        containerResolvidos.innerHTML = '<p style="text-align:center; font-size: 0.8rem; color:#ccc;">Nenhum relato recente concluído.</p>';
    }
}

// Construtor do HTML do Relato
function criarCardRelato(relato, isAberto) {
    const div = document.createElement('div');
    const classeTipo = relato.tipo ? relato.tipo.toLowerCase() : 'reclamação';
    const dataCriacao = new Date(relato.created_at).toLocaleDateString('pt-BR');
    const iconeTipo = relato.tipo === 'Melhoria' ? '💡' : '⚠';
    const numId = relato.id_curto ? `#${relato.id_curto}` : '';
    const qtdReforcos = relato.reforcos || 0;

    // Foto
    let imgHtml = '';
    if (relato.foto_url) {
        imgHtml = `<img src="${relato.foto_url}" class="foto-miniatura" onclick="window.open('${relato.foto_url}', '_blank')">`;
    }

    div.className = `relato-item ${isAberto ? classeTipo : 'resolvido'}`;

    let conteudo = `
        <div class="relato-header">
            <span>${dataCriacao} <span class="relato-id">${numId}</span></span>
            <strong>${iconeTipo} ${relato.tipo || 'Relato'}</strong>
        </div>
        <div style="font-weight:bold; margin-bottom:4px;">${relato.problema}</div>
        <div style="font-size: 0.9em; color: #555;">${relato.descricao_detalhada || ''}</div>
        ${relato.ambiente ? `<small style="display:block; margin-top:5px; color:#888;">Local: ${relato.ambiente}</small>` : ''}
        ${imgHtml}
    `;

    // Se estiver aberto, mostra os botões de ação
    if (isAberto) {
        const dadosJson = encodeURIComponent(JSON.stringify(relato));
        conteudo += `
            <div class="acoes-linha-1">
                <button class="btn-acao reforco" onclick="reforcarRelato('${relato.id}', ${qtdReforcos})">👍 Reforçar (${qtdReforcos})</button>
                <button class="btn-acao gerenciar" onclick="abrirModalAdmin('${dadosJson}')">⚙️ Gerenciar</button>
            </div>
            <div class="acoes-linha-2">
                <button class="btn-acao informar" onclick="informarResolucao('${relato.id}')">📢 Informar Resolução</button>
            </div>
        `;
    } else {
        const dataConclusao = new Date(relato.resolvido_em).toLocaleDateString('pt-BR');
        conteudo += `<div style="margin-top:10px; padding:8px; background:#e8f5e9; color:#2e7d32; border-radius:6px; font-size:0.85rem;">
            ✅ Resolvido em ${dataConclusao} ${relato.gerenciado_por ? `por ${relato.gerenciado_por}` : ''}
            ${relato.complemento_admin ? `<br><em>Nota: ${relato.complemento_admin}</em>` : ''}
        </div>`;
    }

    div.innerHTML = conteudo;
    return div;
}

// --- FUNÇÃO: REFORÇAR ---
window.reforcarRelato = async function(idRelato, reforcosAtuais) {
    const storageKey = `upvote_${idRelato}`;
    if (localStorage.getItem(storageKey)) { alert("Você já reforçou este relato!"); return; }
    if(!db) return;

    const agora = new Date().toISOString();
    const { error } = await db.from('ocorrencias')
        .update({ reforcos: reforcosAtuais + 1, ultimo_reforco_em: agora })
        .eq('id', idRelato);

    if (error) alert("Erro ao reforçar: " + error.message);
    else { localStorage.setItem(storageKey, 'true'); carregarRelatosExistentes(); }
}

// --- FUNÇÃO: INFORMAR RESOLUÇÃO ---
window.informarResolucao = async function(idRelato) {
    const email = prompt("Identificamos que este problema já foi resolvido? Informe seu e-mail institucional (@utfpr.edu.br) para a administração verificar:");
    if (!email) return;

    if (!email.includes('@utfpr.edu.br')) {
        alert("Por favor, use um e-mail válido da UTFPR."); return;
    }

    const { error } = await db.from('ocorrencias')
        .update({ solicitacao_resolucao_por: email.trim() })
        .eq('id', idRelato);

    if (error) alert("Erro: " + error.message);
    else alert("Obrigado! A administração foi notificada para baixar este chamado.");
}

// --- FUNÇÕES: MODAL DE ADMINISTRAÇÃO ---
window.abrirModalAdmin = function(dadosUrlCoded) {
    const senha = prompt("Digite a Senha Mestre para gerenciar:");
    if (!senha) return;

    if (typeof SENHAS_MESTRE === 'undefined') {
        alert("Erro no sistema: Arquivo de senhas não encontrado.");
        return;
    }

    const usuarioAdmin = SENHAS_MESTRE[senha];
    if (!usuarioAdmin) { alert("Senha incorreta ou não autorizada!"); return; }

    const relato = JSON.parse(decodeURIComponent(dadosUrlCoded));

    document.getElementById('admin-uuid').value = relato.id;
    document.getElementById('admin-id-relato').innerText = relato.id_curto ? `#${relato.id_curto}` : '';
    document.getElementById('admin-criado').innerText = new Date(relato.created_at).toLocaleString('pt-BR');
    document.getElementById('admin-reforco').innerText = relato.ultimo_reforco_em ? new Date(relato.ultimo_reforco_em).toLocaleDateString('pt-BR') : 'Nunca';
    document.getElementById('admin-qtd-reforco').innerText = relato.reforcos || 0;
    document.getElementById('admin-local').innerText = `${relato.bloco} - ${relato.ambiente}`;
    document.getElementById('admin-problema').innerText = relato.problema;
    document.getElementById('admin-descricao').innerText = relato.descricao_detalhada || 'Sem descrição';

    document.getElementById('admin-complemento').value = relato.complemento_admin || '';
    document.getElementById('admin-concluido').checked = false;
    document.getElementById('admin-foto').value = '';

    estado.adminLogado = usuarioAdmin;
    document.getElementById('modal-admin').classList.remove('hidden');
}

window.fecharModalAdmin = function() {
    document.getElementById('modal-admin').classList.add('hidden');
    estado.adminLogado = null;
}

window.salvarGerenciamento = async function() {
    const id = document.getElementById('admin-uuid').value;
    const complemento = document.getElementById('admin-complemento').value;
    const isConcluido = document.getElementById('admin-concluido').checked;
    const inputFoto = document.getElementById('admin-foto');
    const btn = document.querySelector('#modal-admin .btn-enviar');

    btn.innerText = "Salvando..."; btn.disabled = true;

    let fotoConclusao = null;
    if (inputFoto.files.length > 0) {
        btn.innerText = "Enviando foto...";
        fotoConclusao = await uploadFoto(inputFoto.files[0]);
    }

    const dadosUpdate = {
        complemento_admin: complemento,
        gerenciado_por: estado.adminLogado
    };

    if (fotoConclusao) dadosUpdate.foto_conclusao_url = fotoConclusao;

    if (isConcluido) {
        dadosUpdate.status = 'resolvido';
        dadosUpdate.resolvido_em = new Date().toISOString();
    }

    const { error } = await db.from('ocorrencias').update(dadosUpdate).eq('id', id);

    if (error) {
        alert("Erro ao salvar: " + error.message);
        btn.innerText = "💾 SALVAR ALTERAÇÕES"; btn.disabled = false;
    } else {
        alert("Relato atualizado com sucesso!");
        btn.innerText = "💾 SALVAR ALTERAÇÕES"; btn.disabled = false;
        fecharModalAdmin();
        carregarRelatosExistentes();
    }
}

// --- UPLOAD DE FOTO ---
async function uploadFoto(arquivo) {
    const nomeArquivo = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const { data, error } = await db.storage.from('fotos').upload(nomeArquivo, arquivo);
    if (error) return null;
    const { data: publicData } = db.storage.from('fotos').getPublicUrl(nomeArquivo);
    return publicData.publicUrl;
}

// --- ENVIO DO FORMULÁRIO PRINCIPAL ---
const form = document.getElementById('form-report');
if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.querySelector('.btn-enviar');
        const complemento = document.getElementById('input-complemento').value;
        const descricaoExtra = document.getElementById('input-descricao').value;
        const identificacao = document.getElementById('input-identidade').value;
        const inputFoto = document.getElementById('input-foto');

        if(!estado.subcategoria || !complemento || !descricaoExtra.trim()) {
            alert("Preencha o problema, o local exato e a descrição."); return;
        }

        btn.innerText = 'Enviando...'; btn.disabled = true;

        let fotoUrl = null;
        if (inputFoto.files.length > 0) {
            btn.innerText = 'Enviando foto...';
            fotoUrl = await uploadFoto(inputFoto.files[0]);
        }

        const sedeTexto = estado.sedeId ? `(${DADOS_UNIDADES[estado.campusId].sedes[estado.sedeId].nome})` : '';
        const descricaoResumida = `${estado.subcategoria} - ${estado.blocoNome} ${sedeTexto}`;

        const dados = {
            device_id: estado.deviceId,
            tipo: estado.tipoRelato,
            status: 'pendente',
            unidade: estado.campusNome,
            sede: estado.sedeNome,
            bloco: estado.blocoNome,
            local: estado.ambienteNome,
            categoria_grupo: estado.categoriaNome,
            problema: estado.subcategoria,
            ambiente: complemento,
            descricao_detalhada: descricaoExtra,
            identificacao_usuario: identificacao,
            foto_url: fotoUrl,
            descricao: descricaoResumida
        };

        const { error } = await db.from('ocorrencias').insert([dados]);

        if (error) {
            alert('Erro: ' + error.message);
            btn.disabled = false; btn.innerText = 'Tentar Novamente';
        } else {
            mudarTela('step-sucesso');
            btn.disabled = false; btn.innerText = 'ENVIAR RELATO';
        }
    });
}

function gerarDeviceId() {
    let id = localStorage.getItem('zelo_device_id');
    if (!id) { id = Math.random().toString(36).substring(2, 9); localStorage.setItem('zelo_device_id', id); }
    estado.deviceId = id;
}