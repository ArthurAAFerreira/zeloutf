// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://jkmftolpmchsnxsjxoji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbWZ0b2xwbWNoc254c2p4b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5MTUsImV4cCI6MjA4NjIzNjkxNX0.WifDxpU_xqWA4Rx-OKSoeGAvPr4RTFK2NpJqC7gc_0M';
const db = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// --- ESTADO GLOBAL ---
let estado = {
    campusId: null,      // ex: 'ct'
    campusNome: null,    // ex: 'Curitiba'
    sedeId: null,        // ex: 'centro'
    sedeNome: null,      // ex: 'Sede Centro'
    blocoNome: null,     // ex: 'Bloco A'
    ambienteNome: null,  // ex: 'Sanitários'
    categoriaId: null,   // ex: 'limpeza'
    categoriaNome: null, // ex: 'Limpeza'
    subcategoria: null,  // ex: 'Falta de Papel'
    tipoRelato: 'Reclamação',
    deviceId: null
};

document.addEventListener('DOMContentLoaded', () => {
    gerarDeviceId();
    iniciarApp();
    window.onpopstate = () => iniciarApp();
});

// --- CONTROLE DE TIPO (Reclamação vs Melhoria) ---
function selecionarTipo(tipo) {
    estado.tipoRelato = tipo;
    document.getElementById('btn-reclamacao').classList.toggle('selected', tipo === 'Reclamação');
    document.getElementById('btn-melhoria').classList.toggle('selected', tipo === 'Melhoria');

    // Recarrega a lista se já estivermos na tela final, pois o filtro de tipo mudou
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

            // Limpa a lista anterior para obrigar o usuário a clicar em "Ver Relatos"
            // ou carrega automaticamente se preferir: carregarRelatosExistentes();
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

// --- FILTRAGEM E EXIBIÇÃO DE RELATOS ---
async function carregarRelatosExistentes() {
    const container = document.getElementById('container-relatos-antigos');
    const btn = document.querySelector('.btn-ver-relatos');

    btn.innerText = "Carregando...";
    container.innerHTML = '';

    let query = db
        .from('ocorrencias')
        .select('*')
        .eq('status', 'pendente')
        .eq('unidade', estado.campusNome)
        .eq('bloco', estado.blocoNome)
        .eq('local', estado.ambienteNome)
        .eq('categoria_grupo', estado.categoriaNome)
        .order('reforcos', { ascending: false }) // Ordena pelos que tem mais likes primeiro
        .order('created_at', { ascending: false })
        .limit(15);

    if (estado.sedeNome) {
        query = query.eq('sede', estado.sedeNome);
    }

    const { data, error } = await query;
    btn.innerText = "📋 Atualizar Lista";

    if (error) {
        container.innerHTML = '<p style="color:red; text-align:center">Erro ao carregar lista.</p>';
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; margin-top:10px;">Nenhum relato pendente aqui.</p>';
        return;
    }

    data.forEach(relato => {
        const div = document.createElement('div');
        const classeTipo = relato.tipo ? relato.tipo.toLowerCase() : 'reclamação';
        const dataFormatada = new Date(relato.created_at).toLocaleDateString('pt-BR');
        const iconeTipo = relato.tipo === 'Melhoria' ? '💡' : '⚠';

        // Quantidade de likes (se for nulo, é 0)
        const qtdReforcos = relato.reforcos || 0;

        div.className = `relato-item ${classeTipo}`;
        div.innerHTML = `
            <div class="relato-header">
                <span>${dataFormatada}</span>
                <strong>${iconeTipo} ${relato.tipo || 'Relato'}</strong>
            </div>
            <div style="font-weight:bold; margin-bottom:4px;">${relato.problema}</div>
            <div style="font-size: 0.9em; color: #555;">${relato.descricao_detalhada || ''}</div>
            ${relato.ambiente ? `<small style="display:block; margin-top:5px; color:#888;">Local exato: ${relato.ambiente}</small>` : ''}
            
            <div class="acoes-relato">
                <button class="btn-acao reforco" onclick="reforcarRelato('${relato.id}', ${qtdReforcos})">
                    👍 Reforçar (${qtdReforcos})
                </button>
                <button class="btn-acao resolver" onclick="resolverRelato('${relato.id}')">
                    ✅ Resolvido
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

// --- FUNÇÃO: DAR LIKE / REFORÇAR ---
window.reforcarRelato = async function(idRelato, reforcosAtuais) {
    // Verificação simples usando localStorage para evitar que o cara clique 50 vezes
    const storageKey = `upvote_${idRelato}`;
    if (localStorage.getItem(storageKey)) {
        alert("Você já reforçou este relato!");
        return;
    }

    if(!db) return;

    // Atualiza no banco: soma +1 no valor atual
    const { error } = await db
        .from('ocorrencias')
        .update({ reforcos: reforcosAtuais + 1 })
        .eq('id', idRelato);

    if (error) {
        alert("Erro ao reforçar: " + error.message);
    } else {
        localStorage.setItem(storageKey, 'true'); // Marca que este dispositivo já votou
        carregarRelatosExistentes(); // Recarrega a lista para mostrar o novo número
    }
}

// --- FUNÇÃO: MARCAR COMO RESOLVIDO ---
window.resolverRelato = async function(idRelato) {
    const input = prompt("Para marcar como resolvido, digite a SENHA MESTRE ou o seu E-MAIL INSTITUCIONAL (@utfpr.edu.br):");

    if (!input) return; // Cancelou

    let resolvido_por = '';

    // 1. Verifica Senha Mestre (Troque 'senha123' pela senha que você quiser)
    if (input === 'senha123') {
        resolvido_por = 'Admin ZeloUTF';
    }
    // 2. Verifica E-mail válido
    else if (input.includes('@') && (input.endsWith('.edu.br') || input.endsWith('.gov.br'))) {
        resolvido_por = input.trim();
        alert(`Obrigado! A resolução será registrada no e-mail: ${resolvido_por}`);
    }
    // 3. Falhou
    else {
        alert("Acesso Negado: Senha incorreta ou e-mail inválido. Use um e-mail institucional.");
        return;
    }

    if(!db) return;

    const { error } = await db
        .from('ocorrencias')
        .update({
            status: 'resolvido',
            resolvido_por: resolvido_por,
            resolvido_em: new Date().toISOString()
        })
        .eq('id', idRelato);

    if (error) {
        alert("Erro ao atualizar: " + error.message);
    } else {
        alert("Sucesso! O problema foi marcado como resolvido e retirado da lista.");
        carregarRelatosExistentes(); // Recarrega a lista
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

// --- ENVIO DO FORMULÁRIO (Salvando nas colunas novas) ---
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

        let fotoUrl = null;
        if (inputFoto.files.length > 0) {
            btn.innerText = 'Enviando foto...';
            fotoUrl = await uploadFoto(inputFoto.files[0]);
        }

        // SALVANDO CADA DADO EM SUA COLUNA
        const dados = {
            device_id: estado.deviceId,
            tipo: estado.tipoRelato,          // Reclamação ou Melhoria
            status: 'pendente',

            // Colunas Granulares (O Segredo do Filtro)
            unidade: estado.campusNome,       // Curitiba
            sede: estado.sedeNome,            // Sede Centro
            bloco: estado.blocoNome,          // Bloco A
            local: estado.ambienteNome,       // Sanitários
            categoria_grupo: estado.categoriaNome, // Limpeza
            problema: estado.subcategoria,    // Falta de Papel

            // Campos descritivos extras
            ambiente: complemento,            // Sala 104 (campo legado, mas útil)
            descricao_detalhada: descricaoExtra,
            foto_url: fotoUrl,

            // Mantendo a descrição antiga por segurança (backward compatibility)
            descricao: `${estado.subcategoria} em ${estado.ambienteNome} - ${estado.blocoNome}`
        };

        const { error } = await db.from('ocorrencias').insert([dados]);

        if (error) {
            alert('Erro: ' + error.message);
            btn.disabled = false;
            btn.innerText = 'Tentar Novamente';
        } else {
            mudarTela('step-sucesso');
            btn.disabled = false;
            btn.innerText = 'ENVIAR RELATO';
        }
    });
}

function gerarDeviceId() {
    let id = localStorage.getItem('zelo_device_id');
    if (!id) { id = Math.random().toString(36).substring(2, 9); localStorage.setItem('zelo_device_id', id); }
    estado.deviceId = id;
}