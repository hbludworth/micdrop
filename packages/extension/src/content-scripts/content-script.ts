import Vue from 'vue';
import MicDropButton from '../components/MicDropButton.vue';
import BasePlayback from '../components/BasePlayback.vue';
import vuetify from '../plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';

Vue.config.productionTip = false;

const microphoneObserver = new MutationObserver(() => {
  if (
    document.querySelector('td.gU.Up') &&
    !document.querySelector('div.mic-button')
  ) {
    microphoneObserver.disconnect();
    const newNode = document.createElement('div');
    newNode.id = 'newButton';

    const sendButton = document.querySelector('td.gU.Up');
    sendButton?.insertAdjacentElement('afterend', newNode);

    Vue.use(VueCompositionApi);
    new Vue({
      vuetify,
      render: (h) => h(MicDropButton),
    }).$mount('#newButton');
    observeMicrophone();
  }
});

const observeMicrophone = () => {
  microphoneObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
observeMicrophone();

const receiverObserver = new MutationObserver(() => {
  if (
    document.querySelector('div.a3s.aiL') &&
    document.querySelector(`[id*="image-placeholder"]`) &&
    !document.querySelector(`[id*="playback-insertion-point"]`)
  ) {
    receiverObserver.disconnect();
    const newNode = document.createElement('div');
    newNode.id = 'emailInsertion';

    const imagePlaceholder = document.querySelector(
      `[id*="image-placeholder"]`
    );

    const rawUuid = document.querySelector(`[id*="audio-uuid"]`)?.innerHTML;
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
    }).$mount('#emailInsertion');
    observeReceiver();
  }
});

const observeReceiver = () => {
  receiverObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
observeReceiver();
