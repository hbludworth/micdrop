import Vue from 'vue';
import PlaybackFrame from '../../views/PlaybackFrame/PlaybackFrame.vue';
import vuetify from '../../plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';
import sl from 'frontend/src/serviceLocator';

class ReceiversObserver {
  private receiversObserver = new MutationObserver(() => {
    const actions = sl.get('globalActions');

    const allReceievedEmails = document.querySelectorAll('div.a3s.aiL');
    allReceievedEmails.forEach(async (receivedEmail, index) => {
      if (
        receivedEmail.querySelector(`[id*="image-placeholder"]`) &&
        !receivedEmail.querySelector(`[id*="playback-insertion-point"]`)
      ) {
        this.receiversObserver.disconnect();
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

        if (!uuid) {
          actions.showErrorSnackbar(
            'This audio email has been corrupted. Contact us for help.'
          );
          return;
        }

        Vue.use(VueCompositionApi);
        new Vue({
          vuetify,
          render: (h) =>
            h(PlaybackFrame, {
              props: {
                uuid,
              },
            }),
        }).$mount(`#emailInsertion-${index}`);
        this.observeReceiver();
      }
    });
  });

  public observeReceiver = (): void => {
    this.receiversObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };
}

export default ReceiversObserver;
