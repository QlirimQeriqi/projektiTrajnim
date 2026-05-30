import { test, expect } from '@playwright/test';
import { login } from './helperlogin'
test.describe ('Helper function with data',  () => {
    const texterroi = 'Wrong credentials. Try the demo account listed below.'

    test('Valid email and password', async ({ page }) => {
        await login(page,'instructor@cineplex.com', 'Cinema123');
        await expect(page.getByText('logout')).toBeVisible()
    })

      test('invalid email and password', async ({ page }) => {
        await login(page, 'gabim@cineplex.com', 'Cinema123');
        await expect(page.getByText(texterroi)).toBeVisible()
    })

    test('valid email and invalid password', async ({ page }) => {
     //Act
     await login(page, 'instructor@cineplex.com', 'GabimPasswordi12345')
  
    //Assert
    await expect(page.getByText(texterroi)).toBeVisible();
    })
})