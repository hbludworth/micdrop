import Vue from 'vue';
import MicButton from '../../views/MicButton/MicButton.vue';
import vuetify from '../../plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';

const composeBoxObserver = new MutationObserver(() => {
  const allComposeBoxes = document.querySelectorAll('tr.btC');
  allComposeBoxes.forEach((composeBox, index) => {
    if (!composeBox.querySelector('div.mic-button')) {
      composeBoxObserver.disconnect();
      const newNode = document.createElement('div');
      newNode.id = `newButton-${index}`;

      const sendButton = composeBox.querySelector('td.gU.Up');
      sendButton?.insertAdjacentElement('afterend', newNode);

      Vue.use(VueCompositionApi);
      new Vue({
        vuetify,
        render: (h) =>
          h(MicButton, {
            props: {
              composeBoxElement: composeBox.closest('.iN'),
              composeBoxIndex: index,
            },
          }),
      }).$mount(`#newButton-${index}`);
      observeComposeBoxes();
    }
  });
});

const observeComposeBoxes = () => {
  composeBoxObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

export default observeComposeBoxes;
