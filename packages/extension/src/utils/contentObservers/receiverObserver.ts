import Vue from 'vue';
import BasePlayback from '../../views/Playback/BasePlayback.vue';
import vuetify from '../../plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';

class ReceiverObserver {
  private receiverObserver = new MutationObserver(() => {
    const allReceievedEmails = document.querySelectorAll('div.a3s.aiL');
    allReceievedEmails.forEach((receivedEmail, index) => {
      if (
        receivedEmail.querySelector(`[id*="image-placeholder"]`) &&
        !receivedEmail.querySelector(`[id*="playback-insertion-point"]`)
      ) {
        this.receiverObserver.disconnect();
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
        this.observeReceiver();
      }
    });
  });

  public observeReceiver = (): void => {
    this.receiverObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };
}

export default ReceiverObserver;
