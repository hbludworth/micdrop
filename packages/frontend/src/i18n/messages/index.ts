import record from './record';
import pastRecordings from './pastRecordings';
import audio from './audio';
import createCustomPlayback from './createCustomPlayback';
import extension from './extension';

export default {
  en: {
    record: {
      ...record.en,
    },
    pastRecordings: {
      ...pastRecordings.en,
    },
    audio: {
      ...audio.en,
    },
    createCustomPlayback: {
      ...createCustomPlayback.en,
    },
    extension: {
      ...extension.en,
    },
  },
  es: {
    record: {
      ...record.es,
    },
    pastRecordings: {
      ...pastRecordings.es,
    },
    audio: {
      ...audio.es,
    },
    createCustomPlayback: {
      ...createCustomPlayback.es,
    },
    extension: {
      ...extension.es,
    },
  },
};
