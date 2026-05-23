export async function login(page: any, email: string, password: string){
  await page.goto('https://qa-trajnim.netlify.app/')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('password').nth(0).fill(password)
  await page.getByText('Sign In').nth(1).click()
}
