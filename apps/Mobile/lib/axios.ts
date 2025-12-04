import axios from 'axios';
import { authClient } from '@/lib/auth-client'

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Credentials': true,
  }
});

// Interceptor para agregar las cookies en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const cookies = authClient.getCookie();
    if (cookies) {
      config.headers['Cookie'] = cookies;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data.payload);

export default axiosInstance;