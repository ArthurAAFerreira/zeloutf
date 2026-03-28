import { Instagram, Mail } from 'lucide-react';

type AppFooterProps = {
  className?: string;
};

export function AppFooter({ className }: AppFooterProps) {
  return (
    <footer className={`app-footer ${className ?? ''}`.trim()}>
      <span>Desenvolvido por Arthur Ferreira | 2026</span>
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
