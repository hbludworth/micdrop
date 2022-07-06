export interface AudioLimits {
  monthlyMessagesLeft: number | null;
}

export interface AudioMessage {
  uuid: string;
  userUuid: string;
  createdOn: Date;
  fileType: string;
  label: string | null;
  audioGroupUuid: string | null;
}

export interface AudioMessageWithUrl extends AudioMessage {
  url: string;
}

export interface AudioGroup {
  uuid: string;
  name: string;
}
