import Vue from 'vue';
import VueCompositionAPI, { reactive } from '@vue/composition-api';
import { User } from 'types';
import firebase from '../firebase';

Vue.use(VueCompositionAPI);

export interface State {
  user: null | User;
  idToken: string | null;
}

const state: State = reactive({
  user: null,
  idToken: null,
});

export default {
  setUser: (user: User) => {
    state.user = user;
  },
  setToken: (token: Pick<firebase.auth.IdTokenResult, 'token'>) => {
    state.idToken = token.token;
  },
  logout: () => {
    state.user = null;
    state.idToken = null;
  },
  getters: {
    get isAuthenticated() {
      return !!state.user;
    },
    get user() {
      return state.user;
    },
    get idToken() {
      return state.idToken;
    },
  },
};
