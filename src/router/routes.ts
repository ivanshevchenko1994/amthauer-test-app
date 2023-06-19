import {RouteRecordRaw} from 'vue-router';
import {RouteNames, RoutePaths,} from 'src/constants/routes';

const MainLayout = () => import('src/layouts/MainLayout.vue');

const LoginLayout = () => import('src/layouts/LoginLayout.vue');

export const routes: Array<RouteRecordRaw> = [
  {
    path: RoutePaths.root,
    name: RouteNames.root,
    redirect: RoutePaths.dashboard,
  },
  {
    path: RoutePaths.login,
    name: RouteNames.login,
    component: LoginLayout,
    children: [
      {
        path: RoutePaths.login,
        component: () => import('src/pages/auth/LoginPage.vue'),
      },
    ],
  },
  {
    path: RoutePaths.dashboard,
    name: RouteNames.dashboard,
    component: MainLayout,
    children: [
      {
        path: RoutePaths.dashboard,
        component: () => import('src/pages/DashboardPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: RoutePaths.logout,
    name: RouteNames.logout,
    component: MainLayout,
    children: [
      {
        path: RoutePaths.logout,
        component: () => import('src/pages/auth/LogoutPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: RoutePaths.amthauerMain,
    name: RouteNames.amthauerMain,
    component: MainLayout,
    children: [
      {
        path: RoutePaths.amthauerMain,
        component: () => import('src/pages/amthauer/AmthauerTestPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: RoutePaths.testing,
        component: () => import('src/pages/amthauer/TestingPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: RoutePaths.participantCreate,
        component: () => import('src/pages/amthauer/ParticipantPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: RoutePaths.amthauerTest,
    name: RouteNames.amthauerTest,
    component: MainLayout,
    children: [
      {
        path: RoutePaths.amthauerTest,
        component: () => import('src/pages/amthauer/AmthauerTestPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];
