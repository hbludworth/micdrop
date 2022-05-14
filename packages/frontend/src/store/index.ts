import Vue from 'vue';
import VueCompositionAPI, { reactive } from '@vue/composition-api';
import { User } from 'types';

Vue.use(VueCompositionAPI);

export interface State {
  landed: boolean;
  user: null | User;
}

const state: State = reactive({
  landed: false,
  user: null,
});

export default {
  setUser: (user: User) => {
    state.user = user;
  },
  setLanded: (landed: boolean) => {
    state.landed = landed;
  },
  logout: () => {
    state.user = null;
  },
  getters: {
    get landed() {
      return state.landed;
    },
    get isAuthenticated() {
      return !!state.user;
    },
    get user() {
      return state.user;
    },
  },
};
