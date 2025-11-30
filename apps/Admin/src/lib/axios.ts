import axios from 'axios';
// import { authClient } from '@/lib/auth-client'

const API_URL = import.meta.env.VITE_API_URL;

// const cookies = authClient.getCookie()

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Credentials': true,
    // 'Cookie': cookies,
    'credentials': "omit"
  }
});

export const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data.payload);

export default axiosInstance;