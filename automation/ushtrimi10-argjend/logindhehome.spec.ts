import { test, expect } from '@playwright/test';

test('e ptotesoj email nuk e ptotestoj passwordin shfaqet error mesazhin', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Password is required.')).toBeVisible();
});

test('e plotesoj passwordin nuk e plotesoj email shfaq error mesazhin', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Email is required.')).toBeVisible();
});

test('opsioni logout', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign in').nth(1).click();
  await page.getByText('Logout').click();


  //Assert
  await expect(page.getByText('Use your demo account to enter the portal.')).toBeVisible();
});

test('shfaqet syri hapur dhe mbyllur per passwordin', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByLabel('password').nth(1).click()
  

  //Assert
  await expect(page.getByText('Cinema123')).toBeVisible();
});