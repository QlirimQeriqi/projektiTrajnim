export async function openLoginForm(page: any) {
   const email = "instructor@cineplex.com";
   const password = "Cinema123";

await page.goto('https://qa-trajnim.netlify.app/');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('password').nth(0).fill(password);
}