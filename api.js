import axios from "axios";
// const positive = ["King", "Man"];
// const negative = ["queen"];
export const postWordToModel = (pos, neg) => {
  console.log(pos, "pos");
  const positive = pos.map((word) => word[0].toLowerCase());
  const negative = neg.map((word) => word.toLowerCase());
  console.log(positive);
  console.log(negative);
  return axios
    .post("https://slh-keyword-api.herokuapp.com/model", {
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
  console.log(keywords, "<<< api keywords");
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
    .then(({ data: { items } }) => {
      const itemsToReturn = items.map((item) => {
        item.keyword = item.categories[0].categoryName
          .replace(/[^a-zA-Z\s]+/g, "")
          .replace(/\s+/g, "+");
        return item;
      });
      return itemsToReturn;
    })
    .catch((err) => console.log(err));
};

