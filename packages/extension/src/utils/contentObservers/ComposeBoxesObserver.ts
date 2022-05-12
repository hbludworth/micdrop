import Vue from 'vue';
import MicButton from '../../views/MicButton/MicButton.vue';
import vuetify from '../../plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';

class ComposeBoxesObserver {
  private composeBoxesObserver = new MutationObserver(() => {
    const allComposeBoxes = document.querySelectorAll('tr.btC');
    allComposeBoxes.forEach((composeBox, index) => {
      const composeBoxElement = composeBox.closest('.iN');
      if (
        !composeBox.querySelector('div.mic-button') &&
        !composeBoxElement?.querySelector('.playback-row')
      ) {
        this.composeBoxesObserver.disconnect();
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
                composeBoxElement,
                composeBoxIndex: index,
              },
            }),
        }).$mount(`#newButton-${index}`);
        this.observeComposeBoxes();
      } else if (
        composeBox.querySelector('div.mic-button') &&
        composeBoxElement?.querySelector('.playback-row')
      ) {
        composeBox.querySelector('div.mic-button')?.remove();
      }
    });
  });

  public observeComposeBoxes = (): void => {
    this.composeBoxesObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };
}

export default ComposeBoxesObserver;
