import axios from 'axios';
import store from './store';
import actions from './globalActions';

const host =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : '';

const axiosInstance = axios.create({
  baseURL: `${host}/api/v1`,
});

//FIXME add receptors

export default axiosInstance;
