import { test, expect } from '@playwright/test';

test('should switch to Albanian language / duhet te kaloje ne gjuhen shqipe', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByTestId('lang-en').click();

  //Assert
  await expect(page.getByText('Sign in').nth(0)).toBeVisible();
});

test('should login and see logout button / duhet te kycet dhe te shohe butonin dil', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Logout')).toBeVisible();
});

test('should open history page from menu / duhet te hape faqen e historikut nga menuja', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('History').click();

  //Assert is intentionally missing
  await expect(page.getByText('Completed orders appear here. Latest completed order is shown first.')).toBeVisible();
});

test('should complete order and check Standard seat in history / duhet te perfundoje porosine dhe te kontrolloje uljen Standard ne histori', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies').nth(0).click();
  await page.getByText('Save Movie').first().click();
  await page.getByText('My Plan').click();
  await page.getByText('Finish Order').click();
  await page.getByText('Confirm Order').click();
  await page.getByText('History').click();

  //Assert
  await expect(page.getByText('Seat Type: Standard')).toBeVisible();
});

test('should show ordered movie in history / duhet te shfaqe filmin e porositur ne histori', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies').nth(0).click();
  await page.getByText('Orbit 9').nth(0).click();
  await page.getByText('Save to Plan').click();
  await page.getByText('Close').click();
  await page.getByText('My Plan').click();
  await page.getByText('Finish Order').click();
  await page.getByText('Confirm Order').click();
  await page.getByText('History').click();

  //Assert
  await expect(page.getByText('Orbit 9')).toBeVisible();
});

test('should show invalid login message / duhet te shfaqe mesazh per hyrje te gabuar', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('wrong@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Wrong123');
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Wrong credentials. Try the demo account listed below.')).toBeVisible();
});
