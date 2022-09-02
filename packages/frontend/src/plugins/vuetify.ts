import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#3a79d9',
        secondary: '#ffffff',
        accent: '#616D7D'
      },
    },
    options: { 
      customProperties: true
    }
  },
});
