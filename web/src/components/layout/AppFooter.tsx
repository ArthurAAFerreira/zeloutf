import { Instagram, Mail } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="app-footer w-full">
      <span className="text-[#9ab8d9]">
        ZeloUTF · UTFPR &nbsp;|&nbsp; Desenvolvido por{' '}
        <span className="font-semibold text-white">Arthur Ferreira</span> · 2026
      </span>
      <div className="app-footer-links">
        <a href="mailto:arthurferreira@utfpr.edu.br" aria-label="Enviar e-mail para Arthur Ferreira">
          <Mail className="h-4 w-4" />
        </a>
        <a href="https://instagram.com/arthuraaferreira" aria-label="Instagram" rel="noreferrer" target="_blank">
          <Instagram className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
