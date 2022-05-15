import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';
import sl from './serviceLocator';
import server from './serverProxy';
import globalActions from './globalActions';
import store from './store';
import firebase from './firebase';

sl.set('serverProxy', server);
sl.set('globalActions', globalActions);
sl.set('store', store);
sl.set('router', router);

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);

let app: Vue;

firebase.auth().onIdTokenChanged(async (user) => {
  const { currentUser } = firebase.auth();

  if (currentUser && user && user.email && user.displayName) {
    const idTokenResult = await currentUser.getIdTokenResult();
    store.setToken(idTokenResult);

    try {
      const micdropUser = await server.getUser(currentUser.uid);
      store.setUser(micdropUser);
    } catch {
      globalActions.showErrorSnackbar(
        'Error authenticating. Please try again.'
      );
    }
  }
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
