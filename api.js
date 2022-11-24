import axios from "axios";
// const positive = ["King", "Man"];
// const negative = ["queen"];
export const postWordToModel = (arr) => {
  const positive = [];
  const negative = ["tea"];
  arr.forEach((word) => {
    console.log(word[0], "<<< wordzero");
    if (word[1] > 0) {
      word[0] = word[0].split("+")[0];
      positive.push(word[0].toLowerCase());
    }
    // if (word[1] < 0) {
    //   negative.push(word[0].toLowerCase());
    // }
  });

  return axios
    .post("https://slh-keyword-api.herokuapp.com/model", {
      positive: positive.slice(0, 1),
      negative: negative.slice(0, 1),
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
  console.log(keywords, "<<<<<<<<< keywords");
  return axios
    .get(
      `https://nc-ebay-api.herokuapp.com/api/ebayCall?keyword=${searchQuery}`
    )
    .then(({ data: { items } }) => {
      const itemsToReturn = items.slice(0, 4).map((item) => {
        item.keyword = item.categories[0].categoryName
          .replace(/[^a-zA-Z\s]+/g, "")
          .replace(/\s+/g, "+");
        return item;
      });
      return itemsToReturn;
    })
    .catch((err) => console.log(err));
};
