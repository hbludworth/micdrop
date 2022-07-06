import Vue from 'vue';
import ComposeBoxesObserver from '../utils/contentObservers/ComposeBoxesObserver';
import ReceiversObserver from '../utils/contentObservers/ReceiversObserver';
import sl from 'frontend/src/serviceLocator';
import server from 'frontend/src/serverProxy';
import actions from 'frontend/src/globalActions';
import store from 'frontend/src/store';
import setupDialog from '../utils/setupDialog';

sl.set('serverProxy', server);
sl.set('globalActions', actions);
sl.set('store', store);

Vue.config.productionTip = false;

setupDialog();

const composeBoxesObserver = new ComposeBoxesObserver();
composeBoxesObserver.observeComposeBoxes();

const receiversObserver = new ReceiversObserver();
receiversObserver.observeReceiver();
