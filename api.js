const axios = require("axios");
const positive = ["King", "Man"];
const negative = ["queen"];
const postWordToModel = (pos, neg) => {
  const positive = pos.map((word) => word.toLowerCase());
  const negative = neg.map((word) => word.toLowerCase());
  axios
    .post("https://flask-keyword-api.herokuapp.com/model", {
      positive,
      negative,
    })
    .then(({ data }) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.log(err));
};
// postModeledWord(positive, negative);

const fetchItemsFromEbay = (keywords) => {
  const searchQuery = keywords
    .slice(0, 4)
    .map((nestedArray) => {
      return nestedArray[0];
    })
    .join(" ");

  return axios
    .get(
      `https://nc-ebay-api.herokuapp.com/api/ebayCall?keyword=${searchQuery}`
    )
    .then(({ data }) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.log(err));
};
// fetchItemsFromEbay(keywords);

module.exports = { postWordToModel, fetchItemsFromEbay };
