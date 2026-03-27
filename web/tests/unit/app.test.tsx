import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../../src/App';

describe('App', () => {
  it('renderiza badge principal', () => {
    render(<App />);
    expect(screen.getByText(/Sistema/i)).toBeTruthy();
  });
});
