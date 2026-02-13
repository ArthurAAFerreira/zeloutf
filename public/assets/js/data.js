// public/assets/js/data.js

// 1. Definição das Áreas (Ambientes) dentro de cada bloco
const AMBIENTES_PADRAO = [
    { nome: 'Salas de Aula / Lab', icone: 'meeting_room' },
    { nome: 'Circulação / Corredor', icone: 'directions_walk' },
    { nome: 'Sanitários', icone: 'wc' },
    { nome: 'Área Externa', icone: 'nature_people' }
];

// 2. Estrutura Inteligente: Câmpus -> Sedes -> Blocos
const DADOS_UNIDADES = {
    'ct': {
        nome: 'Curitiba',
        temSedes: true,
        sedes: {
            'centro': {
                nome: 'Sede Centro',
                blocos: [
                    'Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Bloco E', 'Bloco F',
                    'Bloco G', 'Bloco H', 'Bloco I', 'Bloco J', 'Bloco K', 'Bloco L',
                    'Bloco M', 'Bloco N', 'Bloco O', 'Bloco P', 'Bloco Q', 'Bloco R',
                    'Bloco S', 'Bloco T', 'Bloco U', 'Bloco V',
                    'Áreas de Acesso', 'Área de Circulação'
                ]
            },
            'neoville': {
                nome: 'Sede Neoville',
                blocos: [
                    'Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Bloco E', 'Bloco F',
                    'Bloco G', 'Bloco H', 'Bloco J', 'Bloco K', 'Bloco L', 'Bloco M',
                    'Bloco N', 'Bloco O', 'Bloco P', 'Bloco Q', 'Bloco R', 'Bloco Z',
                    'Áreas de Acesso', 'Área de Circulação'
                ]
            },
            'ecoville': {
                nome: 'Sede Ecoville',
                blocos: [
                    'Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Bloco E', 'Bloco F',
                    'Bloco I', 'Bloco J', 'Bloco K', 'Bloco L', 'Bloco M', 'Bloco N',
                    'Áreas de Acesso', 'Área de Circulação'
                ]
            }
        }
    },
    'ld': {
        nome: 'Londrina',
        temSedes: false,
        blocos: [
            'Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Bloco E', 'Bloco F', 'Bloco G',
            'Áreas de Acesso', 'Área de Circulação'
        ]
    }
};

// 3. Categorias e Subcategorias (Atualizado com a sua nova estrutura)
const CATEGORIAS = {
    'estrutura': {
        nome: 'Estrutura',
        icone: 'apartment',
        itens: [
            'Iluminação',
            'Pintura e Acabamento',
            'Elétrica',
            'Áreas Verdes',
            'Acessibilidade',
            'Climatização (Ar/Ventilação)',
            'Elevadores',
            'Extintores e Mangueiras',
            'Portas, Janelas, Vidros, etc'
        ]
    },
    'servicos': {
        nome: 'Serviços',
        icone: 'engineering',
        itens: [
            'Vigilância e Segurança',
            'Limpeza',
            'Motorista e Transporte',
            'Capina e Jardinagem',
            'Sinalização',
            'Rede e Internet',
            'Acadêmico e de Apoio',
            'Restaurante Universitário',
            'Portaria',
            'Outros Serviços'
        ]
    },
    'bens': {
        nome: 'Bens em Geral',
        icone: 'chair_alt',
        itens: [
            'Dano ou Quebra',
            'Problema e Forma de Utilização',
            'Melhorias',
            'Falta de bens',
            'Demais Questões'
        ]
    }
};