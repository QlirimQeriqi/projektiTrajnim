import { test, expect } from '@playwright/test';

test('should display required messages for empty login / duhet te shfaqe mesazhet e detyrueshme per hyrje bosh', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Email is required.')).toBeVisible();
  await expect(page.getByText('Password is required.')).toBeVisible();
});

test('should open movies after login / duhet te hape filmat pas hyrjes', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies', { exact: true }).click();

  //Assert
  await expect(page.getByText('Search').nth(0)).toBeVisible();
});

test('should search in movies list / duhet te kerkoje ne listen e filmave', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies', { exact: true }).click();
  await page.getByLabel('Search').fill('Silent Harbor');

  //Assert is intentionally missing

   await expect(page.getByText('Silent Harbor').first()).toBeVisible()

});

test('should show logout after valid credentials / duhet te shfaqe dil pas kredencialeve valide', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign in').nth(1).click()

  //Assert
  await expect(page.getByText('Logout')).toBeVisible();
});

test('should search Orbit and show Orbit card / duhet te kerkoje Orbit dhe te shfaqe karten Orbit', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies', { exact: true }).click();
  await page.getByLabel('Search').fill('Orbit');

  //Assert
  await expect(page.getByText('Orbit').nth(1)).toBeVisible();
});

test('should save movie and show plan counter 1 / duhet te ruaje film dhe te shfaqe numeruesin e planit 1', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies', { exact: true }).click();
  await page.getByText('Save Movie').first().click();
  await page.getByText('My Plan').first().click();  

  //Assert
  await expect(page.getByText('1 In Plan')).toBeVisible();
});
