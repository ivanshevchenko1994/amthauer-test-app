/* eslint-disable @typescript-eslint/no-explicit-any */
import {Notify} from 'quasar';
import {useAuthStore} from 'src/stores/auth-store';
import {AxiosError} from 'axios';
import {AuthStore} from 'components/auth/interfaces/AuthStore';
import {RoutePaths} from 'src/constants/routes';

interface CustomError extends Error {
  request?: any;
  response?: any;
}

export async function handleError(error: CustomError, authStore: AuthStore = useAuthStore()) {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    switch (status) {
      case 400:
        Notify.create({
          color: 'negative',
          message: 'Bad Request'
        });
        break;
      case 401:
        throw error; // Let axios interceptor handle token refreshing logic
      case 403:
        Notify.create({
          color: 'negative',
          message: 'Forbidden'
        });
        console.log('---------------FORBIDEN 403-------------')
        console.log(data)
        console.log('---------------FORBIDEN 403-------------')
        if (data && authStore.router) {
          if (data.detail === 'Invalid refresh token') {
            console.log('**********Invalid refresh token*********');
            authStore.clearAuthData();
            await authStore.router.push({path: RoutePaths.login});
          }
        }
        break;
      case 404:
        Notify.create({
          color: 'negative',
          message: 'Not Found'
        });
        break;
      case 500:
        Notify.create({
          color: 'negative',
          message: 'Server Error'
        });
        break;
      case 504:
        Notify.create({
          color: 'negative',
          message: 'Gateway Time-out'
        });
        await authStore.logout();
        break;
      default:
        Notify.create({
          color: 'negative',
          message: 'Unknown Error'
        });
        break;
    }
  } else if (error.request) {
    Notify.create({
      color: 'negative',
      message: 'Cannot connect to server'
    });
  } else {
    Notify.create({
      color: 'negative',
      message: error.message
    });
  }
}


function isAxiosError(error: any): error is AxiosError {
  return typeof error.response?.status === 'number';
}
