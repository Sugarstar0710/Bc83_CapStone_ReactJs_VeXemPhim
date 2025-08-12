// src/services/http.js
import axios from "axios";

const http = axios.create({
  baseURL: "https://movienew.cybersoft.edu.vn",
  timeout: 15000,
});

// 👉 2 loại token
let _cyberToken = null;   // TokenCybersoft (từ .env)
let _accessToken = null;  // accessToken sau khi đăng nhập

export const setApiToken = (token) => { _cyberToken = token; };
export const setAccessToken = (accessToken) => { _accessToken = accessToken; };

http.interceptors.request.use((config) => {
  config.headers = { ...(config.headers || {}), Accept: "application/json" };
  if (_cyberToken)  config.headers.TokenCybersoft = _cyberToken;
  if (_accessToken) config.headers.Authorization = `Bearer ${_accessToken}`;
  return config;
});

export default http;
