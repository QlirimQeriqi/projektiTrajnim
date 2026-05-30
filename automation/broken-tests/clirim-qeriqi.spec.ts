//Rregullimet e testev

import { test, expect } from '@playwright/test';

test('should switch to Albanian language / duhet te kaloje ne gjuhen shqipe', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByTestId('lang-en').click();

  //Assert
  await expect(page.getByText('Sign in').nth(0)).toBeVisible();
});

test('should login and see logout button / duhet te kycet dhe te shohe butonin dil', async ({ page }) => {
//Arrange
const email = 'instructor@cineplex.com'
const password = 'Cinema123'

  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('password').nth(0).fill(password);
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Logout')).toBeVisible();
});

test('should open history page from menu / duhet te hape faqen e historikut nga menuja', async ({ page }) => {

  //Arrange
const email = 'instructor@cineplex.com'
const password = 'Cinema123'

  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('password').nth(0).fill(password);
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('History').click();

  //Assert is intentionally missing
  await expect(page.getByText('Completed orders appear here. Latest completed order is shown first.')).toBeVisible();
});

test('should complete order and check Standard seat in history / duhet te perfundoje porosine dhe te kontrolloje uljen Standard ne histori', async ({ page }) => {
  //Arrange
const credentialsvalide = {
  email: 'instructor@cineplex.com',
  password: 'Cinema123',
  hm: 'History'
}
  
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill(credentialsvalide.email);
  await page.getByLabel('password').nth(0).fill(credentialsvalide.password);
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies').nth(0).click();
  await page.getByText('Save Movie').first().click();
  await page.getByText('My Plan').click();
  await page.getByText('Finish Order').click();
  await page.getByText('Confirm Order').click();
  await page.getByText(credentialsvalide.hm).click();

  //Assert
  await expect(page.getByText('Seat Type: Standard')).toBeVisible();
});

test('should show ordered movie in history / duhet te shfaqe filmin e porositur ne histori', async ({ page }) => {
//Arrange
const email = 'instructor@cineplex.com'
const password = 'Cinema123'
const O = 'Orbit 9'

  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('password').nth(0).fill(password);
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies').nth(0).click();
  await page.getByText(O).nth(0).click();
  await page.getByText('Save to Plan').click();
  await page.getByText('Close').click();
  await page.getByText('My Plan').click();
  await page.getByText('Finish Order').click();
  await page.getByText('Confirm Order').click();
  await page.getByText('History').click();

  //Assert
  await expect(page.getByText(O)).toBeVisible();
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
