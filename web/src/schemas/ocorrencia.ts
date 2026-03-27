import { z } from 'zod';

export const ocorrenciaFormSchema = z.object({
  tipo: z.enum(['Reclamação', 'Melhoria']),
  problema: z.string().min(1, 'Selecione o tipo de relato.'),
  localExato: z.string().min(3, 'Informe o local exato (Andar+Sala).'),
  descricao: z.string().min(10, 'Informe uma descrição mais completa.'),
  identificacao: z.string().optional(),
});

export type OcorrenciaFormData = z.infer<typeof ocorrenciaFormSchema>;
