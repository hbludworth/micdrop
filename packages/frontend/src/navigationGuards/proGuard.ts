import { NavigationGuard } from 'vue-router';
import sl from '../serviceLocator';

const proGuard: NavigationGuard = (to, from, next) => {
  const store = sl.get('store');

  if (!store.getters.user) {
    next('/'); // FIXME create forbidden view
  } else if (store.getters.user.subscriptionLevel !== 'pro') {
    next('/'); // FIXME create forbidden view
  } else {
    next();
  }
};

export default proGuard;
