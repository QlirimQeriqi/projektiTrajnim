import { test, expect } from '@playwright/test';
import { navhome } from './helperfile'

test('should switch to Albanian language / duhet te kaloje nga Anglishtja ne Shqipe', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByTestId('lang-al').click();

  //Assert
  await expect(page.getByText('Hyr').nth(0)).toBeVisible();
});

test('Login me kredenciale invalide / shfaqja e error mesage', async ({ page }) => {
//Act
await page.goto('https://qa-trajnim.netlify.app/');
await page.getByText('Email').nth(0).fill('wrongwrong@gmail.com');
await page.getByLabel('Password').nth(0).fill('Wrong123');
await page.getByText('Sign In').nth(1).click();

//Assert
await expect(page.getByText('Wrong credentials. Try the demo account listed below.')).toBeVisible()

});

test('Funksioni i opsionit Browse Movies ne Home', async ({ page }) => {
//Act
await navhome(page)
await page.getByText('Browse Movies').click();

//Assert
await expect(page.getByText('Clean catalog experience with fast filters and clear movie cards.')).toBeVisible();
});

test('Funksioni i opsionit Book Now ne Home', async ({ page }) => {
//Act
await navhome(page)
await page.getByText('Book Now').click();

//Assert
await expect(page.getByText('Finalize city, watch order, showtime, seat type, and ticket quantity per movie.')).toBeVisible();
});

test('Funksioni i butonit te Gjuhes Shqipe ne Home', async ({ page }) => {
//Act
await navhome(page)
await page.getByText('AL').nth(0).click();

//Assert
await expect(page.getByText('Shfleto Filmat')).toBeVisible();
});