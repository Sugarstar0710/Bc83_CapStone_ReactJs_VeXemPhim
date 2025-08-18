import { BASE_URL_API, TOKEN_CYBERSOFT } from "@/constants/config";
import axios from "axios";

const fetcher = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    TokenCybersoft: TOKEN_CYBERSOFT,
  },
});

fetcher.interceptors.request.use((config) => {
  // console.log("Request Config:", config); // Commented out to reduce logs
  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).accessToken : null;
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export default fetcher;
