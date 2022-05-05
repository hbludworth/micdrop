import { insertImagePlaceholder } from '@/views/RecordingDialog/utils';

class ImagePlaceholderObserver {
  private composeBoxElement: Element;
  private uuid: string;

  constructor(composeBoxElement: Element, uuid: string) {
    this.composeBoxElement = composeBoxElement;
    this.uuid = uuid;
  }

  private contentObserver = new MutationObserver(() => {
    if (
      !this.composeBoxElement.querySelector('#image-placeholder') ||
      !this.composeBoxElement.querySelector('#preview-message') ||
      !this.composeBoxElement.querySelector('#placeholder-img-link') ||
      !this.composeBoxElement.querySelector('#placeholder-img-file') ||
      !this.composeBoxElement.querySelector('#audio-uuid')
    ) {
      this.contentObserver.disconnect();

      insertImagePlaceholder(this.composeBoxElement, this.uuid);

      this.observeContent();
    }
  });

  public observeContent = (): void => {
    this.contentObserver.observe(this.composeBoxElement, {
      childList: true,
      subtree: true,
    });
  };
}

export default ImagePlaceholderObserver;
