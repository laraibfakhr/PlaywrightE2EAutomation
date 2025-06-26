import { expect } from "@playwright/test";

export async function getTokenfromAPI(request) {

const apiResponse = await request.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
    data: {
      userEmail: "laraib@gmail.com",
      userPassword: "Click123@"
    }
  });
  //Assert the response status is 200
  expect(apiResponse.status()).toBe(200);
  
  const body = await apiResponse.json();

    // Assert the response contains expected properties

  expect(body.message).toBe("Login Successfully");

  //Grab the access token from the response
 const ResponseToken = body.token;
  expect(ResponseToken).toBeDefined();
  console.log("Access Token:", ResponseToken);


  return ResponseToken;
}
