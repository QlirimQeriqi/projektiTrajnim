export async function navhome(page: any) {
  await page.goto('https://qa-trajnim.netlify.app/');
await page.getByText('Email').nth(0).fill(' instructor@cineplex.com');
await page.getByLabel('Password').nth(0).fill('Cinema123');
await page.getByText('Sign In').nth(1).click();

}