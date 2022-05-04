import Vue from 'vue';
import ComposeBoxesObserver from '../utils/contentObservers/ComposeBoxesObserver';
import ReceiversObserver from '../utils/contentObservers/ReceiversObserver';

Vue.config.productionTip = false;

const composeBoxesObserver = new ComposeBoxesObserver();
composeBoxesObserver.observeComposeBoxes();

const receiversObserver = new ReceiversObserver();
receiversObserver.observeReceiver();
