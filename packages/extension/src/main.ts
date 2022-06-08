import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import Vuetify from 'vuetify';
import VueCompositionApi from '@vue/composition-api';

Vue.use(Vuetify);
Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
