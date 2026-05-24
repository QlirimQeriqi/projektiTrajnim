import { test, expect } from '@playwright/test';

test('should login with valid credentials / duhet te kycet me kredenciale valide', async ({ page }) => {
  //Arrange
  const link='https://qa-trajnim.netlify.app';
  const email = 'instructor@cineplex.com';
  const password = 'Cinema123';

  //Act
  await page.goto(link);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('password').nth(0).fill(password);
  await page.getByText('Sign In').nth(1).click();

  //Assert
  await expect(page.getByText('Logout')).toBeVisible();
});

test('should search by director in movies / duhet te kerkoje sipas regjisorit ne filma', async ({ page })  => {
    //Arrange
  const link='https://qa-trajnim.netlify.app';
  const email = 'instructor@cineplex.com';
  const password = 'Cinema123';

  //Act
  await page.goto(link);
  await page.getByLabel('Email').fill(email)
  await page.getByText('Password').fill(password);
  await page.getByText('Sign In').nth(1).click()
  await page.getByText('Movies').nth(0).click()
  await page.getByLabel('Search').nth(0).fill('Arben Kola');
  await page.getByText('Silent Harbor').nth(0).click()
  await page.getByText('Arben Kola').nth(0).click()

  //Assert
  await expect(page.getByText('Arben Kola')).toBeVisible();
});

test('should show one movie in plan after save / duhet te shfaqe nje film ne plan pas ruajtjes', async ({ page }) => {
  //arrange
  const credValid={
    url:'https://qa-trajnim.netlify.app',
    filmat:'Movies',
    sport:'Final Whistle', 
    plani:'My plan'
  }
  
  //Act
  await page.goto(credValid.url);
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText(credValid.filmat).nth(0).click()
  await page.getByText(credValid.sport).nth(0).click()
  await page.getByText('Save To Plan').nth(0).click()
  await page.getByText('Close').nth(0).click()
  await page.getByText(credValid.plani).nth(0).click()

  //Assert
  await expect(page.getByText('My Plan')).toBeVisible()
});

test('should switch back to English title / duhet te ktheje titullin ne anglisht', async ({ page }) => {
  //Act
  await page.goto('/');
  await page.getByTestId('lang-al').click();
  await page.getByTestId('lang-en').click();

  //Assert
    await expect(page.getByText('Professional training sandbox for UI testing, Playwright flows, and booking scenarios.')).toBeVisible()
});

test('should open my plan tab from menu / duhet te hape planin tim nga menuja', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('My Plan').click();

  //Assert 
  await expect(page.getByText('My Plan')).toBeVisible()
  
});

test('should save movie and show one item in plan counter / duhet te ruaje film dhe te shohe nje artikull ne numeruesin e planit', async ({ page }) => {
  //Act
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  await page.getByText('Movies').click();
  await page.getByText('Save Movie').first().click();
  await page.getByText('In Plan').nth(0).click()
  await page.getByText('1 In Plan').click()

  //Assert
  await expect(page.getByText('1 In Plan')).toBeVisible()
});
