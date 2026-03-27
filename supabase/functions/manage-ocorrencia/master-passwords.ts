export const MASTER_PASSWORDS: Record<string, string> = {
  federer: 'ArthurFerreira',
  dirpladct: 'Servidor DIRPLAD',
  luciana: 'DIRPLAD',
  gadir: 'Chefia de Limpeza',
  seguranca: 'Vigilância',
};

export function validarSenhaMestre(senha: string | null): boolean {
  if (!senha) return false;
  const senhaNormalizada = senha.trim();
  if (!senhaNormalizada) return false;
  return Object.prototype.hasOwnProperty.call(MASTER_PASSWORDS, senhaNormalizada);
}
