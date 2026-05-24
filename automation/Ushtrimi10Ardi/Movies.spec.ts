import { test, expect } from '@playwright/test';
import { navmovies } from './helperfile';
test('when search by genre movies action should show action movies', async ({ page }) => {
  
  //Act
 await navmovies(page) 
  await page.getByLabel('Genre').selectOption('Action');

  //Assert
  await expect(page.getByText('Midnight Velocity').nth(1)).toBeVisible()
});

test('When sorting movies by shorting duration shold show the shortes movies', async ({ page }) => {
  
  //Act
 await navmovies(page) 
  await page.getByLabel('Sort').selectOption('Shortest Duration');

  //Assert
  await expect(page.getByText('Summer Atlas')).toBeVisible()
});

test('When select price in filteres by max 7 euros should show movies that are 7 euro max price', async ({ page }) => {
 
  //Act
 await navmovies(page) 
  await page.getByLabel('Max price').fill('5.5');

  //Assert
  await expect(page.getByText('Velvet Court').nth(1)).toBeVisible()
});

test('When selecting movies by max rating 8.5 should show movies by that rating', async ({ page }) => {
 
  //Act
 await navmovies(page) 
  await page.getByLabel('Min rating').fill('8.5');

  //Assert
  await expect(page.getByText('Kingdom of Dust').nth(1)).toBeVisible()
});
