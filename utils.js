import axios from "axios";

const myApi = axios.create({
  baseURL: `https://nc-ebay-api.herokuapp.com/api`
});

export const fetchUsers = () => {
  return myApi.get(`/users`).then(res => {
    return res.data.users;
  });
};
