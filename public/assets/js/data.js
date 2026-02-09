// Configuração dos Câmpus (Simulando banco de dados local)
const CAMPI = {
    'ct': { nome: 'Curitiba (Sede)', id: 'curitiba-uuid' },
    'ld': { nome: 'Londrina', id: 'londrina-uuid' },
    'cp': { nome: 'Cornélio Procópio', id: 'cornelio-uuid' },
    'default': { nome: 'Selecione o Câmpus', id: null }
};

// Blocos (Genérico para MVP)
const BLOCOS = [
    { id: 'A', nome: 'Bloco A', icone: 'school' },
    { id: 'B', nome: 'Bloco B', icone: 'science' },
    { id: 'C', nome: 'Bloco C', icone: 'menu_book' },
    { id: 'GIN', nome: 'Ginásio', icone: 'sports_basketball' },
    { id: 'EXT', nome: 'Área Externa', icone: 'park' }
];

// Categorias e Problemas
const CATEGORIAS = {
    'limpeza': { nome: 'Limpeza', icone: 'cleaning_services', itens: ['Sem Papel', 'Lixo Cheio', 'Chão Sujo', 'Vaso Entupido'] },
    'eletrica': { nome: 'Elétrica', icone: 'lightbulb', itens: ['Lâmpada Queimada', 'Tomada sem Energia', 'Fio Solto'] },
    'clima': { nome: 'Climatização', icone: 'ac_unit', itens: ['Ar não gela', 'Pingando', 'Barulhento'] },
    'agua': { nome: 'Hidráulica', icone: 'water_drop', itens: ['Torneira Vazando', 'Sem Água', 'Bebedouro Quente'] },
    'moveis': { nome: 'Mobiliário', icone: 'chair', itens: ['Cadeira Quebrada', 'Mesa Quebrada', 'Quadro Manchado'] }
};