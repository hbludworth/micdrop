import { NavigationGuard } from 'vue-router';
import sl from '../serviceLocator';

const freeGuard: NavigationGuard = (_to, _from, next) => {
  const store = sl.get('store');

  if (!store.getters.user) {
    next('/'); // FIXME create forbidden view
  } else if (store.getters.user.subscriptionLevel !== 'free') {
    next('/'); // FIXME create forbidden view
  } else {
    next();
  }
};

export default freeGuard;
