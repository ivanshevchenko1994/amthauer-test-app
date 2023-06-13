import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import { useAuthStore } from 'src/stores/auth-store';

const api = axios.create({
  baseURL: 'https://backend-amthauer.webware-kassel.de',
  timeout: 10000,
});

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

// Intercept all requests and attach Authorization header with access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Intercept all responses and refresh tokens if necessary
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const authStore = useAuthStore();

    console.log('--------------AXIOS ERROR CONFIG------------------')
    console.log(error)
    console.log('^^^^^^^^^^^^^^AXIOS ERROR CONFIG^^^^^^^^^^^^^^^^^^')

    if (error.response?.status === 401 && error.config) {
      console.log('--------------CONFIG------------------')
      const originalRequest: InternalAxiosRequestConfig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await authStore.refreshTokens();
          const accessToken = authStore.accessToken;
          if (accessToken) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api.request(originalRequest);
          }
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        } finally {
          isRefreshing = false;
          console.log('--------------QUEU------------------')
          console.log(refreshQueue)
          console.log('--------------QUEU------------------')
          refreshQueue.forEach((resolve) => resolve());
          refreshQueue = [];
        }
      } else {
        // Queue the request until the token refresh is complete
        return new Promise((resolve) => {
          refreshQueue.push(() => {
            const accessToken = authStore.accessToken;
            if (accessToken) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              resolve(api.request(originalRequest));
            } else {
              return Promise.reject(error);
            }
          });
        });
      }
    }
    throw error;
  }
);

export { api };
