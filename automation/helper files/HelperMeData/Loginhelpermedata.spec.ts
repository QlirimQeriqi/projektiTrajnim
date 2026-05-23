import { test, expect} from '@playwright/test';
import { login } from './helperLogin';

test.describe('Helper function with data', () => {
   const texterrori = 'Wrong credentials. Try the demo account listed below.'

    test('Valid email and password', async ({ page }) => {
    //Act
     await login(page, 'instructor@cineplex.com', 'Cinema123');

    //Assert
    await expect(page.getByText('Logout')).toBeVisible();
    
 });

 test ('Invalid email and valid password', async ({ page }) => {
    //Act
    await login(page, 'wrong@cineplex.com','Cinema123');

    //Assert
    await expect(page.getByText(texterrori)).toBeVisible();
 });

 test ('valid email and invalid password', async ({page}) => {
    //Act
    await login(page,'instructor@cineplex.com','GabimPasswordi12345');

    //Assert
    await expect(page.getByText(texterrori)).toBeVisible();
 })

});