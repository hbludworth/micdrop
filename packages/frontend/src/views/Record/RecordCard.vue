<template>
  <v-row v-if="loading" justify="center" class="ma-0 pa-0">
    <v-progress-circular
      indeterminate
      size="150"
      width="15"
      color="primary"
      class="mt-14"
    />
  </v-row>
  <div v-else>
    <v-card-title> </v-card-title>
    <v-card-text class="ma-0 pa-0">
      <v-row class="ma-0">
        <v-spacer />
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              class="mr-6 mt-n4"
              color="primary"
              small
              text
            >
              <v-icon small class="mr-1">{{ icons.mdiTranslate }}</v-icon>
              {{ selectedLocale.value }}
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              v-for="(locale, idx) in locales"
              :key="idx"
              class="pa-0"
            >
              <v-btn width="100%" text @click="setLocale(locale)"
                ><v-icon
                  small
                  class="mr-2"
                  :color="
                    selectedLocale.value === locale.value
                      ? 'black'
                      : 'transparent'
                  "
                  >{{ icons.mdiCheck }}</v-icon
                >{{ locale.value.toUpperCase() }} - {{ locale.label }}</v-btn
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
      <v-row class="justify-center ma-4 mt-0">
        <v-btn
          :height="primaryButtonOptions.size"
          :width="primaryButtonOptions.size"
          @click="primaryButtonOptions.clickAction"
          class="v-btn--round"
          x-large
          :color="primaryButtonOptions.color"
          depressed
          ><v-icon color="white" :size="`${primaryButtonOptions.iconSize}px`">{{
            primaryButtonOptions.icon
          }}</v-icon></v-btn
        >
      </v-row>
      <v-row v-if="currentStep === 1" class="justify-center mt-6 mx-0">
        <span class="text-h5">{{ i18n.t('record.welcome') }}</span>
        <v-img
          :src="require('../../assets/logos/blue-logo-NoDrop-alpha-700w.png')"
          max-width="100px"
          contain
          class="mt-1 ml-2"
        />
      </v-row>
      <v-row v-if="currentStep === 1" class="justify-center mt-4 mx-0">
        <span>{{ i18n.t('record.press') }}</span>
      </v-row>
      <v-row v-if="currentStep === 1" class="justify-center mt-9 mx-0">
        <v-btn large text color="primary" to="/extension/past_recordings_list"
          ><v-icon small class="mr-1">{{ icons.mdiArchive }}</v-icon
          >{{ i18n.t('record.pastRecordings') }}</v-btn
        >
      </v-row>
      <v-row v-if="currentStep === 2" class="justify-center mx-0">
        <span class="text-h4"
          >{{ seconds }} {{ i18n.t('record.seconds') }}</span
        >
      </v-row>
      <v-row
        v-if="currentStep === 2 && mediaStream"
        class="justify-center mt-8 mx-0"
      >
        <sound-response
          :mediaStream="mediaStream"
          :isPlaying="true"
          :autoStart="true"
        />
      </v-row>
      <v-row class="ma-0 mt-n4" v-if="currentStep === 3">
        <v-col cols="2" class="pa-0" />
        <v-col cols="8" class="pa-0">
          <v-row justify="center" class="ma-0">
            <playback v-if="audioMessage" :audioMessage="audioMessage" />
          </v-row>
        </v-col>
        <v-col cols="2" class="pa-0" align-self="center">
          <v-row class="ma-0 pb-1" justify="center">
            <v-tooltip top open-delay="500">
              <template #activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  @click="submit"
                  fab
                  depressed
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-progress-circular
                    v-if="submitLoading"
                    indeterminate
                    size="25"
                    width="3"
                    color="white"
                  />
                  <v-icon v-else color="white">{{
                    icons.mdiEmailSendOutline
                  }}</v-icon></v-btn
                >
              </template>
              <span>{{ i18n.t('record.addToEmail') }}</span>
            </v-tooltip>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        class="ma-0 mt-10 mx-4"
        v-if="currentStep === 3"
        justify="center"
        align="center"
      >
        <custom-playback-option
          v-for="(option, idx) in customPlaybackOptions.slice(0, 3)"
          :key="idx"
          :customPlaybackOption="option"
          :isSelected="selectedCustomPlaybackOption === option"
          @selected="selectedCustomPlaybackOption = option"
          class="mr-1 mb-1"
        />
        <v-chip
          color="accent"
          outlined
          class="font-weight-medium mb-1 mr-1"
          @click="viewAllDialog = true"
        >
          {{ i18n.t('record.all') }}
          <v-icon small class="mr-n1">{{ icons.mdiMenuDown }}</v-icon></v-chip
        >
        <v-chip
          color="primary"
          outlined
          class="font-weight-medium mb-1"
          @click="createNewPlaybackDialog = true"
        >
          <v-icon small>{{ icons.mdiPlus }}</v-icon
          >{{ i18n.t('record.create') }}</v-chip
        >
      </v-row>
      <create-new-custom-playback-dialog
        v-if="createNewCustomPlaybackStarter"
        v-model="createNewPlaybackDialog"
        :startingTemplate="createNewCustomPlaybackStarter"
        :key="createNewDialogKey"
        @select-new-custom-playback="selectNewCustomPlayback"
      />
      <mic-drop-dialog
        v-model="viewAllDialog"
        :width="300"
        :showCancel="false"
        :showSubmit="false"
        :title="`${i18n.t('record.customPlayback')}`"
        centerTitle
      >
        <v-row
          class="ma-0 my-2"
          justify="center"
          align="center"
          v-for="(option, idx) in customPlaybackOptions"
          :key="idx"
        >
          <custom-playback-option
            :customPlaybackOption="option"
            :isSelected="selectedCustomPlaybackOption === option"
            @selected="handleViewAllDialogSelection(option)"
          />
        </v-row>
      </mic-drop-dialog>
    </v-card-text>
    <v-card-actions class="pa-0"></v-card-actions>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ComputedRef,
  computed,
  ref,
  watch,
  onMounted,
} from '@vue/composition-api';
import sl from '../../serviceLocator';
import {
  AudioMessageWithUrl,
  PrimaryButtonOptions,
  CustomPlaybackDisplay,
  CustomPlaybackRow,
} from 'types';
import {
  mdiStopCircle,
  mdiDelete,
  mdiArrowULeftTopBold,
  mdiEmailSendOutline,
  mdiMicrophone,
  mdiArchive,
  mdiPlus,
  mdiMenuDown,
  mdiPinOutline,
  mdiStarOutline,
  mdiTranslate,
  mdiCheck,
} from '@mdi/js';
import SoundResponse from '../../components/SoundResponse.vue';
import Playback from '../../components/Playback/Playback.vue';
import audioEncoder from 'audio-encoder';
import CreateNewCustomPlaybackDialog from './components/CreateNewCustomPlaybackDialog.vue';
import MicDropDialog from '../../components/base/MicDropDialog.vue';
import CustomPlaybackOption from './components/CustomPlaybackOption.vue';
import i18n from '../../i18n';

export type LocaleCode = 'en' | 'es';

export interface Locale {
  label: string;
  value: LocaleCode;
}

export default defineComponent({
  components: {
    SoundResponse,
    Playback,
    CreateNewCustomPlaybackDialog,
    MicDropDialog,
    CustomPlaybackOption,
  },
  setup() {
    const server = sl.get('serverProxy');
    const actions = sl.get('globalActions');

    const primaryButtonOptions: ComputedRef<PrimaryButtonOptions> = computed(
      () => {
        if (!audioUrl.value && !isRecording.value) {
          return {
            icon: icons.value.mdiMicrophone,
            clickAction: startRecording,
            color: 'primary',
            size: 125,
            iconSize: 55,
          };
        } else if (!audioUrl.value && isRecording.value) {
          return {
            icon: icons.value.mdiStopCircle,
            clickAction: stopRecording,
            color: 'accent',
            size: 125,
            iconSize: 55,
          };
        } else {
          return {
            icon: icons.value.mdiArrowULeftTopBold,
            clickAction: deleteRecording,
            color: 'accent',
            size: 80,
            iconSize: 40,
          };
        }
      }
    );

    const icons = ref({
      mdiStopCircle,
      mdiDelete,
      mdiArrowULeftTopBold,
      mdiEmailSendOutline,
      mdiMicrophone,
      mdiArchive,
      mdiPlus,
      mdiMenuDown,
      mdiPinOutline,
      mdiStarOutline,
      mdiTranslate,
      mdiCheck,
    });

    const isRecording = ref(false);

    const mediaStream = ref<MediaStream>();
    const mediaRecorder = ref<MediaRecorder>();

    let chunks: Blob[] = [];
    const audioUrl = ref<string>();

    const startRecording = async () => {
      isRecording.value = true;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          mediaStream.value = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          mediaRecorder.value = new MediaRecorder(mediaStream.value);

          mediaRecorder.value.ondataavailable = (e) => {
            chunks.push(e.data);
          };

          mediaRecorder.value.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/x-wav' });
            chunks = [];
            audioUrl.value = window.URL.createObjectURL(blob);
          };
        } catch (err) {
          actions.showErrorSnackbar(
            'Error loading recording interface. Please try again.'
          );
        }
      } else {
        actions.showErrorSnackbar(
          'Your browser does not support audio recording. Please update or try another browser.'
        );
      }

      mediaRecorder.value?.start();
      beginSeconds();
    };

    const stopRecording = () => {
      isRecording.value = false;
      mediaRecorder.value?.stop();
      clearInterval(countingInterval);
      mediaStream.value?.getTracks().forEach((track) => track.stop());
      mediaStream.value = undefined;
      mediaRecorder.value = undefined;
    };

    const deleteRecording = () => {
      audioUrl.value = undefined;
      seconds.value = 0;
    };

    const seconds = ref(0);
    let countingInterval: number | undefined;
    const beginSeconds = () => {
      seconds.value = 0;
      countingInterval = setInterval(() => {
        seconds.value++;
      }, 1000);
    };

    const submitLoading = ref(false);

    const submit = async () => {
      if (audioUrl.value) {
        const blob = await (await fetch(audioUrl.value)).blob();
        const arrayBuffer = await blob.arrayBuffer();

        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        audioEncoder(audioBuffer, null, null, async (audioBlob: Blob) => {
          try {
            if (!selectedCustomPlaybackOption.value) {
              throw new Error('No playback option selected. Cannot submit.');
            }
            submitLoading.value = true;
            const uuid = await server.uploadAudio(
              audioBlob,
              selectedCustomPlaybackOption.value.uuid
            );

            const placeholderImageUrl = `https://app.sendmicdrop.com/api/v1/placeholder_image/${selectedCustomPlaybackOption.value.uuid}_placeholder.png`;

            parent.window.postMessage(
              {
                type: 'uuid',
                content: {
                  audioUuid: uuid,
                  customPlaybackImage: placeholderImageUrl,
                },
              },
              'https://mail.google.com'
            );
          } catch {
            actions.showErrorSnackbar(
              'Error inserting audio file. Please try again.'
            );
          } finally {
            submitLoading.value = false;
          }
        });
      }
    };

    const currentStep = ref(1);

    watch([isRecording, audioUrl], () => {
      if (!isRecording.value && !audioUrl.value) {
        currentStep.value = 1;
      } else if (isRecording.value) {
        currentStep.value = 2;
      } else {
        currentStep.value = 3;
      }
    });

    const loading = ref(false);
    const customPlaybackOptions = ref<CustomPlaybackDisplay[]>([]);

    onMounted(async () => {
      try {
        loading.value = true;

        customPlaybackOptions.value = await server.getCustomPlaybackOptions();
        selectedCustomPlaybackOption.value = customPlaybackOptions.value[0];
      } catch {
        actions.showErrorSnackbar(
          'Error preparing recording setup. Please try again.'
        );
      } finally {
        loading.value = false;
      }
    });

    const selectedCustomPlaybackOption = ref<CustomPlaybackDisplay>();

    const audioMessage: ComputedRef<Pick<
      AudioMessageWithUrl,
      'customPlaybackUuid' | 'customPlayback' | 'url'
    > | null> = computed(() => {
      if (audioUrl.value && selectedCustomPlaybackOption.value) {
        return {
          customPlaybackUuid: selectedCustomPlaybackOption.value.uuid,
          url: audioUrl.value,
          customPlayback: selectedCustomPlaybackOption.value,
        };
      }
      return null;
    });

    const createNewCustomPlaybackStarter = ref<Pick<
      AudioMessageWithUrl,
      'customPlaybackUuid' | 'customPlayback' | 'url'
    > | null>(null);

    watch(audioMessage, () => {
      if (audioMessage.value) {
        createNewCustomPlaybackStarter.value = {
          ...audioMessage.value,
          customPlaybackUuid: customPlaybackOptions.value[0].uuid,
          customPlayback: {
            ...customPlaybackOptions.value[0],
            name: '',
          },
        };
      }
    });

    const createNewPlaybackDialog = ref(false);

    const createNewDialogKey = ref(false);
    watch(createNewPlaybackDialog, () => {
      if (createNewPlaybackDialog.value && audioMessage.value) {
        createNewDialogKey.value = !createNewDialogKey.value;
        createNewCustomPlaybackStarter.value = {
          ...audioMessage.value,
          customPlaybackUuid: customPlaybackOptions.value[0].uuid,
          customPlayback: {
            ...customPlaybackOptions.value[0],
            name: '',
          },
        };
      }
    });

    const selectNewCustomPlayback = async (newOption: CustomPlaybackRow) => {
      try {
        customPlaybackOptions.value = await server.getCustomPlaybackOptions();

        selectedCustomPlaybackOption.value = customPlaybackOptions.value.find(
          (option) => option.uuid === newOption.uuid
        );
      } catch {
        actions.showErrorSnackbar(
          'Error loading new custom playback. Please try again.'
        );
      }
    };

    const viewAllDialog = ref(false);
    const handleViewAllDialogSelection = (option: CustomPlaybackDisplay) => {
      selectedCustomPlaybackOption.value = option;
      viewAllDialog.value = false;
    };

    const locales = ref<Locale[]>([
      { label: 'English', value: 'en' },
      { label: 'Español', value: 'es' },
    ]);

    const selectedLocale = ref<Locale>(
      locales.value.find((locale) => locale.value === i18n.locale) ||
        locales.value[0]
    );

    const setLocale = (locale: Locale) => {
      selectedLocale.value = locale;
      localStorage.setItem('locale', selectedLocale.value.value);
      i18n.locale = selectedLocale.value.value;
    };

    return {
      icons,
      isRecording,
      audioUrl,
      deleteRecording,
      seconds,
      startRecording,
      stopRecording,
      mediaStream,
      submit,
      primaryButtonOptions,
      submitLoading,
      currentStep,
      loading,
      customPlaybackOptions,
      selectedCustomPlaybackOption,
      audioMessage,
      createNewPlaybackDialog,
      createNewCustomPlaybackStarter,
      createNewDialogKey,
      selectNewCustomPlayback,
      viewAllDialog,
      handleViewAllDialogSelection,
      locales,
      setLocale,
      selectedLocale,
      i18n,
    };
  },
});
</script>
