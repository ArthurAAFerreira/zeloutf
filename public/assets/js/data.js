// public/assets/js/data.js

const CAMPI = {
    'ct': { nome: 'Curitiba (Sede)', id: 'ct' },
    'ld': { nome: 'Londrina', id: 'ld' },
    'cp': { nome: 'Cornélio Procópio', id: 'cp' },
    'pg': { nome: 'Ponta Grossa', id: 'pg' },
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