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
import Upgrade from '../views/AccountDashboard/components/Upgrade.vue';
import SubscriptionConfirmation from '../views/AccountDashboard/SubscriptionConfirmation.vue';
import PastDueWarning from '../views/AccountDashboard/components/PastDueWarning.vue';
import authenticatedGuard from '../navigationGuards/authenticatedGuard';
import proGuard from '../navigationGuards/proGuard';
import freeGuard from '@/navigationGuards/freeGuard';

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
    props: (route) => ({
      ignorePastDue: route.query.ignore_past_due === 'true' ? true : false,
    }),
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
  // FIXME Swap in Ext update
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
    beforeEnter: proGuard,
  },
  {
    path: '/extension/manage_audio/:uuid',
    name: 'ManageAudio',
    component: ManageAudio,
    props: (route) => ({
      uuid: route.params.uuid,
      sourceGroupUuid: route.query.sourceGroupUuid || undefined,
    }),
    beforeEnter: proGuard,
  },
  {
    path: '/subscription_confirmation',
    name: 'SubscriptionConfirmation',
    component: SubscriptionConfirmation,
    props: (route) => ({
      setupIntent: route.query.setup_intent as string,
      setupIntentClientSecret: route.query.setup_intent_client_secret as string,
    }),
    beforeEnter: authenticatedGuard,
  },
  {
    path: '/upgrade',
    name: 'Upgrade',
    component: Upgrade,
    beforeEnter: freeGuard,
  },
  {
    path: '/past_due_warning',
    name: 'PastDueWarning',
    component: PastDueWarning,
    beforeEnter: authenticatedGuard,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
