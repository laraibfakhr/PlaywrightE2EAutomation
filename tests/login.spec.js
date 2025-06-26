//@ts-check

import { test, expect } from "@playwright/test";
import { getTokenfromAPI } from "../helpers/webAPItokens.js";

test.beforeEach(async ({ page , request}) => {

  // Get the token from the API helper
  const ResponseToken = await getTokenfromAPI(request);
  console.log("Token from API:", ResponseToken);
  
  
  page.addInitScript(value => {
    // Inject a script to set the localStorage item

    window.localStorage.setItem('token', value);
  }, ResponseToken);

  await page.goto("https://rahulshettyacademy.com/client/");
   


  await page.goto("https://rahulshettyacademy.com/client/");
   
});

test("Verify the content of the Cart page and order ID", async ({ page }) => {
  // Add ADIDAS ORIGINAL to the cart before verifying
    await page.waitForSelector(".card-body");

  const productList = page.locator(".card-body");
  const count = await productList.count();

  for (let i = 0; i < count; i++) {
    const productName = await productList.nth(i).locator("b").textContent();

    if (productName?.trim() === "ADIDAS ORIGINAL") {
      const addToCartButton = productList.nth(i).locator("text=Add To Cart");

      // ✅ Ensure button is visible and enabled before clicking
      await expect(addToCartButton).toBeVisible();
      await addToCartButton.click();

      break;
    }
  }

  // Click on the Cart tab
  await page.locator("[routerlink*='cart']").click();

  // Assert the product name in the cart is 'ADIDAS ORIGINAL'
  await page.waitForSelector(".cartSection h3");
  const cartProductName = await page.locator(".cartSection h3").textContent();
  expect(cartProductName).toBe("ADIDAS ORIGINAL");

  // Assert the sum of items of each product in the cart to the total amount

  await page.waitForSelector(".prodTotal.cartSection >> p");

  // Get all product price elements
  const priceLocators = await page.locator(".prodTotal.cartSection >> p").all();

  let total = 0;

  for (const locator of priceLocators) {
    const priceText = await locator.textContent();

    if (priceText) {
      // Remove everything except digits, then convert to number
      const numericValue = parseInt(priceText.replace(/[^0-9]/g, ""), 10);
      total += numericValue;
    } else {
      console.warn("Price text was null or empty for one of the items.");
    }
  }

  console.log("Total sum of all product prices:", total); // Example output: 63000
  // 2. Extract the "Total" value from summary section
  const totalRow = page.locator("li.totalRow").filter({
    has: page.locator("span.label", { hasText: "Total" }),
  });

  const totalText = await totalRow.locator("span.value").nth(1).textContent();

  const uiTotal = totalText
    ? parseInt(totalText.replace(/[^0-9]/g, ""), 10)
    : 0;

  console.log("Displayed total from UI:", uiTotal);

  // 3. Compare both values
  if (total === uiTotal) {
    console.log("✅ Total matches!");
  } else {
    console.error("❌ Total does NOT match!");
  }

  await page.locator(".totalRow button").click();

  // Assert the checkout page has the correct product name
  await page.waitForSelector(".details__item");

  const checkoutProductName = await page
    .locator(".item__details .item__title")
    .textContent();
  expect(checkoutProductName).toBe(" ADIDAS ORIGINAL ");

  // fill in the values in the checkout form
  await page.locator("text=CVV Code >> .. >> input").fill("123");
  await page.locator("text=Name on Card >> .. >> input").fill("Arthur Morgan");
  await page
    .locator("text=Card Number >> .. >> input")
    .fill("1234567890123456");

  await page.locator("[placeholder*='Country']").pressSequentially("Pa");
  const dropdown = page.locator(".ta-results");

  await dropdown.waitFor();
  const optionsCount = await dropdown.locator("button").count();
  for (let i = 0; i < optionsCount; ++i) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text === " Pakistan") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }
  await page.locator(".action__submit").click();

  //Get the order ID from the confirmation page
  await page.waitForSelector(".em-spacer-1 .ng-star-inserted");
  const orderId = (
    (await page.textContent(".em-spacer-1 .ng-star-inserted")) || ""
  )
    .replace(/\|/g, "")
    .trim();

  console.log("Order ID:", orderId);

  // Click the ORDERS button (not the label)
  await page.getByRole("button", { name: /ORDERS/i }).click();
  console.log("Clicked on ORDERS button");

  // Wait for the orders table to be visible
  await page.waitForSelector("table.table");
  console.log("Orders table is visible");

  // Select all Order ID cells (they are <th scope="row"> inside <tbody>)
  const orderIdColumn = await page.locator('table.table tbody th[scope="row"]');
  await page.waitForSelector('table.table tbody th[scope="row"]');
  // Get the count of Order ID rows
  const orderIdCount = await orderIdColumn.count();
  console.log("Order ID count:", orderIdCount);

  // Find the row with the matching order ID and click View
  for (let i = 0; i < orderIdCount; ++i) {
    const orderIdCell = await orderIdColumn.nth(i).textContent();
    console.log("Comparing:", orderIdCell?.trim(), "with", orderId?.trim()); // <-- Place here
    if (orderIdCell?.trim() === orderId?.trim()) {
      await page.locator("table.table tbody tr").nth(i).locator("button.btn-primary").click();
      console.log(`Order ID is found on row ${i + 1}:`, orderIdCell?.trim());
      break;
    }
  }

  //Verify the View page shows the successful message and order ID
  const viewTitle = await page.locator(".email-title").textContent();
  expect(viewTitle).toBe(" order summary ");

});
