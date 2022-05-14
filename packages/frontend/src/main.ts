import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';
import sl from './serviceLocator';
import server from './serverProxy';
import globalActions from './globalActions';
import store from './store';

sl.set('serverProxy', server);
sl.set('globalActions', globalActions);
sl.set('store', store);
sl.set('router', router);

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
