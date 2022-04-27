import Vue from 'vue';
import MicDropButton from '../components/MicDropButton.vue';
import BasePlayback from '../components/BasePlayback.vue';
import vuetify from '../plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';

Vue.config.productionTip = false;

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
          h(MicDropButton, {
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
observeComposeBoxes();

const receiverObserver = new MutationObserver(() => {
  const allReceievedEmails = document.querySelectorAll('div.a3s.aiL');
  allReceievedEmails.forEach((receivedEmail, index) => {
    if (
      receivedEmail.querySelector(`[id*="image-placeholder"]`) &&
      !receivedEmail.querySelector(`[id*="playback-insertion-point"]`)
    ) {
      receiverObserver.disconnect();
      const newNode = document.createElement('div');
      newNode.id = `emailInsertion-${index}`;

      const imagePlaceholder = receivedEmail.querySelector(
        `[id*="image-placeholder"]`
      );

      const rawUuid =
        receivedEmail.querySelector(`[id*="audio-uuid"]`)?.innerHTML;
      const uuid = rawUuid?.replaceAll('<wbr>', '');

      if (imagePlaceholder) {
        while (imagePlaceholder.firstChild) {
          imagePlaceholder.removeChild(imagePlaceholder.firstChild);
        }
        imagePlaceholder.appendChild(newNode);
      }

      Vue.use(VueCompositionApi);
      new Vue({
        vuetify,
        render: (h) =>
          h(BasePlayback, {
            props: {
              audioUrl:
                process.env.NODE_ENV === 'development'
                  ? `http://localhost:8081/api/v1/audio/${uuid}`
                  : `https://www.sendmicdrop.com/api/v1/audio/${uuid}`,
            },
          }),
      }).$mount(`#emailInsertion-${index}`);
      observeReceiver();
    }
  });
});

const observeReceiver = () => {
  receiverObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
observeReceiver();
