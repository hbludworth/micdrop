<template>
  <div>
    <v-card-title> </v-card-title>
    <v-card-text class="ma-0 pa-0">
      <v-row class="justify-center ma-4 mt-4">
        <v-btn
          height="125"
          width="125"
          @click="primaryButtonOptions.clickAction"
          fab
          x-large
          :color="primaryButtonOptions.color"
          depressed
          ><v-icon color="white" size="55px">{{
            primaryButtonOptions.icon
          }}</v-icon></v-btn
        >
      </v-row>
      <v-row class="justify-center mx-0">
        <span class="text-h4">{{ seconds }} seconds</span>
      </v-row>
      <v-row v-if="!isRecording && !audioUrl" class="justify-center mt-6 mx-0">
        <span class="text-h5">Welcome to MicDrop</span>
      </v-row>
      <v-row v-if="!isRecording && !audioUrl" class="justify-center mt-4 mx-0">
        <span>Press to Begin Recording</span>
      </v-row>
      <v-row v-if="isRecording && mediaStream" class="justify-center mt-8 mx-0">
        <sound-response
          :mediaStream="mediaStream"
          :isPlaying="true"
          :autoStart="true"
        />
      </v-row>
      <v-row class="ma-0 mt-n4" v-if="audioUrl">
        <v-col cols="2" class="pa-0" />
        <v-col cols="8" class="pa-0">
          <v-row justify="center" class="ma-0">
            <playback :audioUrl="audioUrl" />
          </v-row>
        </v-col>
        <v-col cols="2" class="pa-0" align-self="center">
          <v-row class="ma-0 pb-1" justify="center">
            <v-tooltip top open-delay="500">
              <template #activator="{ on, attrs }">
                <v-btn
                  color="#4286f5"
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
              <span>Add to Email</span>
            </v-tooltip>
          </v-row>
        </v-col>
      </v-row>
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
} from "@vue/composition-api";
import sl from "../../serviceLocator";
import { PrimaryButtonOptions } from "types";
import {
  mdiStopCircle,
  mdiDelete,
  mdiArrowULeftTopBold,
  mdiEmailSendOutline,
  mdiMicrophone,
} from "@mdi/js";
import SoundResponse from "../../components/SoundResponse.vue";
import Playback from "../../components/Playback/Playback.vue";
import audioEncoder from "audio-encoder";

export default defineComponent({
  components: {
    SoundResponse,
    Playback,
  },
  setup() {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");

    const primaryButtonOptions: ComputedRef<PrimaryButtonOptions> = computed(
      () => {
        if (!audioUrl.value && !isRecording.value) {
          return {
            icon: icons.value.mdiMicrophone,
            clickAction: startRecording,
            color: "#4286f5",
          };
        } else if (!audioUrl.value && isRecording.value) {
          return {
            icon: icons.value.mdiStopCircle,
            clickAction: stopRecording,
            color: "#ea4235",
          };
        } else {
          return {
            icon: icons.value.mdiArrowULeftTopBold,
            clickAction: deleteRecording,
            color: "grey lighten-1",
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
            const blob = new Blob(chunks, { type: "audio/x-wav" });
            chunks = [];
            audioUrl.value = window.URL.createObjectURL(blob);
          };
        } catch (err) {
          actions.showErrorSnackbar(
            "Error loading recording interface. Please try again."
          );
        }
      } else {
        actions.showErrorSnackbar(
          "Your browser does not support audio recording. Please update or try another browser."
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
            submitLoading.value = true;
            const uuid = await server.uploadAudio(audioBlob);

            parent.window.postMessage(
              { type: "uuid", content: uuid },
              "https://mail.google.com"
            );
          } catch {
            actions.showErrorSnackbar(
              "Error inserting audio file. Please try again."
            );
          } finally {
            submitLoading.value = false;
          }
        });
      }
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
    };
  },
});
</script>
