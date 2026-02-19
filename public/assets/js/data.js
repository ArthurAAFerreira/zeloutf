// public/assets/js/data.js

// --- CONFIGURAÇÃO DE AMBIENTES E PROBLEMAS (HIERARQUIA INTELIGENTE) ---

// Definição dos problemas por Tipo de Ambiente
const PROBLEMAS_POR_AMBIENTE = {
    'sala_aula_lab': {
        nome: 'Salas de Aula / Laboratórios', icone: 'school',
        categorias: {
            'estrutura': ['Iluminação', 'Pintura e Acabamento', 'Elétrica', 'Acessibilidade', 'Climatização (Ar/Ventilação)', 'Extintores e Mangueiras', 'Portas, Janelas, Vidros, etc'],
            'servicos': ['Vigilância e Segurança', 'Limpeza', 'Motorista / Transporte', 'Sinalização', 'Rede e Internet', 'Apoio ou Acadêmico', 'Outros Serviços'],
            'bens': ['Dano ou Quebra', 'Problema e Forma de Utilização', 'Melhorias', 'Falta de bens', 'Demais Questões']
        }
    },
    'areas_adm': {
        nome: 'Áreas Gerais e Administrativas', icone: 'business_center',
        categorias: {
            'estrutura': ['Iluminação', 'Pintura e Acabamento', 'Elétrica', 'Áreas Verdes', 'Acessibilidade', 'Climatização (Ar/Ventilação)', 'Elevadores', 'Extintores e Mangueiras', 'Portas, Janelas, Vidros, etc'],
            'servicos': ['Vigilância e Segurança', 'Limpeza', 'Motorista / Transporte', 'Capina e Jardinagem', 'Sinalização', 'Rede e Internet', 'Apoio ou Acadêmico', 'Restaurante Universitário', 'Portaria', 'Outros Serviços'],
            'bens': ['Dano ou Quebra', 'Problema e Forma de Utilização', 'Melhorias', 'Falta de bens', 'Demais Questões']
        }
    },
    'circulacao': {
        nome: 'Circulação / Corredor', icone: 'directions_walk',
        categorias: {
            'estrutura': ['Iluminação', 'Pintura e Acabamento', 'Elétrica', 'Áreas Verdes', 'Acessibilidade', 'Climatização (Ar/Ventilação)', 'Elevadores', 'Extintores e Mangueiras', 'Portas, Janelas, Vidros, etc'],
            'servicos': ['Vigilância e Segurança', 'Limpeza', 'Capina e Jardinagem', 'Sinalização', 'Rede e Internet', 'Apoio ou Acadêmico', 'Outros Serviços'],
            'bens': ['Dano ou Quebra', 'Problema e Forma de Utilização', 'Melhorias', 'Falta de bens', 'Demais Questões']
        }
    },
    'sanitarios': {
        nome: 'Sanitários', icone: 'wc',
        categorias: {
            'estrutura': ['Iluminação', 'Pintura e Acabamento', 'Elétrica', 'Acessibilidade', 'Climatização (Ar/Ventilação)', 'Extintores e Mangueiras', 'Portas, Janelas, Vidros, etc'],
            'servicos': ['Vigilância e Segurança', 'Limpeza', 'Sinalização', 'Outros Serviços'],
            'bens': ['Dano ou Quebra', 'Problema e Forma de Utilização', 'Melhorias', 'Falta de bens', 'Demais Questões']
        }
    },
    'restaurante': { // Caso use no futuro
        nome: 'Restaurante / Copa', icone: 'restaurant',
        categorias: {
            'estrutura': ['Iluminação', 'Pintura e Acabamento', 'Elétrica', 'Áreas Verdes', 'Acessibilidade', 'Climatização (Ar/Ventilação)', 'Extintores e Mangueiras', 'Portas, Janelas, Vidros, etc'],
            'servicos': ['Vigilância e Segurança', 'Limpeza', 'Capina e Jardinagem', 'Sinalização', 'Rede e Internet', 'Apoio ou Acadêmico', 'Restaurante Universitário', 'Outros Serviços'],
            'bens': ['Dano ou Quebra', 'Problema e Forma de Utilização', 'Melhorias', 'Falta de bens', 'Demais Questões']
        }
    },
    'externa': {
        nome: 'Área Externa', icone: 'park',
        categorias: {
            'estrutura': ['Iluminação', 'Pintura e Acabamento', 'Elétrica', 'Áreas Verdes', 'Acessibilidade', 'Climatização (Ar/Ventilação)', 'Extintores e Mangueiras', 'Portas, Janelas, Vidros, etc'],
            'servicos': ['Vigilância e Segurança', 'Limpeza', 'Motorista e Transporte', 'Capina e Jardinagem', 'Sinalização', 'Rede e Internet', 'Apoio ou Acadêmico', 'Portaria', 'Outros Serviços'],
            'bens': ['Dano ou Quebra', 'Problema e Forma de Utilização', 'Melhorias', 'Falta de bens', 'Demais Questões']
        }
    }
};

// Lista padrão de ambientes para a maioria dos blocos (facilita a replicação)
const AMBIENTES_PADRAO_LISTA = ['sala_aula_lab', 'areas_adm', 'circulacao', 'sanitarios', 'externa'];

// --- ESTRUTURA DOS CÂMPUS ---
const DADOS_UNIDADES = {
    'ct': {
        nome: 'Curitiba', temSedes: true,
        contato: 'Arthur Ferreira - arthurferreira@utfpr.edu.br',
        sedes: {
            'centro': {
                nome: 'Sede Centro',
                blocos: { // Agora Blocos são Objetos para permitir ambientes personalizados
                    'Geral': AMBIENTES_PADRAO_LISTA,
                    'Bloco A': AMBIENTES_PADRAO_LISTA,
                    'Bloco B': AMBIENTES_PADRAO_LISTA,
                    'Bloco C': AMBIENTES_PADRAO_LISTA,
                    'Bloco D': AMBIENTES_PADRAO_LISTA,
                    'Bloco E': AMBIENTES_PADRAO_LISTA,
                    'Bloco F': AMBIENTES_PADRAO_LISTA,
                    'Bloco G': AMBIENTES_PADRAO_LISTA,
                    'Bloco H': AMBIENTES_PADRAO_LISTA,
                    'Bloco I': AMBIENTES_PADRAO_LISTA,
                    'Bloco J': AMBIENTES_PADRAO_LISTA,
                    'Bloco K': AMBIENTES_PADRAO_LISTA,
                    'Bloco L': AMBIENTES_PADRAO_LISTA,
                    'Bloco M - Restaurante Universitário': ['restaurante', 'circulacao', 'sanitarios', 'externa'], // Exemplo de personalização
                    'Bloco N': AMBIENTES_PADRAO_LISTA,
                    'Bloco O - Ginásio': ['areas_adm', 'circulacao', 'sanitarios', 'externa'],
                    'Bloco P': AMBIENTES_PADRAO_LISTA,
                    'Bloco Q': AMBIENTES_PADRAO_LISTA,
                    'Bloco R - Mini-ginásio': ['circulacao', 'sanitarios', 'externa'],
                    'Bloco S - DAEFI / Piscina': ['sala_aula_lab', 'areas_adm', 'circulacao', 'sanitarios', 'externa'],
                    'Bloco T': AMBIENTES_PADRAO_LISTA,
                    'Bloco U': AMBIENTES_PADRAO_LISTA,
                    'Bloco V': AMBIENTES_PADRAO_LISTA
                }
            },
            'neoville': {
                nome: 'Sede Neoville',
                blocos: {
                    'Bloco A': AMBIENTES_PADRAO_LISTA, 'Bloco B': AMBIENTES_PADRAO_LISTA, 'Bloco C': AMBIENTES_PADRAO_LISTA,
                    'Bloco D': AMBIENTES_PADRAO_LISTA, 'Bloco E': AMBIENTES_PADRAO_LISTA, 'Bloco F': AMBIENTES_PADRAO_LISTA,
                    'Bloco G': AMBIENTES_PADRAO_LISTA, 'Bloco H': AMBIENTES_PADRAO_LISTA, 'Bloco J': AMBIENTES_PADRAO_LISTA,
                    'Bloco K': AMBIENTES_PADRAO_LISTA, 'Bloco L': AMBIENTES_PADRAO_LISTA, 'Bloco M': AMBIENTES_PADRAO_LISTA,
                    'Bloco N': AMBIENTES_PADRAO_LISTA, 'Bloco O': AMBIENTES_PADRAO_LISTA, 'Bloco P': AMBIENTES_PADRAO_LISTA,
                    'Bloco Q': AMBIENTES_PADRAO_LISTA, 'Bloco R': AMBIENTES_PADRAO_LISTA, 'Bloco Z': AMBIENTES_PADRAO_LISTA,
                    'Áreas de Acesso': ['circulacao', 'externa'], 'Área de Circulação': ['circulacao']
                }
            },
            'ecoville': {
                nome: 'Sede Ecoville',
                blocos: {
                    'Bloco A': AMBIENTES_PADRAO_LISTA, 'Bloco B': AMBIENTES_PADRAO_LISTA, 'Bloco C': AMBIENTES_PADRAO_LISTA,
                    'Bloco D': AMBIENTES_PADRAO_LISTA, 'Bloco E': AMBIENTES_PADRAO_LISTA, 'Bloco F': AMBIENTES_PADRAO_LISTA,
                    'Bloco I': AMBIENTES_PADRAO_LISTA, 'Bloco J': AMBIENTES_PADRAO_LISTA, 'Bloco K': AMBIENTES_PADRAO_LISTA,
                    'Bloco L': AMBIENTES_PADRAO_LISTA, 'Bloco M': AMBIENTES_PADRAO_LISTA, 'Bloco N': AMBIENTES_PADRAO_LISTA,
                    'Áreas de Acesso': ['circulacao', 'externa'], 'Área de Circulação': ['circulacao']
                }
            }
        }
    },
    // Demais câmpus simplificados (usando padrão)
    'ld': { nome: 'Londrina', temSedes: false, contato: 'Manutenção LD', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA, 'Bloco B': AMBIENTES_PADRAO_LISTA} },
    'cp': { nome: 'Cornélio Procópio', temSedes: false, contato: 'Manutenção CP', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'ap': { nome: 'Apucarana', temSedes: false, contato: 'Manutenção AP', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'cm': { nome: 'Campo Mourão', temSedes: false, contato: 'Manutenção CM', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'dv': { nome: 'Dois Vizinhos', temSedes: false, contato: 'Manutenção DV', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'fb': { nome: 'Francisco Beltrão', temSedes: false, contato: 'Manutenção FB', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'gp': { nome: 'Guarapuava', temSedes: false, contato: 'Manutenção GP', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'md': { nome: 'Medianeira', temSedes: false, contato: 'Manutenção MD', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'pb': { nome: 'Pato Branco', temSedes: false, contato: 'Manutenção PB', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'pg': { nome: 'Ponta Grossa', temSedes: false, contato: 'Manutenção PG', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'sh': { nome: 'Santa Helena', temSedes: false, contato: 'Manutenção SH', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} },
    'td': { nome: 'Toledo', temSedes: false, contato: 'Manutenção TD', blocos: {'Bloco A': AMBIENTES_PADRAO_LISTA} }
};