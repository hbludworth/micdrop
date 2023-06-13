import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import PlaybackPage from '../views/PlaybackPage.vue';
import Login from '../views/Authentication/Login.vue';
import Register from '../views/Authentication/Register.vue';
import ResetPassword from '../views/Authentication/ResetPassword.vue';
import SendResetPasswordEmail from '../views/Authentication/SendResetPasswordEmail.vue';
import AccountDashboard from '../views/AccountDashboard/AccountDashboard.vue';
import RecordCard from '../views/Record/RecordCard.vue';
import BasePlayback from '../components/Playback/BasePlayback.vue';
import ExtensionPopup from '../views/ExtensionPages/Popup.vue';
import Tutorial from '../views/Tutorial/index.vue';
import Onboard from '../views/Tutorial/Onboard.vue';
import ExtensionGetStarted from '../views/ExtensionPages/ExtensionGetStarted.vue';
import PastRecordingsList from '../views/Record/PastRecordingsList.vue';
import ManageAudio from '../views/Record/ManageAudio.vue';
import LoginWithEmail from '../views/Authentication/LoginWithEmail.vue';
import authenticatedGuard from '../navigationGuards/authenticatedGuard';

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
    props: (route) => ({
      redirectURL: route.query.redirect || '/',
    }),
    component: Login,
  },
  {
    path: '/login_with_email',
    name: 'LoginWithEmail',
    props: (route) => ({
      redirectURL: route.query.redirect || '/',
    }),
    component: LoginWithEmail,
  },
  {
    path: '/register',
    name: 'Register',
    props: (route) => ({
      redirectURL: route.query.redirect || '/',
    }),
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
  {
    path: '/record',
    name: 'Record',
    component: RecordCard,
    beforeEnter: authenticatedGuard,
  },
  {
    path: '/base_playback/:uuid',
    name: 'BasePlayback',
    props: (route) => ({
      uuid: route.params.uuid,
      showRemoveButton: route.query.showRemove === 'true' ? true : false,
    }),
    component: BasePlayback,
  },
  {
    path: '/extension/popup',
    name: 'ExtensionPopup',
    component: ExtensionPopup,
    beforeEnter: authenticatedGuard,
  },
  {
    path: '/onboard',
    name: 'Onboard',
    component: Tutorial,
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    props: (route) => ({
      defaultStep: route.query.step ? Number(route.query.step) : 1,
    }),
    component: Onboard,
  },
  {
    path: '/extension/get_started_screen',
    name: 'ExtensionGetStartedScreen',
    props: (route) => ({
      detailed: route.query.detailed ? route.query.detailed === 'true' : false,
    }),
    component: ExtensionGetStarted,
  },
  {
    path: '/extension/past_recordings_list',
    name: 'PastRecordingsList',
    props: (route) => ({
      startingGroupUuid:
        route.query.startingGroupUuid &&
        route.query.startingGroupUuid !== 'undefined'
          ? (route.query.startingGroupUuid as string)
          : undefined,
    }),
    component: PastRecordingsList,
    beforeEnter: authenticatedGuard,
  },
  {
    path: '/extension/manage_audio/:uuid',
    name: 'ManageAudio',
    component: ManageAudio,
    props: (route) => ({
      uuid: route.params.uuid,
      sourceGroupUuid: route.query.sourceGroupUuid || undefined,
    }),
    beforeEnter: authenticatedGuard,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
