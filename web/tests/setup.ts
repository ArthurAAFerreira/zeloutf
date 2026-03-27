import React from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

vi.mock('@primer/react', () => {
  const SegmentedControl = ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'primer-segmented-control' }, children);

  const SegmentedControlButton = ({ children, ...props }: { children: React.ReactNode }) =>
    React.createElement('button', { type: 'button', ...props }, children);

  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
    BaseStyles: ({ children }: { children: React.ReactNode }) => children,
    SegmentedControl: Object.assign(SegmentedControl, { Button: SegmentedControlButton }),
  };
});

afterEach(() => {
  cleanup();
});
