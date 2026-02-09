// --- DADOS (Editado: Apenas Curitiba e Londrina) ---
const CAMPI = {
    'ct': { nome: 'Curitiba', id: 'ct' },
    'ld': { nome: 'Londrina', id: 'ld' },
    // Outros campus removidos conforme pedido
    'default': { nome: 'Selecione seu Câmpus', id: 'default' }
};

const BLOCOS = [
    { nome: 'Bloco A', icone: 'school', id: 'A' },
    { nome: 'Bloco B', icone: 'science', id: 'B' },
    { nome: 'Bloco C', icone: 'menu_book', id: 'C' },
    { nome: 'Bloco D', icone: 'sports_soccer', id: 'D' },
    { nome: 'Banheiros', icone: 'wc', id: 'WC' },
    { nome: 'Pátio', icone: 'park', id: 'PATIO' }
];

const CATEGORIAS = {
    'limpeza': {
        nome: 'Limpeza',
        icone: 'cleaning_services',
        itens: ['Chão Sujo', 'Lixo Cheio', 'Derramamento', 'Mau Cheiro', 'Falta de Papel/Sabão']
    },
    'manutencao': {
        nome: 'Manutenção',
        icone: 'build',
        itens: ['Lâmpada Queimada', 'Tomada com Defeito', 'Porta Quebrada', 'Vazamento', 'Ar Condicionado']
    },
    'seguranca': {
        nome: 'Segurança',
        icone: 'security',
        itens: ['Porta Aberta Indevida', 'Extintor Vencido', 'Local Escuro', 'Fios Expostos']
    }
};

// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://jkmftolpmchsnxsjxoji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbWZ0b2xwbWNoc254c2p4b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5MTUsImV4cCI6MjA4NjIzNjkxNX0.WifDxpU_xqWA4Rx-OKSoeGAvPr4RTFK2NpJqC7gc_0M';

// Tenta iniciar o Supabase
let supabase;
if (typeof supabase !== 'undefined') { // Verifica se a biblioteca carregou
    supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// --- ESTADO DO APP ---
let estado = {
    campus: null,
    bloco: null,
    categoria: null,
    subcategoria: null,
    deviceId: null
};

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    identificarCampus();
    gerarDeviceId();
});

function identificarCampus() {
    // 1. Tenta pegar da URL (ex: ?c=ct)
    const params = new URLSearchParams(window.location.search);
    const campusCode = params.get('c');
    let campusInfo = null;

    if (campusCode && CAMPI[campusCode]) {
        campusInfo = CAMPI[campusCode];
    } else {
        campusInfo = CAMPI['default'];
    }

    estado.campus = campusInfo;

    // 2. Atualiza a tela
    const campusTitle = document.getElementById('campus-name');
    if (campusTitle) {
        if (campusInfo.id === 'default') {
            // Se não tem campus na URL, mostra a tela de escolha
            campusTitle.innerText = "ZeloUTF";
            carregarListaCampus();

            // Força mostrar a tela de seleção e esconder as outras
            mudarTela(null, 'step-campus');
        } else {
            // Se já tem campus, vai direto para os blocos
            campusTitle.innerText = `UTFPR - ${campusInfo.nome}`;
            carregarBlocos();
            mudarTela(null, 'step-bloco');
        }
    }
}

function carregarListaCampus() {
    const container = document.getElementById('lista-campus');
    if(!container) return;
    container.innerHTML = '';

    for (const key in CAMPI) {
        if (key === 'default') continue; // Pula o "Selecione"

        const campus = CAMPI[key];
        const btn = document.createElement('button');
        btn.className = 'card-btn';
        btn.innerHTML = `<span class="material-icons-round">location_on</span> <span>${campus.nome}</span>`;
        btn.onclick = () => {
            // Salva a escolha e avança
            estado.campus = campus;
            document.getElementById('campus-name').innerText = `UTFPR - ${campus.nome}`;
            carregarBlocos();
            mudarTela('step-campus', 'step-bloco');
        };
        container.appendChild(btn);
    }
}

function carregarBlocos() {
    const container = document.getElementById('lista-blocos');
    if(!container) return;
    container.innerHTML = '';

    BLOCOS.forEach(bloco => {
        const btn = document.createElement('button');
        btn.className = 'card-btn';
        btn.innerHTML = `<span class="material-icons-round">${bloco.icone}</span> <span>${bloco.nome}</span>`;
        btn.onclick = () => selecionarBloco(bloco);
        container.appendChild(btn);
    });
}

function gerarDeviceId() {
    let id = localStorage.getItem('zelo_device_id');
    if (!id) {
        id = crypto.randomUUID().split('-')[0];
        localStorage.setItem('zelo_device_id', id);
    }
    estado.deviceId = id;
    const badge = document.getElementById('user-badge');
    if(badge) badge.innerHTML = `<small>ID: ${id}</small>`;
}

// --- NAVEGAÇÃO ---
function selecionarBloco(bloco) {
    estado.bloco = bloco;
    mudarTela('step-bloco', 'step-categoria');
    const localSel = document.getElementById('local-selecionado');
    if(localSel) localSel.innerText = `Problema no ${bloco.nome}`;
    carregarCategorias();
}

function carregarCategorias() {
    const container = document.getElementById('lista-categorias');
    if(!container) return;
    container.innerHTML = '';

    for (const key in CATEGORIAS) {
        const cat = CATEGORIAS[key];
        const btn = document.createElement('button');
        btn.className = 'card-btn';
        btn.innerHTML = `<span class="material-icons-round">${cat.icone}</span> <span>${cat.nome}</span>`;
        btn.onclick = () => selecionarCategoria(key, cat);
        container.appendChild(btn);
    }
}

function selecionarCategoria(key, categoriaObjeto) {
    estado.categoria = categoriaObjeto;
    mudarTela('step-categoria', 'step-detalhes');

    const select = document.getElementById('input-subcategoria');
    if(select) {
        select.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.text = "Selecione o detalhe...";
        defaultOption.value = "";
        select.appendChild(defaultOption);

        categoriaObjeto.itens.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.innerText = item;
            select.appendChild(option);
        });
        select.onchange = (e) => { estado.subcategoria = e.target.value; };
    }
}

function mudarTela(atual, proxima) {
    // Esconde TODAS as telas primeiro
    document.querySelectorAll('.step').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active');
    });

    // Mostra só a próxima
    const elProx = document.getElementById(proxima);
    if(elProx) {
        elProx.classList.remove('hidden');
        elProx.classList.add('active');
    }
}

window.voltar = function(telaAlvo) {
    mudarTela(null, telaAlvo);
}

// --- ENVIO AO SUPABASE ---
const form = document.getElementById('form-report');
if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const subcategoriaInput = document.getElementById('input-subcategoria');
        const complementoInput = document.getElementById('input-ambiente');
        const btn = document.querySelector('.btn-enviar');

        if(!subcategoriaInput.value) {
            alert("Por favor, selecione qual é o problema específico.");
            return;
        }

        if (typeof supabase === 'undefined') {
            alert("Erro de conexão com o banco de dados. Recarregue a página.");
            return;
        }

        btn.innerText = 'Enviando...';
        btn.disabled = true;

        const dados = {
            device_id: estado.deviceId,
            ambiente: complementoInput.value || "Não informado",
            categoria: estado.categoria.nome,
            descricao: `${subcategoriaInput.value} - ${estado.bloco.nome} (${estado.campus.nome})`,
            status: 'pendente'
        };

        const { error } = await supabase.from('ocorrencias').insert([dados]);

        if (error) {
            console.error(error);
            alert('Erro ao enviar: ' + error.message);
            btn.innerText = 'Tentar Novamente';
            btn.disabled = false;
        } else {
            mudarTela('step-detalhes', 'step-sucesso');
            btn.innerText = 'ENVIAR RELATO';
            btn.disabled = false;
        }
    });
}