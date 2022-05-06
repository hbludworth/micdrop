<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    width="600"
    content-class="rounded-xl"
  >
    <v-card height="355">
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
        <v-row
          v-if="!isRecording && !audioUrl"
          class="justify-center mt-6 mx-0"
        >
          <span class="text-h5">Welcome to MicDrop</span>
        </v-row>
        <v-row
          v-if="!isRecording && !audioUrl"
          class="justify-center mt-4 mx-0"
        >
          <span>Press to Begin Recording</span>
        </v-row>
        <v-row
          v-if="isRecording && mediaStream"
          class="justify-center mt-8 mx-0"
        >
          <sound-response :mediaStream="mediaStream" />
        </v-row>
        <v-row class="ma-0" v-if="audioUrl">
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
                    ><v-icon color="white">{{
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
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  ComputedRef,
} from "@vue/composition-api";
import {
  mdiStopCircle,
  mdiDelete,
  mdiArrowULeftTopBold,
  mdiEmailSendOutline,
  mdiMicrophone,
} from "@mdi/js";
import Playback from "../Playback/Playback.vue";
import SoundResponse from "../../components/SoundResponse.vue";
import axios from "axios";
import { insertImagePlaceholder, insertPlaybackBox } from "./utils";
import ImagePlaceholderObserver from "../../utils/contentObservers/ImagePlaceholderObserver";
import audioEncoder from "audio-encoder";

export interface PrimaryButtonOptions {
  icon: string;
  clickAction: () => void;
  color: string;
}

export default defineComponent({
  name: "MicDropButton",
  components: {
    Playback,
    SoundResponse,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    composeBoxElement: {
      type: Element,
      required: true,
    },
    composeBoxIndex: {
      type: Number,
      required: true,
    },
  },
  setup({ composeBoxElement, composeBoxIndex }, { emit }) {
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
          console.log("The following getUserMedia error occurred: " + err);
        }
      } else {
        console.log("getUserMedia not supported on your browser!");
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

    const submit = async () => {
      if (audioUrl.value) {
        const blob = await (await fetch(audioUrl.value)).blob();
        const arrayBuffer = await blob.arrayBuffer();

        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        audioEncoder(audioBuffer, null, null, async (audioBlob: Blob) => {
          const formData = new FormData();
          formData.append("newFile", audioBlob, "newFile.wav");

          const url =
            process.env.NODE_ENV === "development"
              ? "http://localhost:8081/api/v1/audio"
              : "https://www.sendmicdrop.com/api/v1/audio";

          const { data: uuid } = await axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          insertImagePlaceholder(composeBoxElement, uuid);

          insertPlaybackBox(
            composeBoxElement,
            composeBoxIndex,
            uuid,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            audioUrl.value
          );

          const imagePlaceholderObserver = new ImagePlaceholderObserver(
            composeBoxElement,
            uuid
          );
          imagePlaceholderObserver.observeContent();

          emit("input", false);
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
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep .v-application--wrap {
  min-height: fit-content;
}
</style>
