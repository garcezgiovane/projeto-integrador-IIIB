import axios from "axios";

const api = axios.create({
  baseURL: "https://whatevertechapi.azurewebsites.net/api",
});

export default api;
