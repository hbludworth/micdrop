import Vue from 'vue';
import ComposeBoxObserver from '../utils/contentObservers/ComposeBoxObserver';
import ReceiverObserver from '../utils/contentObservers/ReceiverObserver';

Vue.config.productionTip = false;

const composeBoxObserver = new ComposeBoxObserver();
composeBoxObserver.observeComposeBoxes();

const receiverObserver = new ReceiverObserver();
receiverObserver.observeReceiver();
