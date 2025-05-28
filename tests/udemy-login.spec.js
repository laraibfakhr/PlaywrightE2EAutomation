//@ts-check

import {test , expect} from '@playwright/test'

test('Login and get items', async ({page})=>{
page.goto('https://rahulshettyacademy.com/client/')

const userEmail = page.locator('#userEmail');
const userPass = page.locator('#userPassword');

await userEmail.fill('laraib@gmail.com');
await userPass.fill('Click123@');

await page.locator('#login').click();

console.log(await page.locator('.card-body b').first().textContent())

})