import { test, expect } from '@playwright/test';

test('should show error for invalid credentials', async ({ page }) => {
  //Act
  await page.goto('/');
  await page.getByLabel('Email').fill('wrong@cineplex.com');
  await page.getByText('Password').click();
  await page.getByText('Wrong123');
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Wrong credentials. Try the demo account listed below.')).toBeVisible();
});
