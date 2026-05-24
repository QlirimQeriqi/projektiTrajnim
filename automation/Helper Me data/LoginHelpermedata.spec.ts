import {test, expect} from '@playwright/test';
import {login } from './helperlogin'

test.describe('helper function with data', ()=> {
    const invalid='Wrong credentials. Try the demo account listed below.'

    test('Valid email and password', async ({page}) => {
        //Act
        await login(page, 'instructor@cineplex.com', 'Cinema123');
        //Assert 
        await expect(page.getByText('Logout')).toBeVisible();
    });

    test('Invalid email and valid Password', async ({page}) => {
        //Act
        await login(page, 'wrong@cineplex.com', 'Cinema123');
        //Assert
        await expect(page.getByText(invalid)).toBeVisible();
    });
    
    test('Valid with email and invalid with password', async ({page}) => {
        //Act
        await login(page, 'instructor@cineplex.com', 'a123455');
        //Assert 
        await expect(page.getByText(invalid)).toBeVisible();
    })
})
