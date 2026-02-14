// public/assets/js/data.js

const AMBIENTES_PADRAO = [
    { nome: 'Salas de Aula / Lab', icone: 'meeting_room' },
    { nome: 'Circulação / Corredor', icone: 'directions_walk' },
    { nome: 'Sanitários', icone: 'wc' },
    { nome: 'Área Externa', icone: 'nature_people' }
];

// Matriz Completa dos Câmpus da UTFPR
const DADOS_UNIDADES = {
    'ct': {
        nome: 'Curitiba', temSedes: true,
        contato: 'Arthur Ferreira - arthurferreira@utfpr.edu.br',
        sedes: {
            'centro': { nome: 'Sede Centro', blocos: ['Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Bloco E', 'Bloco F', 'Bloco G', 'Bloco H', 'Bloco I', 'Bloco J', 'Bloco K', 'Bloco L', 'Bloco M', 'Bloco N', 'Bloco O', 'Bloco P', 'Bloco Q', 'Bloco R', 'Bloco S', 'Bloco T', 'Bloco U', 'Bloco V', 'Áreas de Acesso', 'Área de Circulação'] },
            'neoville': { nome: 'Sede Neoville', blocos: ['Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Bloco E', 'Bloco F', 'Bloco G', 'Bloco H', 'Bloco J', 'Bloco K', 'Bloco L', 'Bloco M', 'Bloco N', 'Bloco O', 'Bloco P', 'Bloco Q', 'Bloco R', 'Bloco Z', 'Áreas de Acesso', 'Área de Circulação'] },
            'ecoville': { nome: 'Sede Ecoville', blocos: ['Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Bloco E', 'Bloco F', 'Bloco I', 'Bloco J', 'Bloco K', 'Bloco L', 'Bloco M', 'Bloco N', 'Áreas de Acesso', 'Área de Circulação'] }
        }
    },
    'ld': {
        nome: 'Londrina', temSedes: false, contato: 'Manutenção Londrina - arthurferreira@utfpr.edu.br',
        blocos: ['Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Bloco E', 'Bloco F', 'Bloco G', 'Áreas de Acesso', 'Área de Circulação']
    },
    'ap': { nome: 'Apucarana', temSedes: false, contato: 'Manutenção Apucarana - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Bloco C', 'Áreas de Acesso', 'Área de Circulação'] },
    'cp': { nome: 'Cornélio Procópio', temSedes: false, contato: 'Manutenção CP - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Bloco C', 'Áreas de Acesso', 'Área de Circulação'] },
    'cm': { nome: 'Campo Mourão', temSedes: false, contato: 'Manutenção CM - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Áreas de Acesso', 'Área de Circulação'] },
    'dv': { nome: 'Dois Vizinhos', temSedes: false, contato: 'Manutenção DV - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Áreas de Acesso', 'Área de Circulação'] },
    'fb': { nome: 'Francisco Beltrão', temSedes: false, contato: 'Manutenção FB - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Áreas de Acesso', 'Área de Circulação'] },
    'gp': { nome: 'Guarapuava', temSedes: false, contato: 'Manutenção GP - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Áreas de Acesso', 'Área de Circulação'] },
    'md': { nome: 'Medianeira', temSedes: false, contato: 'Manutenção MD - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Áreas de Acesso', 'Área de Circulação'] },
    'pb': { nome: 'Pato Branco', temSedes: false, contato: 'Manutenção PB - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Áreas de Acesso', 'Área de Circulação'] },
    'pg': { nome: 'Ponta Grossa', temSedes: false, contato: 'Manutenção PG - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Áreas de Acesso', 'Área de Circulação'] },
    'sh': { nome: 'Santa Helena', temSedes: false, contato: 'Manutenção SH - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Áreas de Acesso', 'Área de Circulação'] },
    'td': { nome: 'Toledo', temSedes: false, contato: 'Manutenção TD - arthurferreira@utfpr.edu.br', blocos: ['Bloco A', 'Bloco B', 'Áreas de Acesso', 'Área de Circulação'] }
};

// Matriz Unificada de Problemas (Ideal para Análise de IA)
const CATEGORIAS = {
    'estrutura': {
        nome: 'Estrutura', icone: 'apartment',
        itens: ['Iluminação', 'Pintura e Acabamento', 'Elétrica', 'Áreas Verdes', 'Acessibilidade', 'Climatização (Ar/Ventilação)', 'Elevadores', 'Extintores e Mangueiras', 'Portas, Janelas, Vidros, etc']
    },
    'servicos': {
        nome: 'Serviços', icone: 'engineering',
        itens: ['Vigilância e Segurança', 'Limpeza', 'Motorista e Transporte', 'Capina e Jardinagem', 'Sinalização', 'Rede e Internet', 'Acadêmico e de Apoio', 'Restaurante Universitário', 'Portaria', 'Outros Serviços']
    },
    'bens': {
        nome: 'Bens em Geral', icone: 'chair_alt',
        itens: ['Dano ou Quebra', 'Problema e Forma de Utilização', 'Melhorias', 'Falta de bens', 'Demais Questões']
    }
};