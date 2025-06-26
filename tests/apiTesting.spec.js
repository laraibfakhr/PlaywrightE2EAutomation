import { test, expect } from "@playwright/test";

//Get and Post API Testing using Playwright



test.only("API POST Testing", async ({ request }) => {
  // Define the API endpoint and payload
  const response = await request.post("https://reqres.in/api/users", {
    data: {
      name: "Laraib",
      job: "QA Engineer"
    }
  });

  // Assert the response status is 201
  expect(response.status()).toBe(401);

  // Parse the JSON response
  const body = await response.json();

  // Assert the response contains expected properties
  expect(body).toHaveProperty("id");
  console.log(body.id);

  expect(body).toHaveProperty("name", payload.name);
  expect(body).toHaveProperty("job", payload.job);
  expect(body).toHaveProperty("createdAt");
  console.log(body.createdAt);
});

test("API GET Testing", async ({ request }) => {
  // Make a GET request to the API endpoint
  const response = await request.get("https://reqres.in/api/users/2");

  // Assert the response status is 200
  expect(response.status()).toBe(200);

  // Parse the JSON response
  const body = await response.json();

  // Assert the response contains expected properties
  expect(body).toHaveProperty("data");
  expect(body.data).toHaveProperty("id");
  expect(body.data).toHaveProperty("email");
  expect(body.data).toHaveProperty("first_name");
  expect(body.data).toHaveProperty("last_name");
  expect(body.data).toHaveProperty("avatar");
  expect(body).toHaveProperty("support");
  expect(body.support).toHaveProperty("url");
  expect(body.support).toHaveProperty("text");

  // Assert specific values in the response
  expect(body.data.id).toBe(2);
  expect(body.data.email).toBe("janet.weaver@reqres.in");
  expect(body.data.first_name).toBe("Janet");
  expect(body.data.last_name).toBe("Weaver");
  expect(body.data.avatar).toBe("https://reqres.in/img/faces/2-image.jpg");
  expect(body.support.url).toBe(
    "https://contentcaddy.io?utm_source=reqres&utm_medium=json&utm_campaign=referral"
  );
});
