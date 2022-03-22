import Vue from 'vue';
import MicDropButton from '../components/MicDropButton.vue';
import BasePlayback from '../components/BasePlayback.vue';
import vuetify from '../plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';

Vue.config.productionTip = false;

console.log('Hello from the content-script');

const microphoneObserver = new MutationObserver(() => {
  if (
    document.querySelector('td.gU.Up') &&
    !document.querySelector('div.mic-button')
  ) {
    console.log('inside');
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
    console.log('resposne inside');
    receiverObserver.disconnect();
    const newNode = document.createElement('div');
    newNode.id = 'emailInsertion';

    const playback = document.querySelector(`[id*="playback-insertion-point"]`);

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
            audioUrl:
              'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
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
