  export async function Signup(page: any) {
  
  await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill('instructor@cineplex.com');
  await page.getByLabel('password').nth(0).fill('Cinema123');
  await page.getByText('Sign In').nth(1).click();
  };

  export async function Navigate(page: any) {

  await page.getByText('Movies').nth(1).click();
  await page.getByText('Orbit 9').nth(1).click();
  await page.getByText('Save to plan').click();
  await page.getByText('Close').click();
  await page.getByText('My plan').click();
  await page.getByText('Orbit 9').click();
  await page.getByLabel('Tickets').fill('3')
  await page.getByText('Finish Order').click();
  await page.getByText('Confirm Order').click();

  };