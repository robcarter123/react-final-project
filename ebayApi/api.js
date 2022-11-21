const axios = require("axios");
const { tokenGenerator } = require("./tokenGenerator");

tokenGenerator()
  .then(data => {
    const config = {
      headers: { Authorization: `Bearer ${data}` }
    };

    return axios.get(
      "https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=electronics",
      config
    );
  })
  .then(({ data }) => {
    console.log(data);
  });