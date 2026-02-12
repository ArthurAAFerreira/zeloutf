// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://jkmftolpmchsnxsjxoji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbWZ0b2xwbWNoc254c2p4b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5MTUsImV4cCI6MjA4NjIzNjkxNX0.WifDxpU_xqWA4Rx-OKSoeGAvPr4RTFK2NpJqC7gc_0M';
const db = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// --- ESTADO GLOBAL ---
let estado = {
    campusId: null,
    sedeId: null,
    blocoNome: null,
    ambienteNome: null,
    categoria: null,
    subcategoria: null,
    tipoRelato: 'Reclamação', // Padrão
    deviceId: null
};

document.addEventListener('DOMContentLoaded', () => {
    gerarDeviceId();
    iniciarApp();
    window.onpopstate = () => iniciarApp();
});

// --- CONTROLE DE UI ---
function selecionarTipo(tipo) {
    estado.tipoRelato = tipo;

    // Atualiza visual dos botões
    document.getElementById('btn-reclamacao').classList.toggle('selected', tipo === 'Reclamação');
    document.getElementById('btn-melhoria').classList.toggle('selected', tipo === 'Melhoria');
}

function iniciarApp() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('c');

    if (code && DADOS_UNIDADES[code]) {
        estado.campusId = code;
        const campus = DADOS_UNIDADES[code];
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

// --- RENDERIZADORES (Botões) ---
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
            estado.categoria = cat;
            preencherDetalhes(cat);
            mudarTela('step-detalhes');
            // Limpa lista de relatos antigos ao entrar na tela
            document.getElementById('container-relatos-antigos').innerHTML = '';
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

function mudarTela(id) {
    document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

window.voltar = (stepDestino) => {
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

// --- FUNÇÃO: VER RELATOS EXISTENTES ---
async function carregarRelatosExistentes() {
    const container = document.getElementById('container-relatos-antigos');
    const btn = document.querySelector('.btn-ver-relatos');

    btn.innerText = "Carregando...";
    container.innerHTML = '';

    // Filtra por campus, sede (se houver) e bloco atual
    // Como salvamos tudo na "descricao", vamos fazer uma busca simples
    // Numa versão futura, idealmente teríamos colunas separadas para bloco_id

    // Busca os últimos 10 relatos pendentes
    const { data, error } = await db
        .from('ocorrencias')
        .select('*')
        .eq('status', 'pendente')
        .ilike('descricao', `%${estado.blocoNome}%`) // Filtra pelo bloco no texto
        .order('created_at', { ascending: false })
        .limit(10);

    btn.innerText = "📋 Atualizar Lista";

    if (error) {
        alert("Erro ao buscar relatos");
        return;
    }

    if (data.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999;">Nenhum relato recente neste bloco.</p>';
        return;
    }

    data.forEach(relato => {
        const div = document.createElement('div');
        const classeTipo = relato.tipo ? relato.tipo.toLowerCase() : 'reclamação';
        const dataFormatada = new Date(relato.created_at).toLocaleDateString('pt-BR');

        div.className = `relato-item ${classeTipo}`;
        div.innerHTML = `
            <div class="relato-header">
                <span>${dataFormatada}</span>
                <strong>${relato.tipo || 'Relato'}</strong>
            </div>
            <div style="font-weight:bold; margin-bottom:4px;">${relato.categoria}</div>
            <div>${relato.descricao}</div>
            ${relato.ambiente ? `<small>Local: ${relato.ambiente}</small>` : ''}
        `;
        container.appendChild(div);
    });
}

// --- FUNÇÃO: UPLOAD DE FOTO ---
async function uploadFoto(arquivo) {
    const nomeArquivo = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

    const { data, error } = await db.storage
        .from('fotos')
        .upload(nomeArquivo, arquivo);

    if (error) {
        console.error("Erro upload:", error);
        return null;
    }

    // Pega a URL pública
    const { data: publicData } = db.storage.from('fotos').getPublicUrl(nomeArquivo);
    return publicData.publicUrl;
}

// --- ENVIO DO FORMULÁRIO ---
const form = document.getElementById('form-report');
if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.querySelector('.btn-enviar');
        const complemento = document.getElementById('input-complemento').value;
        const descricaoExtra = document.getElementById('input-descricao').value;
        const inputFoto = document.getElementById('input-foto');

        if(!estado.subcategoria || !complemento) { alert("Preencha o problema e o local."); return; }
        if(!db) { alert("Erro de conexão."); return; }

        btn.innerText = 'Enviando...'; btn.disabled = true;

        // 1. Upload da foto (se houver)
        let fotoUrl = null;
        if (inputFoto.files.length > 0) {
            btn.innerText = 'Enviando foto...';
            fotoUrl = await uploadFoto(inputFoto.files[0]);
        }

        // 2. Monta o objeto
        const sedeTexto = estado.sedeId ? `(${DADOS_UNIDADES[estado.campusId].sedes[estado.sedeId].nome})` : '';
        const descricaoResumida = `${estado.subcategoria} - ${estado.blocoNome} ${sedeTexto}`;

        const dados = {
            device_id: estado.deviceId,
            tipo: estado.tipoRelato,
            ambiente: complemento,
            categoria: estado.categoria.nome,
            descricao: descricaoResumida,
            descricao_detalhada: descricaoExtra,
            foto_url: fotoUrl,
            status: 'pendente'
        };

        const { error } = await db.from('ocorrencias').insert([dados]);

        if (error) {
            alert('Erro: ' + error.message);
            btn.disabled = false;
            btn.innerText = 'Tentar Novamente';
        } else {
            mudarTela('step-sucesso');
            btn.disabled = false;
            btn.innerText = 'ENVIAR';
        }
    });
}

function gerarDeviceId() {
    let id = localStorage.getItem('zelo_device_id');
    if (!id) { id = Math.random().toString(36).substring(2, 9); localStorage.setItem('zelo_device_id', id); }
    estado.deviceId = id;
}