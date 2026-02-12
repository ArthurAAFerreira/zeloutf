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
    deviceId: null
};

document.addEventListener('DOMContentLoaded', () => {
    gerarDeviceId();
    iniciarApp();
    window.onpopstate = () => iniciarApp();
});

function iniciarApp() {
    // 1. Verifica URL (?c=ct)
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

// --- RENDERIZADORES ---

function renderizarListaCampus() {
    const container = document.getElementById('lista-campus');
    container.innerHTML = '';
    for (const key in DADOS_UNIDADES) {
        const c = DADOS_UNIDADES[key];
        criarBotao(container, 'location_on', c.nome, () => {
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
        const s = sedes[key];
        criarBotao(container, 'business', s.nome, () => {
            estado.sedeId = key;
            renderizarBlocos(s.blocos);
            mudarTela('step-bloco');
        });
    }
}

function renderizarBlocos(listaBlocos) {
    const container = document.getElementById('lista-blocos');
    container.innerHTML = '';

    // listaBlocos agora é um Array de strings ["Bloco A", "Bloco B"...] vindo do data.js
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
        });
    }
}

// --- UTILITÁRIOS ---

function criarBotao(container, icone, texto, onClick) {
    const btn = document.createElement('button');
    btn.className = 'card-btn';
    btn.innerHTML = `<span class="material-icons-round">${icone}</span> <span>${texto}</span>`;
    btn.onclick = onClick;
    container.appendChild(btn);
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

function mudarTela(id) {
    document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

window.voltar = (stepDestino) => {
    // Lógica especial para o botão voltar
    if (stepDestino === 'step-sede') {
        // Se Londrina (sem sede) tentar voltar pra sede, joga pro início
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

function gerarDeviceId() {
    let id = localStorage.getItem('zelo_device_id');
    if (!id) { id = Math.random().toString(36).substring(2, 9); localStorage.setItem('zelo_device_id', id); }
    estado.deviceId = id;
}

// --- ENVIO ---
const form = document.getElementById('form-report');
if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.querySelector('.btn-enviar');
        const complemento = document.getElementById('input-complemento').value;

        if(!estado.subcategoria) { alert("Informe o problema."); return; }
        if(!db) { alert("Erro de conexão."); return; }

        btn.innerText = 'Enviando...'; btn.disabled = true;

        // Monta a descrição completa para o banco
        const sedeTexto = estado.sedeId ? `(${DADOS_UNIDADES[estado.campusId].sedes[estado.sedeId].nome})` : '';
        const descricaoCompleta = `${estado.subcategoria} em ${estado.ambienteNome} - ${estado.blocoNome} ${sedeTexto}`;

        const dados = {
            device_id: estado.deviceId,
            ambiente: complemento || "Não informado", // Ex: Sala 104
            categoria: estado.categoria.nome,
            descricao: descricaoCompleta,
            status: 'pendente'
        };

        const { error } = await db.from('ocorrencias').insert([dados]);
        if (error) { alert('Erro: ' + error.message); btn.disabled = false; btn.innerText = 'Tentar Novamente'; }
        else { mudarTela('step-sucesso'); btn.disabled = false; btn.innerText = 'ENVIAR'; }
    });
}