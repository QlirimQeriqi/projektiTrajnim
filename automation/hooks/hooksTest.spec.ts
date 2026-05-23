import { test, expect } from '@playwright/test';

test.describe('Navigimi per login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://qa-trajnim.netlify.app/');
    await page.getByLabel('Email').fill('instructor@cineplex.com');
    await page.getByLabel('password').nth(0).fill('Cinema123');
    await page.getByText('Sign In').nth(1).click();

  })
  

test('Navigate to Home', async ({ page }) => {
    //Act
  
    await page.getByText('Home').click();

    //Assert
    await expect(page.getByText('Now Showing')).toBeVisible();
});

test('Navigate to Movies', async ({ page }) => {
    //Act
 
    await page.getByText('Movies').nth(0).click();

    //Assert
    await expect(page.getByText('Search').nth(0)).toBeVisible();
});

  test('Navigate to My Plan', async ({ page }) => {

    await page.getByText('My Plan').click();

    //Assert
    await expect(page.getByText('My Watch Plan')).toBeVisible();
  });

  test('Navigate to History', async ({ page }) => {
 
    await page.getByText('History').click();

    //Assert
    await expect(page.getByText('Order History')).toBeVisible();
  });
})