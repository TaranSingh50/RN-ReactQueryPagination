import axios from "axios";

export const apiClient = axios.create({
    baseURL: 'https://dummyjson.com',
    headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});