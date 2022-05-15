import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import PlaybackPage from '../views/PlaybackPage.vue';
import Login from '../views/Authentication/Login.vue';
import Register from '../views/Authentication/Register.vue';
import ResetPassword from '../views/Authentication/ResetPassword.vue';
import SendResetPasswordEmail from '../views/Authentication/SendResetPasswordEmail.vue';
import AccountDashboard from '../views/AccountDashboard/AccountDashboard.vue';
import authenticatedGuard from '@/navigationGuards/authenticatedGuard';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/playback/:uuid',
    name: 'PlaybackPage',
    component: PlaybackPage,
    props: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/reset_password',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/send_reset_password',
    name: 'SendResetPasswordEmail',
    component: SendResetPasswordEmail,
  },
  {
    path: '/account_dashboard',
    name: 'AccountDashboard',
    component: AccountDashboard,
    beforeEnter: authenticatedGuard,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
