import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.warn('Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env');
}

const fallbackUrl = 'https://example.supabase.co';
const fallbackAnon = 'public-anon-key';

export const db = createClient(url ?? fallbackUrl, anon ?? fallbackAnon, {
  db: { schema: 'zeloutf' },
});

export const DB_SCHEMA = 'zeloutf';
export const DB_TABLE_OCORRENCIAS = 'ocorrencias';
