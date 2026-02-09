// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://jkmftolpmchsnxsjxoji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbWZ0b2xwbWNoc254c2p4b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5MTUsImV4cCI6MjA4NjIzNjkxNX0.WifDxpU_xqWA4Rx-OKSoeGAvPr4RTFK2NpJqC7gc_0M';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- ESTADO DO APP ---
let estado = {
    campus: null,
    bloco: null,
    categoria: null,
    subcategoria: null, // Armazena a subcategoria selecionada
    deviceId: null
};

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    identificarCampus();
    gerarDeviceId();
    carregarBlocos();
});

// 1. Identifica Câmpus pelo Subdomínio (ex: ct.zelo...)
function identificarCampus() {
    const host = window.location.hostname; // Pega 'ct.zelo.arthuraaferreira...'
    const slug = host.split('.')[0]; // Pega a primeira parte 'ct'

    // Se estiver rodando local ou IP, usa default
    // Importante: No data.js, verifique se CAMPI tem as chaves 'ct', 'ld', etc.
    const campusInfo = (typeof CAMPI !== 'undefined' && CAMPI[slug]) ? CAMPI[slug] : { nome: 'Campus Padrão (Local)', id: 'default' };

    estado.campus = campusInfo;
    const campusTitle = document.getElementById('campus-name');
    if(campusTitle) campusTitle.innerText = `UTFPR - ${campusInfo.nome}`;
}

// 2. Gera ID único do dispositivo (Sem login)
function gerarDeviceId() {
    let id = localStorage.getItem('zelo_device_id');
    if (!id) {
        id = crypto.randomUUID().split('-')[0]; // Pega só o começo pra ficar curto
        localStorage.setItem('zelo_device_id', id);
    }
    estado.deviceId = id;
    const badge = document.getElementById('user-badge');
    if(badge) badge.innerHTML = `<small>ID: ${id}</small>`;
}

// 3. Renderiza os Blocos na tela
function carregarBlocos() {
    const container = document.getElementById('lista-blocos');
    if(!container) return;
    container.innerHTML = '';

    // BLOCOS deve vir do data.js
    if(typeof BLOCOS !== 'undefined') {
        BLOCOS.forEach(bloco => {
            const btn = document.createElement('button');
            btn.className = 'card-btn';
            btn.innerHTML = `<span class="material-icons-round">${bloco.icone}</span> <span>${bloco.nome}</span>`;
            btn.onclick = () => selecionarBloco(bloco);
            container.appendChild(btn);
        });
    }
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

    if(typeof CATEGORIAS !== 'undefined') {
        for (const key in CATEGORIAS) {
            const cat = CATEGORIAS[key];
            const btn = document.createElement('button');
            btn.className = 'card-btn';
            btn.innerHTML = `<span class="material-icons-round">${cat.icone}</span> <span>${cat.nome}</span>`;
            // Passamos o objeto 'cat' inteiro e a chave 'key'
            btn.onclick = () => selecionarCategoria(key, cat);
            container.appendChild(btn);
        }
    }
}

function selecionarCategoria(key, categoriaObjeto) {
    // Salva o objeto categoria completo no estado
    estado.categoria = categoriaObjeto;

    mudarTela('step-categoria', 'step-detalhes');

    // Preenche o Select de subcategorias
    const select = document.getElementById('input-subcategoria');
    if(select) {
        select.innerHTML = '';
        // Adiciona uma opção padrão
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

        // Atualiza estado quando o usuário muda o select
        select.onchange = (e) => { estado.subcategoria = e.target.value; };
    }
}

function mudarTela(atual, proxima) {
    const elAtual = document.getElementById(atual);
    const elProx = document.getElementById(proxima);

    if(elAtual && elProx) {
        elAtual.classList.remove('active');
        elAtual.classList.add('hidden');

        elProx.classList.remove('hidden');
        elProx.classList.add('active');
    }
}

// Função global para o botão voltar HTML chamar
window.voltar = function(telaAlvo) {
    document.querySelectorAll('.step').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active');
    });
    const alvo = document.getElementById(telaAlvo);
    if(alvo) {
        alvo.classList.remove('hidden');
        alvo.classList.add('active');
    }
}

// --- ENVIO AO SUPABASE ---
const form = document.getElementById('form-report');
if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const subcategoriaInput = document.getElementById('input-subcategoria');
        const complementoInput = document.getElementById('input-ambiente');
        const btn = document.querySelector('.btn-enviar');

        // Validação simples
        if(!subcategoriaInput.value) {
            alert("Por favor, selecione qual é o problema específico.");
            return;
        }

        btn.innerText = 'Enviando...';
        btn.disabled = true;

        // Monta o objeto para salvar
        // Atenção: As colunas aqui DEVEM existir no Supabase
        const dados = {
            device_id: estado.deviceId,
            // campus_id: estado.campus.id, // (Comentado até criar tabela campi)
            // bloco_id: estado.bloco.id, // (Se usar ID relacional)

            // Usando TEXTO direto para o MVP simplificado:
            ambiente: complementoInput.value || "Não informado",
            categoria: estado.categoria.nome, // Ex: "Limpeza"
            descricao: `${subcategoriaInput.value} - ${estado.bloco.nome}`, // Ex: "Sem Papel - Bloco A"
            status: 'pendente'
        };

        console.log("Tentando enviar:", dados);

        // INSERÇÃO NO SUPABASE
        const { error } = await supabase
            .from('ocorrencias') // Nome da tabela
            .insert([dados]);

        if (error) {
            console.error(error);
            alert('Erro ao enviar: ' + error.message);
            btn.innerText = 'Tentar Novamente';
            btn.disabled = false;
        } else {
            mudarTela('step-detalhes', 'step-sucesso');
            // Reseta botão para próximo uso
            btn.innerText = 'ENVIAR RELATO';
            btn.disabled = false;
        }
    });
}