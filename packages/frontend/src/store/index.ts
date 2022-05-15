import Vue from 'vue';
import VueCompositionAPI, { reactive } from '@vue/composition-api';
import { User } from 'types';
import firebase from '../firebase';

Vue.use(VueCompositionAPI);

export interface State {
  landed: boolean;
  user: null | User;
  idToken: string | null;
}

const state: State = reactive({
  landed: false,
  user: null,
  idToken: null,
});

export default {
  setUser: (user: User) => {
    state.user = user;
  },
  setLanded: (landed: boolean) => {
    state.landed = landed;
  },
  setToken: (token: Pick<firebase.auth.IdTokenResult, 'token'>) => {
    state.idToken = token.token;
  },
  logout: () => {
    state.user = null;
    state.idToken = null;
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
    get idToken() {
      return state.idToken;
    },
  },
};
