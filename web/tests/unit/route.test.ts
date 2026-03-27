import { describe, expect, it } from 'vitest';
import { gerarBuscaRota, gerarRotaCompacta, normalizarToken, parsearRotaCompacta, parsearRotaCompat, tokenizarBloco } from '../../src/lib/route';

describe('route helpers', () => {
  it('normaliza token para lowercase', () => {
    expect(normalizarToken(' CT ')).toBe('ct');
  });

  it('tokeniza bloco padrão', () => {
    expect(tokenizarBloco('Bloco A')).toBe('a');
    expect(tokenizarBloco('Área de Circulação')).toBe('circulacao');
  });

  it('gera query string de rota', () => {
    expect(gerarBuscaRota('ct', 'centro', 'Bloco A')).toBe('?c=ct&s=centro&b=A');
  });

  it('parseia rota moderna por campus/sede/bloco', () => {
    expect(parsearRotaCompat('?campus=ct&sede=centro&bloco=Bloco%20A')).toEqual({
      campusId: 'ct',
      sedeId: 'centro',
      blocoNome: 'Bloco A',
    });
  });

  it('parseia rota tokenizada c/s/b', () => {
    expect(parsearRotaCompat('?c=ct&s=centro&b=A')).toEqual({
      campusId: 'ct',
      sedeId: 'centro',
      blocoNome: 'Bloco A',
    });
  });

  it('parseia rota legada code', () => {
    expect(parsearRotaCompat('?code=ct.centro.a')).toEqual({
      campusId: 'ct',
      sedeId: 'centro',
      blocoNome: 'Bloco A',
    });
  });

  it('gera rota compacta sem sede', () => {
    expect(gerarRotaCompacta('ld', null, 'Bloco A')).toBe('/ld&a');
  });

  it('gera rota compacta com sede', () => {
    expect(gerarRotaCompacta('ct', 'centro', 'Bloco M - Restaurante Universitário')).toBe('/ct$centro&m');
  });

  it('parseia rota compacta com sede e bloco', () => {
    expect(parsearRotaCompacta('/ct$centro&m')).toEqual({
      campusId: 'ct',
      sedeId: 'centro',
      blocoNome: 'Bloco M - Restaurante Universitário',
    });
  });

  it('parseia rota compacta sem sede', () => {
    expect(parsearRotaCompacta('/ld&a')).toEqual({
      campusId: 'ld',
      sedeId: null,
      blocoNome: 'Bloco A',
    });
  });
});
