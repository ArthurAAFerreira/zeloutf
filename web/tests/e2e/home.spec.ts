import { test, expect } from '@playwright/test';

test('carrega tela principal modernizada', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Nova versão React + TypeScript')).toBeVisible();
  await expect(page.getByLabel('Campus')).toBeVisible();
});
