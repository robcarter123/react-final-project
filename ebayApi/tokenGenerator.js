require("dotenv").config();
const EbayAuthToken = require("ebay-oauth-nodejs-client");

const ebayAuthToken = new EbayAuthToken({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  env: "SANDBOX",
  redirectUri: process.env.redirectUri
});

// const scopes = [
//   "https://api.ebay.com/oauth/api_scope",
//   "https://api.ebay.com/oauth/api_scope/buy.item.bulk"
// ];

const clientScope = "https://api.ebay.com/oauth/api_scope";

const tokenGenerator = () => {
  return ebayAuthToken
    .getApplicationToken("SANDBOX", clientScope)
    .then(data => {
      authToken = JSON.parse(data).access_token;
      return authToken;
    })
    .catch(error => {
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });
};
// // Authorization Code Auth Flow

//ebayAuthToken.generateUserAuthorizationUrl("PRODUCTION", scopes);

// get user consent url.
// Using user consent url, you will be able to generate the code which you can use it for exchangeCodeForAccessToken.
// Also accepts optional values: prompt, state
//ebayAuthToken.generateUserAuthorizationUrl('SANDBOX', scopes, { prompt: 'login', state: 'custom-state-value' });

// // Exchange Code for Authorization token
// ebayAuthToken.exchangeCodeForAccessToken('SANDBOX', code).then((data) => { // eslint-disable-line no-undef
//     console.log(data);
// }).catch((error) => {
//     console.log(error);
//     console.log(`Error to get Access token :${JSON.stringify(error)}`);
// });

// // // Getting access token from refresh token obtained from Authorization Code flow
// const refreshToken = 'v^1.1#i^1#r^1#f^0#I^3#p^3#t^Ul4xMF8yOjNDMjU1MUI0OTJBMDg5NUZGMUY4RkEwNjk1MDRBQjQ2XzNfMSNFXjI2MA==';
// ebayAuthToken.getAccessToken('PRODUCTION', refreshToken, scopes).then((data) => {
//     console.log(data);
// }).catch((error) => {
//     console.log(`Error to get Access token from refresh token:${JSON.stringify(error)}`);
// });

module.exports = { tokenGenerator };
