import { insertImagePlaceholder } from '@/views/RecordingDialog/utils';

class ImagePlaceholderObserver {
  private composeBoxElement: Element;
  private uuid: string;
  private customPlaybackImage: string;

  constructor(
    composeBoxElement: Element,
    uuid: string,
    customPlaybackImage: string
  ) {
    this.composeBoxElement = composeBoxElement;
    this.uuid = uuid;
    this.customPlaybackImage = customPlaybackImage;
  }

  private contentObserver = new MutationObserver(() => {
    if (
      !this.composeBoxElement.firstElementChild?.classList.contains(
        'image-placeholder'
      ) ||
      !this.composeBoxElement.querySelector('#image-placeholder') ||
      !this.composeBoxElement.querySelector('#preview-message') ||
      !this.composeBoxElement.querySelector('#placeholder-img-link') ||
      !this.composeBoxElement.querySelector('#placeholder-img-file') ||
      !this.composeBoxElement.querySelector('#audio-uuid')
    ) {
      this.contentObserver.disconnect();

      insertImagePlaceholder(
        this.composeBoxElement,
        this.uuid,
        this.customPlaybackImage
      );

      this.observeContent();
    }
  });

  public observeContent = (): void => {
    this.contentObserver.observe(this.composeBoxElement, {
      childList: true,
      subtree: true,
    });
  };

  public disconnectObserver = (): void => {
    this.contentObserver.disconnect();
  };
}

export default ImagePlaceholderObserver;
