import { RouteLocationNormalized, Router } from 'vue-router';

export function navigate(routePath: string, route: RouteLocationNormalized, router: Router): void {
  if (route.path !== routePath) {
    router.push(routePath).catch((error: any) => {
      if (error.name !== 'NavigationDuplicated') {
        throw error;
      }
    });
  }
}
