// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://jkmftolpmchsnxsjxoji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbWZ0b2xwbWNoc254c2p4b2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5MTUsImV4cCI6MjA4NjIzNjkxNX0.WifDxpU_xqWA4Rx-OKSoeGAvPr4RTFK2NpJqC7gc_0M';
const db = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// --- ESTADO GLOBAL ---
let estado = { campusId: null, campusNome: null, sedeId: null, sedeNome: null, blocoNome: null, ambienteNome: null, categoriaId: null, categoriaNome: null, subcategoria: null, tipoRelato: 'Reclamação', deviceId: null, adminLogado: null };

document.addEventListener('DOMContentLoaded', () => {
    gerarDeviceId();
    iniciarApp();
    window.onpopstate = () => iniciarApp();
});

window.selecionarTipo = function(tipo) {
    estado.tipoRelato = tipo;
    document.getElementById('btn-reclamacao').classList.toggle('selected', tipo === 'Reclamação');
    document.getElementById('btn-melhoria').classList.toggle('selected', tipo === 'Melhoria');
    const listaContainer = document.getElementById('container-relatos-antigos');
    if (listaContainer.innerHTML !== '') carregarRelatosExistentes();
}

function iniciarApp() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('c');
    if (code && DADOS_UNIDADES[code]) {
        estado.campusId = code; const campus = DADOS_UNIDADES[code]; estado.campusNome = campus.nome;
        document.getElementById('campus-name').innerText = `UTFPR - ${campus.nome}`;
        if (campus.temSedes) { renderizarSedes(campus.sedes); mudarTela('step-sede'); }
        else { renderizarBlocos(campus.blocos); mudarTela('step-bloco'); }
    } else {
        document.getElementById('campus-name').innerText = "ZeloUTF";
        renderizarListaCampus(); mudarTela('step-campus');
    }
}

function renderizarListaCampus() {
    const container = document.getElementById('lista-campus'); container.innerHTML = '';
    for (const key in DADOS_UNIDADES) {
        criarBotao(container, 'location_on', DADOS_UNIDADES[key].nome, () => {
            history.pushState({id: key}, '', window.location.pathname + '?c=' + key); iniciarApp();
        });
    }
}

function renderizarSedes(sedes) {
    const container = document.getElementById('lista-sedes'); container.innerHTML = '';
    for (const key in sedes) {
        criarBotao(container, 'business', sedes[key].nome, () => {
            estado.sedeId = key; estado.sedeNome = sedes[key].nome;
            renderizarBlocos(sedes[key].blocos); mudarTela('step-bloco');
        });
    }
}

// Renderiza Blocos (Injetando o 'Geral')
function renderizarBlocos(listaBlocos) {
    const container = document.getElementById('lista-blocos'); container.innerHTML = '';

    // Garante que "Geral" seja o primeiro da lista
    let blocosFinais = [...listaBlocos];
    if (!blocosFinais.includes('Geral')) blocosFinais.unshift('Geral');

    blocosFinais.forEach(blocoNome => {
        const isGeral = (blocoNome === 'Geral');
        const btn = document.createElement('button');
        btn.className = isGeral ? 'card-btn geral' : 'card-btn';
        btn.innerHTML = `<span class="material-icons-round">${isGeral ? 'public' : 'domain'}</span> <span>${blocoNome}</span>`;
        btn.onclick = () => {
            estado.blocoNome = blocoNome;
            document.getElementById('titulo-bloco-selecionado').innerText = `Onde no ${blocoNome}?`;
            renderizarAmbientes();
            verificarAvisosComunidade(blocoNome); // Verifica validações pendentes
            mudarTela('step-ambiente');
        };
        container.appendChild(btn);
    });
}

function renderizarAmbientes() {
    const container = document.getElementById('lista-ambientes'); container.innerHTML = '';
    AMBIENTES_PADRAO.forEach(amb => {
        criarBotao(container, amb.icone, amb.nome, () => {
            estado.ambienteNome = amb.nome; renderizarCategorias(); mudarTela('step-categoria');
        });
    });
}

function renderizarCategorias() {
    const container = document.getElementById('lista-categorias'); container.innerHTML = '';
    for (const key in CATEGORIAS) {
        criarBotao(container, CATEGORIAS[key].icone, CATEGORIAS[key].nome, () => {
            estado.categoriaId = key; estado.categoriaNome = CATEGORIAS[key].nome;
            preencherDetalhes(CATEGORIAS[key]); mudarTela('step-detalhes');
            document.getElementById('container-relatos-antigos').innerHTML = '';
            document.getElementById('container-relatos-resolvidos').innerHTML = '';
        });
    }
}

function preencherDetalhes(cat) {
    const select = document.getElementById('input-subcategoria'); select.innerHTML = '<option value="">Selecione o problema...</option>';
    cat.itens.forEach(item => {
        const opt = document.createElement('option'); opt.value = item; opt.innerText = item; select.appendChild(opt);
    });
    select.onchange = (e) => estado.subcategoria = e.target.value;
}

function criarBotao(container, icone, texto, onClick) {
    const btn = document.createElement('button'); btn.className = 'card-btn';
    btn.innerHTML = `<span class="material-icons-round">${icone}</span> <span>${texto}</span>`;
    btn.onclick = onClick; container.appendChild(btn);
}

window.mudarTela = function(id) {
    document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

window.voltar = function(stepDestino) {
    if (stepDestino === 'step-sede') {
        if (!DADOS_UNIDADES[estado.campusId].temSedes) { history.pushState({}, '', window.location.pathname); iniciarApp(); return; }
    }
    if (stepDestino === 'step-campus') { history.pushState({}, '', window.location.pathname); iniciarApp(); }
    else { mudarTela(stepDestino); }
};

// --- BUSCA POR ID ---
window.buscarRelato = async function() {
    const idCurto = document.getElementById('input-busca-id').value;
    if(!idCurto) return;
    const btn = event.target; btn.innerText = "...";

    const {data, error} = await db.from('ocorrencias').select('*').eq('id_curto', idCurto).single();
    btn.innerText = "Buscar";

    if(error || !data) { alert("Relato não encontrado!"); return; }

    const dadosJson = encodeURIComponent(JSON.stringify(data));
    if (data.status === 'resolvido') window.abrirModalDetalhes(dadosJson);
    else window.abrirModalAdmin(dadosJson);
}

// --- VALIDAÇÃO DA COMUNIDADE (Oculto no Bloco) ---
async function verificarAvisosComunidade(blocoAtual) {
    const area = document.getElementById('area-validacao-comunidade');
    const container = document.getElementById('lista-validacao-comunidade');
    area.classList.add('hidden'); container.innerHTML = '';

    let query = db.from('ocorrencias').select('*')
        .eq('comunidade_sugere_conclusao', true)
        .neq('status', 'resolvido')
        .eq('unidade', estado.campusNome)
        .eq('bloco', blocoAtual);
    if(estado.sedeNome) query = query.eq('sede', estado.sedeNome);

    const {data, error} = await query;
    if(data && data.length > 0) {
        area.classList.remove('hidden');
        data.forEach(r => {
            const div = document.createElement('div');
            div.className = 'relato-item';
            div.style.cursor = 'pointer';
            div.innerHTML = `<strong>#${r.id_curto}</strong> - ${r.problema} <br><small>Requer validação admin</small>`;
            div.onclick = () => window.abrirModalAdmin(encodeURIComponent(JSON.stringify(r)));
            container.appendChild(div);
        });
    }
}

// --- FILTRAGEM DE RELATOS E EXIBIÇÃO ---
window.carregarRelatosExistentes = async function() {
    const containerAbertos = document.getElementById('container-relatos-antigos');
    const containerResolvidos = document.getElementById('container-relatos-resolvidos');
    const btn = document.querySelector('.btn-ver-relatos');

    btn.innerText = "Carregando...";
    containerAbertos.innerHTML = ''; containerResolvidos.innerHTML = '';

    // Abertos = Pendente OR Em Verificação
    let queryAbertos = db.from('ocorrencias').select('*')
        .in('status', ['pendente', 'em_verificacao'])
        .eq('unidade', estado.campusNome).eq('bloco', estado.blocoNome)
        .eq('local', estado.ambienteNome).eq('categoria_grupo', estado.categoriaNome)
        .order('reforcos', { ascending: false }).order('created_at', { ascending: false }).limit(15);
    if (estado.sedeNome) queryAbertos = queryAbertos.eq('sede', estado.sedeNome);

    const seteDiasAtras = new Date(); seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    let queryResolvidos = db.from('ocorrencias').select('*')
        .eq('status', 'resolvido').gte('resolvido_em', seteDiasAtras.toISOString())
        .eq('unidade', estado.campusNome).eq('bloco', estado.blocoNome)
        .eq('local', estado.ambienteNome).eq('categoria_grupo', estado.categoriaNome)
        .order('resolvido_em', { ascending: false }).limit(10);
    if (estado.sedeNome) queryResolvidos = queryResolvidos.eq('sede', estado.sedeNome);

    const [resAbertos, resResolvidos] = await Promise.all([queryAbertos, queryResolvidos]);
    btn.innerText = "📋 Relatos Abertos neste Local";

    if (resAbertos.data && resAbertos.data.length > 0) {
        resAbertos.data.forEach(r => containerAbertos.appendChild(criarCardAberto(r)));
    } else { containerAbertos.innerHTML = '<p style="text-align:center; color:#999;">Nenhum relato aberto aqui.</p>'; }

    if (resResolvidos.data && resResolvidos.data.length > 0) {
        resResolvidos.data.forEach(r => containerResolvidos.appendChild(criarCardResolvido(r)));
    } else { containerResolvidos.innerHTML = '<p style="text-align:center; font-size: 0.8rem; color:#ccc;">Nenhum relato recente concluído.</p>'; }
}

function criarCardAberto(relato) {
    const div = document.createElement('div');
    const isVerificacao = relato.status === 'em_verificacao';
    const classeTipo = relato.tipo ? relato.tipo.toLowerCase() : 'reclamação';
    div.className = `relato-item ${classeTipo} ${isVerificacao ? 'verificacao' : ''}`;

    const dadosJson = encodeURIComponent(JSON.stringify(relato));
    const dataCriacao = new Date(relato.created_at).toLocaleDateString('pt-BR');
    const qtdReforcos = relato.reforcos || 0;

    let imgHtml = relato.foto_url ? `<img src="${relato.foto_url}" class="foto-miniatura" onclick="window.open('${relato.foto_url}', '_blank')">` : '';

    div.innerHTML = `
        ${isVerificacao ? `<div class="badge-verificacao">🔵 Em Verificação (Equipe ciente)</div>` : ''}
        <div class="relato-header">
            <span>${dataCriacao} <span class="relato-id">#${relato.id_curto || ''}</span></span>
            <strong>${relato.tipo === 'Melhoria' ? '💡 Sugestão' : '⚠ Fato'}</strong>
        </div>
        <div style="font-weight:bold; margin-bottom:4px;">${relato.problema}</div>
        <div style="font-size: 0.9em; color: #555;">${relato.descricao_detalhada || ''}</div>
        ${relato.ambiente ? `<small style="display:block; margin-top:5px; color:#888;">Local: ${relato.ambiente}</small>` : ''}
        ${imgHtml}
        <div class="acoes-linha-1">
            <button class="btn-acao reforco" onclick="reforcarRelato('${relato.id}', ${qtdReforcos})">👍 Reforçar (${qtdReforcos})</button>
            <button class="btn-acao gerenciar" onclick="abrirModalAdmin('${dadosJson}')">⚙️ Gerenciar</button>
        </div>
        <div class="acoes-linha-2">
            <button class="btn-acao informar" onclick="abrirModalComunidade('${relato.id}')">📢 Informar Conclusão</button>
        </div>
    `;
    return div;
}

function criarCardResolvido(relato) {
    const div = document.createElement('div');
    div.className = 'relato-item resolvido';
    const dadosJson = encodeURIComponent(JSON.stringify(relato));
    const dataConclusao = new Date(relato.resolvido_em).toLocaleDateString('pt-BR');

    div.innerHTML = `
        <div class="relato-header"><span>#${relato.id_curto || ''} - Encerrado em ${dataConclusao}</span></div>
        <div style="font-weight:bold;">${relato.problema}</div>
        <button class="btn-acao" style="margin-top:10px; width:100%;" onclick="abrirModalDetalhes('${dadosJson}')">Ver Detalhes</button>
    `;
    return div;
}

window.reforcarRelato = async function(idRelato, reforcosAtuais) {
    const key = `upvote_${idRelato}`;
    if (localStorage.getItem(key)) { alert("Você já reforçou este relato!"); return; }
    const { error } = await db.from('ocorrencias').update({ reforcos: reforcosAtuais + 1, ultimo_reforco_em: new Date().toISOString() }).eq('id', idRelato);
    if (!error) { localStorage.setItem(key, 'true'); carregarRelatosExistentes(); }
}

// --- MODAL: INFORMAR COMUNIDADE ---
window.abrirModalComunidade = function(id) {
    document.getElementById('com-id').value = id;
    document.getElementById('com-email').value = ''; document.getElementById('com-desc').value = ''; document.getElementById('com-foto').value = '';
    document.getElementById('modal-comunidade').classList.remove('hidden');
}
window.fecharModalComunidade = function() { document.getElementById('modal-comunidade').classList.add('hidden'); }

window.enviarResolucaoComunidade = async function() {
    const id = document.getElementById('com-id').value;
    const email = document.getElementById('com-email').value.trim();
    const desc = document.getElementById('com-desc').value;
    const inputFoto = document.getElementById('com-foto');
    const btn = document.querySelector('#modal-comunidade .btn-enviar');

    if(!email.includes('@utfpr.edu.br') && !email.includes('@alunos.utfpr.edu.br')) { alert("Use e-mail UTFPR válido."); return; }

    btn.innerText = "Enviando..."; btn.disabled = true;
    let fotoUrl = null;
    if (inputFoto.files.length > 0) fotoUrl = await uploadFoto(inputFoto.files[0]);

    const { error } = await db.from('ocorrencias').update({
        comunidade_sugere_conclusao: true,
        comunidade_email: email, comunidade_descricao: desc, comunidade_foto_url: fotoUrl
    }).eq('id', id);

    if (error) { alert("Erro: " + error.message); }
    else { alert("Obrigado! A administração verificará sua informação."); fecharModalComunidade(); }
    btn.innerText = "ENVIAR INFORMAÇÃO"; btn.disabled = false;
}

// --- MODAL: ADMIN ---
window.abrirModalAdmin = function(dadosUrlCoded) {
    const senha = prompt("Digite a Senha Mestre:");
    if (!senha) return;
    if (typeof SENHAS_MESTRE === 'undefined') { alert("Erro de senhas."); return; }
    const admin = SENHAS_MESTRE[senha];
    if (!admin) { alert("Senha incorreta!"); return; }

    const r = JSON.parse(decodeURIComponent(dadosUrlCoded));

    document.getElementById('admin-uuid').value = r.id;
    document.getElementById('admin-id-relato').innerText = r.id_curto ? `#${r.id_curto}` : '';
    document.getElementById('admin-criado').innerText = new Date(r.created_at).toLocaleString('pt-BR');
    document.getElementById('admin-reforco').innerText = r.ultimo_reforco_em ? new Date(r.ultimo_reforco_em).toLocaleDateString('pt-BR') : 'Nunca';
    document.getElementById('admin-qtd-reforco').innerText = r.reforcos || 0;
    document.getElementById('admin-local').innerText = `${r.bloco} - ${r.ambiente}`;
    document.getElementById('admin-problema').innerText = r.problema;
    document.getElementById('admin-descricao').innerText = r.descricao_detalhada || '';

    // Foto original
    document.getElementById('admin-area-foto-original').innerHTML = r.foto_url ? `<a href="${r.foto_url}" target="_blank">🖼️ Ver Foto Original anexada</a>` : '';

    // Alerta Comunidade
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

    estado.adminLogado = admin;
    document.getElementById('modal-admin').classList.remove('hidden');
}
window.fecharModalAdmin = function() { document.getElementById('modal-admin').classList.add('hidden'); }

window.salvarGerenciamento = async function() {
    const id = document.getElementById('admin-uuid').value;
    const comp = document.getElementById('admin-complemento').value;
    const status = document.getElementById('admin-status').value;
    const inputFoto = document.getElementById('admin-foto');
    const btn = document.querySelector('#modal-admin .btn-enviar');

    btn.innerText = "Salvando..."; btn.disabled = true;

    let dadosUpdate = { complemento_admin: comp, gerenciado_por: estado.adminLogado, status: status };

    if (inputFoto.files.length > 0) dadosUpdate.foto_conclusao_url = await uploadFoto(inputFoto.files[0]);

    // Se marcou resolvido, anota a data e limpa a flag da comunidade
    if (status === 'resolvido') {
        dadosUpdate.resolvido_em = new Date().toISOString();
        dadosUpdate.comunidade_sugere_conclusao = false;
    }

    const { error } = await db.from('ocorrencias').update(dadosUpdate).eq('id', id);

    if (error) { alert("Erro: " + error.message); }
    else { alert("Salvo!"); fecharModalAdmin(); carregarRelatosExistentes(); }
    btn.innerText = "💾 SALVAR ALTERAÇÕES"; btn.disabled = false;
}

// --- MODAL: DETALHES LEITURA ---
window.abrirModalDetalhes = function(dadosUrlCoded) {
    const r = JSON.parse(decodeURIComponent(dadosUrlCoded));
    document.getElementById('det-id-relato').innerText = `#${r.id_curto}`;

    let html = `
        <strong>Criado em:</strong> ${new Date(r.created_at).toLocaleString('pt-BR')} <br>
        <strong>Usuário:</strong> ${r.identificacao_usuario || 'Anônimo'} <br>
        <strong>Problema:</strong> ${r.problema} (${r.bloco} - ${r.ambiente}) <br>
        <strong>Descrição original:</strong> <em>${r.descricao_detalhada}</em> <br>
        <hr>
        <strong style="color:green;">Concluído em:</strong> ${r.resolvido_em ? new Date(r.resolvido_em).toLocaleString('pt-BR') : ''} <br>
        <strong>Encerrado por:</strong> ${r.gerenciado_por || 'Sistema'} <br>
        <strong>Anotação Admin:</strong> ${r.complemento_admin || '-'} <br>
    `;

    if(r.foto_url) html += `<br><a href="${r.foto_url}" target="_blank">🖼️ Foto Original</a>`;
    if(r.foto_conclusao_url) html += `<br><a href="${r.foto_conclusao_url}" target="_blank">🖼️ Foto da Conclusão</a>`;

    document.getElementById('det-conteudo').innerHTML = html;
    document.getElementById('modal-detalhes').classList.remove('hidden');
}
window.fecharModalDetalhes = function() { document.getElementById('modal-detalhes').classList.add('hidden'); }

// --- FUNÇÕES GERAIS ---
async function uploadFoto(arquivo) {
    const nome = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const { data, error } = await db.storage.from('fotos').upload(nome, arquivo);
    if (error) return null;
    return db.storage.from('fotos').getPublicUrl(nome).data.publicUrl;
}

const form = document.getElementById('form-report');
if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); const btn = document.querySelector('.btn-enviar');
        const comp = document.getElementById('input-complemento').value;
        const desc = document.getElementById('input-descricao').value;

        btn.innerText = 'Enviando...'; btn.disabled = true;
        let fotoUrl = null; if (document.getElementById('input-foto').files.length > 0) fotoUrl = await uploadFoto(document.getElementById('input-foto').files[0]);

        const dados = {
            device_id: estado.deviceId, tipo: estado.tipoRelato, status: 'pendente',
            unidade: estado.campusNome, sede: estado.sedeNome, bloco: estado.blocoNome, local: estado.ambienteNome,
            categoria_grupo: estado.categoriaNome, problema: estado.subcategoria, ambiente: comp, descricao_detalhada: desc,
            identificacao_usuario: document.getElementById('input-identidade').value, foto_url: fotoUrl,
            descricao: `${estado.subcategoria} - ${estado.blocoNome}`
        };

        const { error } = await db.from('ocorrencias').insert([dados]);
        if (error) { alert('Erro: ' + error.message); btn.disabled = false; btn.innerText = 'Tentar Novamente'; }
        else { mudarTela('step-sucesso'); btn.disabled = false; btn.innerText = 'ENVIAR RELATO'; }
    });
}
function gerarDeviceId() { let id = localStorage.getItem('zelo_device_id'); if (!id) { id = Math.random().toString(36).substring(2, 9); localStorage.setItem('zelo_device_id', id); } estado.deviceId = id; }