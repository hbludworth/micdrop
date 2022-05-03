import Vue from 'vue';
import observeComposeBoxes from '../utils/contentObservers/composeBoxObserver';
import observeReceiver from '../utils/contentObservers/receiverObserver';

Vue.config.productionTip = false;

observeComposeBoxes();
observeReceiver();
