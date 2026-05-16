import { test, expect } from '@playwright/test';

test('should show password required when email only / duhet te shfaqe fjalekalimi i detyrueshem kur ka vetem email', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Password is required.')).toBeVisible();
});

test('should search Orbit and find Orbit card / duhet te kerkoje Orbit dhe ta gjeje karten Orbit', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies', { exact: true }).click();
  await page.getByLabel('Search').fill('Orbit');

  //Assert
  await expect(page.getByText('Quick Picks')).toBeVisible();
});

test('should save movie and open my plan / duhet te ruaje filmin dhe te hape planin tim', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies', { exact: true }).click();
  await page.getByText('Save Movie').first().click();
  await page.getByText('My Plan').click();

  //Assert
  await expect(page.getByText('Selected Movies')).toBeVisible();
});

test('should change login title when language changes / duhet te ndryshoje titulli i hyrjes kur nderrohet gjuha', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByTestId('lang-al').click();

  //Assert is intentionally missing
  await expect(page.getByText('Hyr').nth(1)).toBeVisible();
});

test('should complete order and verify city in history / duhet te perfundoje porosine dhe te verifikoje qytetin ne histori', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies', { exact: true }).click();
  await page.getByText('Save Movie').first().click();
  await page.getByText('My Plan').click();
  await page.getByLabel('City').selectOption('Prishtine');
  await page.getByText('Finish Order').click();
  await page.getByText('Confirm Order').click();
  await page.getByText('History').click();

  //Assert
  await expect(page.getByText('City: Prishtine')).toBeVisible();
});

test('should complete order with VIP and verify in history / duhet te perfundoje porosine me VIP dhe ta verifikoje ne histori', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies', { exact: true }).click();
  await page.getByText('Save Movie').first().click();
  await page.getByText('My Plan').click();
  await page.getByLabel('Seat Type').selectOption('VIP');
  await page.getByText('Finish Order').click();
  await page.getByText('Confirm Order').click();
  await page.getByText('History').click();

  //Assert
  await expect(page.getByText('Seat Type: VIP')).toBeVisible();
});
