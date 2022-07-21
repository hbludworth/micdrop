export interface CustomPlaybackDisplay extends CustomPlaybackRow {
  circleImageUrl: string | null;
  signatureImageUrl: string | null;
}

export interface CustomPlaybackRow {
  uuid: string;
  userUuid: string;
  name: string;
  backgroundColor: string;
  playButtonColor: string;
  pauseButtonColor: string;
  playPauseIconColor: string;
  timeBackgroundColor: string;
  timeFontColor: string;
  scrubberColor: string;
  circleImage: string | null;
  signatureText: string;
  signatureImage: string | null;
  link: string;
}

export interface CreateNewCustomPlaybackPayload {
  name: string;
  backgroundColor: string;
  playButtonColor: string;
  pauseButtonColor: string;
  playPauseIconColor: string;
  timeBackgroundColor: string;
  timeFontColor: string;
  scrubberColor: string;
  circleImage: string | null;
  signatureText: string;
  signatureImage: string | null;
  link: string;
}

export interface CreateNewCustomPlaybackImagePayload {
  name: string;
  file: File;
}
