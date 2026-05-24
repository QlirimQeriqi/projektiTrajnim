import { test, expect } from '@playwright/test';
import { openLoginForm } from './Helper File/loginHelper';
test('should login with valid credentials / duhet te kycet me kredenciale valide', async ({ page }) => {
  //Act
  await openLoginForm (page)


  //Assert
  await expect(page.getByText('Home')).toBeVisible();
});