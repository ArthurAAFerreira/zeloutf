import { describe, expect, it } from 'vitest';
import { ocorrenciaFormSchema } from '../../src/schemas/ocorrencia';

describe('ocorrencia form schema', () => {
  it('valida payload correto', () => {
    const result = ocorrenciaFormSchema.safeParse({
      tipo: 'Reclamação',
      problema: 'Iluminação',
      localExato: '1º Andar + Sala 104',
      descricao: 'Lâmpadas queimadas no corredor principal.',
      identificacao: 'usuario@utfpr.edu.br',
    });

    expect(result.success).toBe(true);
  });

  it('reprova payload inválido', () => {
    const result = ocorrenciaFormSchema.safeParse({
      tipo: 'Reclamação',
      problema: '',
      localExato: 'x',
      descricao: 'curta',
    });

    expect(result.success).toBe(false);
  });
});
