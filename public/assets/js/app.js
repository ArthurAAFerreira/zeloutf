// --- CONFIGURAÇÃO ---
const CAMPI = {
    'ct': { nome: 'Curitiba', id: 'ct' },
    'ld': { nome: 'Londrina', id: 'ld' },
    'default': { nome: 'Selecione', id: 'default' }
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
        nome: 'Limpeza', icone: 'cleaning_services',
        itens: ['Chão Sujo', 'Lixo Cheio', 'Derramamento', 'Mau Cheiro', 'Falta de Papel/Sabão']
    },
    'manutencao': {
        nome: 'Manutenção', icone: 'build',
        itens: ['Lâmpada Queimada', 'Tomada', 'Porta Quebrada', 'Vazamento', 'Ar Condicionado']
    },
    'seguranca': {
        nome: 'Segurança', icone: 'security',
        itens: ['Porta Aberta', 'Extintor Vencido', 'Local Escuro', 'Fios Expostos']
    }
};

const SUPABASE_URL = 'https://jkmftolpmchsnxsjxoji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbWZ0b2xwbWNoc254c2p4b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5MTUsImV4cCI6MjA4NjIzNjkxNX0.WifDxpU_xqWA4Rx-OKSoeGAvPr4RTFK2NpJqC7gc_0M';

const db = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
let estado = { campus: null, bloco: null, categoria: null, subcategoria: null, deviceId: null };

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    gerarDeviceId();
    identificarCampus();

    // Permite que o botão "Voltar" do navegador funcione
    window.addEventListener('popstate', () => {
        identificarCampus();
    });
});

function identificarCampus() {
    // Pega o código da URL (ex: ?c=ct)
    const params = new URLSearchParams(window.location.search);
    const code = params.get('c');

    // Verifica se o código é válido
    const campusInfo = (code && CAMPI[code]) ? CAMPI[code] : CAMPI['default'];
    estado.campus = campusInfo;

    const titulo = document.getElementById('campus-name');

    if (campusInfo.id === 'default') {
        // Modo Seleção
        if(titulo) titulo.innerText = "ZeloUTF";
        renderizarBotoesCampus();
        mudarTela('step-campus');
    } else {
        // Modo Câmpus Selecionado
        if(titulo) titulo.innerText = `UTFPR - ${campusInfo.nome}`;
        renderizarBlocos();
        mudarTela('step-bloco');
    }
}

function renderizarBotoesCampus() {
    const container = document.getElementById('lista-campus');
    if (!container) return;
    container.innerHTML = '';

    for (const key in CAMPI) {
        if (key === 'default') continue;
        const c = CAMPI[key];
        const btn = document.createElement('button');
        btn.className = 'card-btn';
        btn.innerHTML = `<span class="material-icons-round">location_on</span> <span>${c.nome}</span>`;

        btn.onclick = () => {
            // --- A MÁGICA ACONTECE AQUI ---
            // Atualiza a URL para ?c=ct sem recarregar a página
            const novaUrl = window.location.pathname + '?c=' + c.id;
            history.pushState({id: c.id}, '', novaUrl);

            // Força a atualização da tela
            identificarCampus();
        };

        container.appendChild(btn);
    }
}

function renderizarBlocos() {
    const container = document.getElementById('lista-blocos');
    if (!container) return;
    container.innerHTML = '';
    BLOCOS.forEach(bloco => {
        const btn = document.createElement('button');
        btn.className = 'card-btn';
        btn.innerHTML = `<span class="material-icons-round">${bloco.icone}</span> <span>${bloco.nome}</span>`;
        btn.onclick = () => {
            estado.bloco = bloco;
            renderizarCategorias();
            mudarTela('step-categoria');
            document.getElementById('local-selecionado').innerText = `Problema no ${bloco.nome}`;
        };
        container.appendChild(btn);
    });
}

function renderizarCategorias() {
    const container = document.getElementById('lista-categorias');
    if (!container) return;
    container.innerHTML = '';
    for (const key in CATEGORIAS) {
        const cat = CATEGORIAS[key];
        const btn = document.createElement('button');
        btn.className = 'card-btn';
        btn.innerHTML = `<span class="material-icons-round">${cat.icone}</span> <span>${cat.nome}</span>`;
        btn.onclick = () => {
            estado.categoria = cat;
            preencherDetalhes(cat);
            mudarTela('step-detalhes');
        };
        container.appendChild(btn);
    }
}

function preencherDetalhes(cat) {
    const select = document.getElementById('input-subcategoria');
    if(select) {
        select.innerHTML = '<option value="">Selecione o detalhe...</option>';
        cat.itens.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.innerText = item;
            select.appendChild(opt);
        });
        select.onchange = (e) => estado.subcategoria = e.target.value;
    }
}

function mudarTela(idTela) {
    document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
    const alvo = document.getElementById(idTela);
    if(alvo) alvo.classList.remove('hidden');
}

// Botão Voltar
window.voltar = (telaDestino) => {
    if (telaDestino === 'step-campus') {
        // Se estiver voltando para a escolha de campus, limpa a URL
        history.pushState({}, '', window.location.pathname);
        identificarCampus();
    } else {
        mudarTela(telaDestino);
    }
};

function gerarDeviceId() {
    let id = localStorage.getItem('zelo_device_id');
    if (!id) {
        id = Math.random().toString(36).substring(2, 9);
        localStorage.setItem('zelo_device_id', id);
    }
    estado.deviceId = id;
}

// ENVIO
const form = document.getElementById('form-report');
if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.querySelector('.btn-enviar');
        const ambiente = document.getElementById('input-ambiente').value;

        if(!estado.subcategoria) { alert("Selecione o problema."); return; }
        if(!db) { alert("Erro no sistema (Supabase). Recarregue a página."); return; }

        btn.innerText = 'Enviando...';
        btn.disabled = true;

        const dados = {
            device_id: estado.deviceId,
            ambiente: ambiente || "Não informado",
            categoria: estado.categoria.nome,
            descricao: `${estado.subcategoria} - ${estado.bloco.nome} (${estado.campus.nome})`,
            status: 'pendente'
        };

        const { error } = await db.from('ocorrencias').insert([dados]);

        if (error) {
            alert('Erro: ' + error.message);
            btn.innerText = 'Tentar Novamente';
            btn.disabled = false;
        } else {
            mudarTela('step-sucesso');
            btn.innerText = 'ENVIAR';
            btn.disabled = false;
        }
    });
}