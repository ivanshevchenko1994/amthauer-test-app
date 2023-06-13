import {defineStore} from 'pinia';
import {api} from 'boot/axios';
import {handleError} from 'src/utils/error-handle';
import {Router} from 'vue-router';
import {IUser} from 'components/auth/interfaces/IUser';

interface IAuthState {
  accessToken: string;
  refreshToken: string;
  userId: number | null;
  user: IUser;
  router: Router | null; // Add router property to the interface
}

const initUser: IUser = {
  email: null,
  firstName: null,
  lastName: null,
  permissions: []
}


export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    accessToken: '',
    refreshToken: '',
    userId: null,
    user: initUser,
    router: null,
  }),
  getters: {
    isAuthenticated(state): boolean {
      return !!state.userId;
    },
  },
  actions: {
    async fetchUser(): Promise<void> {
      try {
        const response = await api.get<IUser>('/api/v1/auth/user');
        this.user = response.data;
      } catch (error: any) {
        await handleError(error, this);
      }
    },

    async login(email: string, password: string): Promise<void> {
      try {
        const response = await api.post<{
          access_token: string;
          refresh_token: string;
          user_id: number;
        }>('/api/v1/auth/login', {
          email,
          password,
        });
        console.log('response.data', response.data)
        this.accessToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        this.userId = response.data.user_id;
        await this.fetchUser();
      } catch (error: any) {
        await handleError(error, this);
        throw new Error('Invalid email or password');
      }
    },

    async refreshTokens(): Promise<void> {
      try {
        const response = await api.post<{
          access_token: string;
          refresh_token: string;
          user_id: number;
        }>('/api/v1/auth/refresh_token', {
          refresh_token: this.refreshToken,
        });
        this.accessToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        this.userId = response.data.user_id;
      } catch (error: any) {
        await handleError(error, this);
      }
    },

    logout: async function (): Promise<void> {
      try {
        await api.post('/api/v1/auth/logout');
        this.clearAuthData();
      } catch (error: any) {
        this.clearAuthData();
        await handleError(error, this);
        throw new Error('Failed to logout');
      }
    },

    clearAuthData() {
      this.accessToken = '';
      this.refreshToken = '';
      this.userId = null;
      this.user = initUser;
      delete api.defaults.headers.common['Authorization'];
    },

  },
  persist: {
    paths: ['accessToken', 'refreshToken', 'userId', 'user', 'plant'],
  }
});
