import {test, expect} from '@playwright/test'

test.describe('navigimi per log in',() => {
    test.beforeEach(async ({ page }) => {
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
        })

test('home', async ({ page }) => {
 //act
  await page.getByText('Home').click();

  //Assert
  await expect(page.getByText('Logout')).toBeVisible();
});

test('movies', async ({ page }) => {
  //act
  await page.getByText('Movies').nth(0).click();

  //Assert
  await expect(page.getByText('Search').nth(0)).toBeVisible();
});

test('my plan', async ({ page }) => {
  //act
  await page.getByText('My Plan').click();

  //Assert
  await expect(page.getByText('My Watch Plan')).toBeVisible();
});

test('history', async ({ page }) => {
  //act
  await page.getByText('History').click();

  //Assert
  await expect(page.getByText('No completed orders yet. Finish an order from My Plan to see it here.')).toBeVisible();
});
})