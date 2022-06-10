import { NavigationGuard } from 'vue-router';
import sl from '../serviceLocator';

const authenticatedGuard: NavigationGuard = (to, _from, next) => {
  const store = sl.get('store');

  if (!store.getters.isAuthenticated) {
    if (to.path === '/record') {
      next('/extension/get_started_screen?detailed=true');
    } else if (to.path === '/extension/popup') {
      next('/extension/get_started_screen?detailed=false');
    } else {
      next('/login');
    }
  } else {
    next();
  }
};

export default authenticatedGuard;
