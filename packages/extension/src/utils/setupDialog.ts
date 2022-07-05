import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import vuetify from '../plugins/vuetify';
import RecordingDialog from '../views/RecordingDialog/RecordingDialog.vue';

const setupDialog = () => {
  const dialogNode = document.createElement('div');
  dialogNode.id = 'micdrop-dialog-node';

  document.body.lastChild?.after(dialogNode);

  Vue.use(VueCompositionApi);
  new Vue({
    vuetify,
    render: (h) => h(RecordingDialog),
  }).$mount('#micdrop-dialog-node');
};

export default setupDialog;
