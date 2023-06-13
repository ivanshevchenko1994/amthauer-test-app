import {route} from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  Router,
  RouteLocationNormalized, NavigationGuardNext,
} from 'vue-router';

import {routes} from './routes';
import {useAuthStore} from 'src/stores/auth-store';
import {RoutePaths} from 'src/constants/routes';
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export const router = route<() => Promise<Router>>(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });


  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {

    const authStore = useAuthStore();

    console.log('router_index.ts__authStore.isAuthenticated', authStore.isAuthenticated);

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      console.log('||||||||||||||||router.beforeEach LOGOUT||||||||||||||||||||');

      next({path: RoutePaths.login});
    } else {
      console.log('##################router.beforeEach NEXT####################');
      console.log(RoutePaths.login)
      console.log('************************************************************')
      next();
    }
  });

  return router;
});

export default router;
