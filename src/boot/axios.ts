import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import { useAuthStore } from 'src/stores/auth-store';
import {Notify} from 'quasar';
import {useRouter} from 'vue-router';
import {RoutePaths} from "src/constants/routes";


const router = useRouter();

const api = axios.create({
  baseURL: 'https://backend-amthauer.webware-kassel.de',
  // baseURL: 'http://localhost:8078',
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
      console.log('--------------CONFIG------------------', error)
      console.log('--------------isRefreshing------------------', isRefreshing)

      const originalRequest: InternalAxiosRequestConfig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;
        Notify.create({
          color: 'negative',
          message: 'Имя пользователя или пароль неверные'
        });
        console.log('++++++++++++REFRESH TOKEN777 +++++++++++++');
        await authStore.refreshTokens();
        try {

          console.log('++++++++++++REFRESH TOKEN1 +++++++++++++');
          const accessToken = authStore.accessToken;
          if (accessToken) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api.request(originalRequest);
          }
        } catch (e: any) {
          console.log('++++++++++++REFRESH TOKEN )))))))))))))))))))+++++++++++++');
          console.log('Failed to refresh access token:', e);

          // await router.push(RoutePaths.login);

        } finally {
          isRefreshing = false;
          console.log('--------------QUEU------------------')
          console.log(refreshQueue)
          console.log('--------------QUEU------------------')
          refreshQueue.forEach((resolve) => resolve());
          refreshQueue = [];
        }
        console.log('++++++++++++REFRESH TOKEN )))))))))))))))))))+++++++++++++');
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
