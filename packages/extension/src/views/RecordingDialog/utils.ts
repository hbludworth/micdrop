import Vue from 'vue';
import vuetify from '../../plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';
import BasePlayback from '../Playback/BasePlayback.vue';
import ImagePlaceholderObserver from '@/utils/contentObservers/ImagePlaceholderObserver';
import axios from 'axios';

const insertImagePlaceholder = (composeBoxElement: Element, uuid: string) => {
  const inputArea = composeBoxElement.querySelector('.LW-avf');

  if (composeBoxElement.querySelector('#image-placeholder')) {
    const existingPlaceholder =
      composeBoxElement.querySelector('#image-placeholder');
    existingPlaceholder?.remove();
  }

  const div = document.createElement('div');
  div.id = 'image-placeholder';
  div.hidden = true;

  const previewMessage = document.createElement('span');
  previewMessage.id = 'preview-message';
  previewMessage.style.display = 'none';
  previewMessage.innerHTML =
    "You've received a MicDrop audio message. Play now!" +
    '&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;';
  div.appendChild(previewMessage);

  const link = document.createElement('a');
  link.id = 'placeholder-img-link';
  link.href =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:8080/playback/${uuid}`
      : `https://www.sendmicdrop.com/playback/${uuid}`;
  link.target = '_blank';

  const image = document.createElement('img');
  image.id = 'placeholder-img-file';
  image.src =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8081/api/v1/image/placeholder-v2.png'
      : 'https://www.sendmicdrop.com/api/v1/image/placeholder-v2.png';
  image.width = 400;

  link.appendChild(image);

  div.appendChild(link);

  const uuidPlaceholder = document.createElement('span');
  uuidPlaceholder.id = 'audio-uuid';
  uuidPlaceholder.style.display = 'none';
  uuidPlaceholder.innerHTML = uuid;

  div.appendChild(uuidPlaceholder);

  inputArea?.appendChild(div);
};

const insertPlaybackBox = (
  composeBoxElement: Element,
  composeBoxIndex: number,
  uuid: string,
  audioUrl: string,
  imagePlaceholderObserver: ImagePlaceholderObserver
) => {
  const tbody = composeBoxElement.children.item(0);
  const tr = tbody?.children.item(0);

  const playbackRow = document.createElement('tr');
  playbackRow.classList.add('playback-row');
  const playbackData = document.createElement('td');
  playbackRow.appendChild(playbackData);

  const insertionDiv = document.createElement('div');
  insertionDiv.id = `emailContent-${composeBoxIndex}`;
  playbackData.appendChild(insertionDiv);

  tr?.insertAdjacentElement('beforebegin', playbackRow);

  Vue.use(VueCompositionApi);
  new Vue({
    vuetify,
    render: (h) =>
      h(BasePlayback, {
        props: {
          audioUrl,
          uuid,
          includeCenteredRow: true,
          showRemoveButton: true,
        },
        on: {
          remove: async () =>
            await removeRecording(
              composeBoxElement,
              uuid,
              imagePlaceholderObserver
            ),
        },
      }),
  }).$mount(`#emailContent-${composeBoxIndex}`);
};

const removeRecording = async (
  composeBoxElement: Element,
  uuid: string,
  imagePlaceholderObserver: ImagePlaceholderObserver
) => {
  composeBoxElement.querySelector('tr.playback-row')?.remove();
  imagePlaceholderObserver.disconnectObserver();
  composeBoxElement.querySelector('#image-placeholder')?.remove();

  const url =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:8081/api/v1/audio/${uuid}`
      : `https://www.sendmicdrop.com/api/v1/audio/${uuid}`;
  await axios.delete(url);
};

export { insertImagePlaceholder, insertPlaybackBox };
