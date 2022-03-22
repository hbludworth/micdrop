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
    document.querySelector(`[id*="playback-insertion-point"]`) &&
    !document.querySelector('div.playback-insertion-point')
  ) {
    receiverObserver.disconnect();
    const newNode = document.createElement('div');
    newNode.id = 'emailInsertion';

    const playback = document.querySelector(`[id*="playback-insertion-point"]`);

    const rawUuid = document.querySelector(`[id*="audio-uuid"]`)?.innerHTML;
    const uuid = rawUuid?.replaceAll('<wbr>', '');

    if (playback) {
      while (playback.firstChild) {
        playback.removeChild(playback.firstChild);
      }
      playback.appendChild(newNode);
    }

    Vue.use(VueCompositionApi);
    new Vue({
      vuetify,
      render: (h) =>
        h(BasePlayback, {
          props: {
            audioUrl: `http://localhost:8081/api/v1/audio/${uuid}`,
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
