import axios from 'axios';
import store from './store';
import actions from './globalActions';
import firebase from './firebase';

const host =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : '';

const axiosInstance = axios.create({
  baseURL: `${host}/api/v1`,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (
      error.config &&
      error.response &&
      error.response.status === 401 &&
      !error.config.isRefreshing
    ) {
      error.config.isRefreshing = true;
      const { currentUser } = firebase.auth();

      if (currentUser) {
        try {
          const idTokenResult = await currentUser.getIdTokenResult(true);
          store.setToken(idTokenResult);
        } catch (err) {
          actions.showErrorSnackbar(
            'Error refreshing authentication token. Please try again.'
          );
        }
      }

      return axiosInstance(error.config);
    }

    throw error;
  }
);

axiosInstance.interceptors.request.use((config) => {
  if (
    store.getters.idToken &&
    (config.url?.startsWith('/users/') || store.getters.user) &&
    config.headers
  ) {
    config.headers.Authorization = store.getters.idToken;
  }
  return config;
});

export default axiosInstance;
