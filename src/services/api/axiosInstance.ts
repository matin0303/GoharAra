import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getCookie, removeTokenOnCookies } from '@/lib/utils';

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getCookie('tk');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        const originalRequest = error.config;
        
        // Handle 401 - Unauthorized
        // if (error.response?.status === 401 && error.response?.data.message === 'ابتد وارد حساب خود شوید.' && originalRequest) {
        //   removeTokenOnCookies();
        //   if (typeof window !== 'undefined') {
        //     // window.location.href = '/login';
        //     return
        //   }
        // }
        
        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const httpClient = new HttpClient().getInstance();