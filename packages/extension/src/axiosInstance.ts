import axios from 'axios';
import store from 'frontend/src/store';
import actions from 'frontend/src/globalActions';

const host =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8081'
    : 'https://sendmicdrop.com';

const axiosInstance = axios.create({
  baseURL: `${host}/api/v1`,
});

//FIXME add receptors

export default axiosInstance;
