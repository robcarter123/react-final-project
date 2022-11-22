import axios from "axios";
const positive = ["King", "Man"];
const negative = ["queen"];
export const postWordToModel = (pos, neg) => {
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

export const fetchItemsFromEbay = (keywords) => {
  const searchQuery = keywords
    .slice(0, 4)
    .map((nestedArray) => {
      return nestedArray[0];
    })
    .join(" ");
  console.log(searchQuery, "in api");
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
fetchItemsFromEbay([]);

// module.exports = { postWordToModel, fetchItemsFromEbay };
