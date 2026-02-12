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
        temSedes: true, // Curitiba tem subdivisão (Centro, Neoville, Ecoville)
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
        temSedes: false, // Londrina não tem sedes, vai direto aos blocos
        blocos: [
            'Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Bloco E', 'Bloco F', 'Bloco G',
            'Áreas de Acesso', 'Área de Circulação'
        ]
    }
};

// 3. Categorias de Problemas (Mantive as suas e adicionei TI/Computadores que é útil)
const CATEGORIAS = {
    'limpeza': {
        nome: 'Limpeza',
        icone: 'cleaning_services',
        itens: ['Chão Sujo', 'Lixo Cheio', 'Derramamento', 'Mau Cheiro', 'Falta de Papel/Sabão']
    },
    'manutencao': {
        nome: 'Manutenção',
        icone: 'build',
        itens: ['Lâmpada Queimada', 'Tomada com Defeito', 'Porta Quebrada', 'Vazamento', 'Ar Condicionado', 'Lousa/Quadro']
    },
    'seguranca': {
        nome: 'Segurança',
        icone: 'security',
        itens: ['Porta Aberta Indevida', 'Extintor Vencido', 'Local Escuro', 'Fios Expostos']
    },
    'ti': {
        nome: 'Computadores/TI',
        icone: 'computer',
        itens: ['Computador não liga', 'Sem Internet', 'Projetor com defeito', 'Mouse/Teclado']
    }
};