import { CustomPlaybackDisplay } from './customPlayback';

export interface AudioMessage {
  uuid: string;
  userUuid: string;
  createdOn: Date;
  fileType: string;
  label: string | null;
  audioGroupUuid: string | null;
  customPlaybackUuid: string;
}

export interface AudioMessageWithUrl extends AudioMessage {
  url: string;
  customPlayback: CustomPlaybackDisplay;
}

export interface AudioGroup {
  uuid: string;
  name: string;
}
