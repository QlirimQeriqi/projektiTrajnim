import { test, expect } from '@playwright/test';

test('should show wrong credentials for invalid login / duhet te shfaqe kredenciale te pasakta per hyrje te gabuar', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('wrong@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Wrong123');
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Wrong credentials. Try the demo account listed below.')).toBeVisible();
});

test('should switch language to Albanian / duhet ta nderroje gjuhen ne shqip', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByTestId('lang-al').click();

  //Assert
  await expect(page.getByTestId('signin-title')).toHaveText('Hyr');
});

test('should navigate to history from menu / duhet te navigoje ne histori nga menuja', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('History').click();

  //Assert
  await expect(page.getByText('Order History')).toBeVisible();
});

test('should open top rated film from home / duhet te hape filmin me vleresim te larte nga ballina', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Kingdom of Dust').nth(1).click();

  //Assert 
  await expect(page.getByText('Kingdom of Dust').nth(0)).toBeVisible();
});

test('should show ordered movie in history / duhet te shfaqe filmin e porositur ne histori', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies', { exact: true }).click();
  await page.getByText('Save Movie').first().click();
  await page.getByText('My Plan').click();
  await page.getByText('Finish Order').click();
  await page.getByText('Confirm Order').click();
  await page.getByText('History').click();

  //Assert
  await expect(page.getByText('Kingdom of Dust')).toBeVisible();
});

test('should search movie from movies page / duhet te kerkoje film nga faqja e filmave', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies').nth(0).click();
  await page.getByLabel('Search').fill('Kingdom of Dust');

  //Assert
  await expect(page.getByText('Kingdom of Dust').nth(1)).toBeVisible();
});
