import { useState } from 'react';
import { Button, SegmentedControl } from '@primer/react';
import MuiButton from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Button as BsButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

type Natureza = 'Melhoria' | 'Reclamação';
type Grupo = 'estrutura' | 'servicos' | 'bens';

const GRUPO_LABEL: Record<Grupo, string> = {
  estrutura: 'Estrutura',
  servicos: 'Serviços',
  bens: 'Bens em Geral',
};

function ModeloCard({ index, titulo, children }: { index: number; titulo: string; children: React.ReactNode }) {
  return (
    <article className="showcase-model-card">
      <p className="showcase-model-number">Modelo {index}</p>
      <h3 className="showcase-model-title">{titulo}</h3>
      <div className="showcase-model-preview">{children}</div>
    </article>
  );
}

export function ButtonShowcasePage() {
  const [natureza, setNatureza] = useState<Natureza>('Reclamação');
  const [grupo, setGrupo] = useState<Grupo>('servicos');
  const TOTAL_MODELOS = 25;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-8">
      <section className="card mb-4">
        <h1 className="text-center text-4xl font-semibold text-zinc-900">Galeria de Botões</h1>
        <p className="mt-2 text-center text-sm text-zinc-600">
          Página de comparação para Natureza e Grupo com Primer + outras bibliotecas.
        </p>
        <p className="mt-1 text-center text-sm font-semibold text-zinc-800">Total: {TOTAL_MODELOS} modelos</p>
      </section>

      <section className="card mb-4">
        <h2 className="mb-3 text-lg font-semibold">Modelos disponíveis</h2>
        <div className="showcase-model-grid">
          <ModeloCard index={1} titulo="Primer Segmented - Natureza">
            <div className="choice-wrap">
              <SegmentedControl fullWidth size="small" onChange={(index) => setNatureza(index === 0 ? 'Melhoria' : 'Reclamação')}>
                <SegmentedControl.Button selected={natureza === 'Melhoria'}>Sugestão de Melhoria</SegmentedControl.Button>
                <SegmentedControl.Button selected={natureza === 'Reclamação'}>Fato Ocorrido</SegmentedControl.Button>
              </SegmentedControl>
              <p className="choice-subtitle">{natureza === 'Melhoria' ? 'Problemas existentes' : 'Reclamação'}</p>
            </div>
          </ModeloCard>

          <ModeloCard index={2} titulo="Primer Segmented - Grupo">
            <div className="choice-wrap">
              <SegmentedControl fullWidth size="small" onChange={(index) => setGrupo((['estrutura', 'servicos', 'bens'] as Grupo[])[index])}>
                <SegmentedControl.Button selected={grupo === 'estrutura'}>Estrutura</SegmentedControl.Button>
                <SegmentedControl.Button selected={grupo === 'servicos'}>Serviços</SegmentedControl.Button>
                <SegmentedControl.Button selected={grupo === 'bens'}>Bens em Geral</SegmentedControl.Button>
              </SegmentedControl>
              <p className="choice-subtitle">Selecionado: {GRUPO_LABEL[grupo]}</p>
            </div>
          </ModeloCard>

          <ModeloCard index={3} titulo="Primer Default">
            <Button variant="default">Ação padrão</Button>
          </ModeloCard>
          <ModeloCard index={4} titulo="Primer Primary">
            <Button variant="primary">Ação principal</Button>
          </ModeloCard>
          <ModeloCard index={5} titulo="Primer Danger">
            <Button variant="danger">Ação crítica</Button>
          </ModeloCard>
          <ModeloCard index={6} titulo="Primer Invisible">
            <Button variant="invisible">Ação discreta</Button>
          </ModeloCard>
          <ModeloCard index={7} titulo="Primer Link">
            <Button variant="link">Ver detalhes</Button>
          </ModeloCard>
          <ModeloCard index={8} titulo="Primer Small">
            <Button size="small" variant="default">Compacto</Button>
          </ModeloCard>
          <ModeloCard index={9} titulo="Primer Medium">
            <Button size="medium" variant="primary">Médio</Button>
          </ModeloCard>
          <ModeloCard index={10} titulo="Primer Large">
            <Button size="large" variant="primary">Grande</Button>
          </ModeloCard>

          <ModeloCard index={11} titulo="MUI Contained">
            <MuiButton variant="contained">Contained</MuiButton>
          </ModeloCard>
          <ModeloCard index={12} titulo="MUI Outlined">
            <MuiButton variant="outlined">Outlined</MuiButton>
          </ModeloCard>
          <ModeloCard index={13} titulo="MUI Text">
            <MuiButton variant="text">Text</MuiButton>
          </ModeloCard>
          <ModeloCard index={14} titulo="MUI Soft Success">
            <MuiButton color="success" variant="contained">Sucesso</MuiButton>
          </ModeloCard>
          <ModeloCard index={15} titulo="MUI Stack Vertical">
            <Stack direction="column" spacing={1}>
              <MuiButton size="small" variant="contained">Aprovar</MuiButton>
              <MuiButton size="small" variant="outlined">Revisar</MuiButton>
            </Stack>
          </ModeloCard>

          <ModeloCard index={16} titulo="Bootstrap Primary">
            <BsButton variant="primary">Primary</BsButton>
          </ModeloCard>
          <ModeloCard index={17} titulo="Bootstrap Outline Dark">
            <BsButton variant="outline-dark">Outline</BsButton>
          </ModeloCard>
          <ModeloCard index={18} titulo="Bootstrap Success">
            <BsButton variant="success">Success</BsButton>
          </ModeloCard>
          <ModeloCard index={19} titulo="Bootstrap Danger">
            <BsButton variant="danger">Danger</BsButton>
          </ModeloCard>

          <ModeloCard index={20} titulo="Custom Pílula">
            <button className="chip-btn chip-btn-active" type="button">Sugestão de Melhoria</button>
          </ModeloCard>
          <ModeloCard index={21} titulo="Custom Glass">
            <button className="btn-glass" type="button">Ver em transparência</button>
          </ModeloCard>
          <ModeloCard index={22} titulo="Custom Gradiente">
            <button className="btn-gradient" type="button">Abrir painel</button>
          </ModeloCard>
          <ModeloCard index={23} titulo="Custom Neon">
            <button className="btn-neon" type="button">Ativar alerta</button>
          </ModeloCard>
          <ModeloCard index={24} titulo="Custom Minimal">
            <button className="btn-minimal" type="button">Ver relatório</button>
          </ModeloCard>
          <ModeloCard index={25} titulo="Custom Borda Forte">
            <button className="btn-outline-strong" type="button">Entrar no modo gestão</button>
          </ModeloCard>
        </div>
      </section>
    </main>
  );
}
