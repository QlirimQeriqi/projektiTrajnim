  import { test, expect } from '@playwright/test';
  import { Signup} from './helper';
  import { Navigate } from './helper';


  test('User should sign in with credentials', async ({ page }) => {

  //Act
  await Signup(page)

  //Assert
  await expect(page.getByText('Logout')).toBeVisible();
  });


  test('User should saved film and show to my plan', async ({ page }) => {

  //Act
  await Signup(page)
  await Navigate(page)

  //Assert
  await expect(page.getByText('Order completed successfully.')).toBeVisible();
  });


  test('User confirm film at my plan', async ({ page }) => {

  //Act
  await Signup(page)
  await Navigate(page)


  //Assert
  await expect(page.getByText('Order completed successfully.')).toBeVisible();
  });

  test('User should see if movies save with tickets ', async ({ page }) => {

  //Act
  await Signup(page)
  await Navigate(page)
  await page.getByText('History').click();
  await page.getByText('Tickets: 3').click();

  //Assert
  await expect(page.getByText('Tickets: 3')).toBeVisible();
  });


  test('User should remove movies in history', async ({ page }) => {

  //Act
  await Signup(page)
  await Navigate(page)
  await page.getByText('History').click();
  await page.getByText('Tickets: 3').click();
  await page.getByLabel('Delete order').nth(0).click();
  await page.getByText('Yes, delete').click();

  //Assert
  await expect(page.getByText('Tickets: 3')).not.toBeVisible();
  });