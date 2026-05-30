import { test, expect } from '@playwright/test';
import { openloginForm } from './HelperFile/loginHepler';
import { openLoginform } from './helper files/loginHelper';

test('should login with valid credentials / duhet te kycet me kredenciale valide', async ({ page }) => {
  //Act
  await openloginForm(page);
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Logout')).toBeVisible();
});

test('should open movies after login / duhet te hape filmat pas hyrjes', async ({ page }) => {
  //Act
  await openLoginform(page);

  //Assert
  await expect(page.getByText('Home').nth(0)).toBeVisible();
});
