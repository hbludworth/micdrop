<template>
  <div class="mic-button postcsswrapper">
    <v-app>
      <v-btn
        @click="dialogOpen = !dialogOpen"
        text
        class="ml-3 pa-0 mr-n1"
        min-width="28"
        min-height="28"
        max-height="28"
      >
        <v-icon size="20px" color="#737373">{{ icons.mdiMicrophone }}</v-icon>
      </v-btn>
      <v-dialog v-model="dialogOpen" width="600" content-class="rounded-xl">
        <v-card height="350">
          <v-card-title> </v-card-title>
          <v-card-text class="ma-0 pa-0">
            <v-row class="justify-center ma-4 mt-4">
              <v-btn
                v-if="!audioUrl && !isRecording"
                height="125"
                width="125"
                @click="startRecording"
                fab
                x-large
                color="#4286f5"
                depressed
              >
                <v-icon color="white" size="55px">{{
                  icons.mdiMicrophone
                }}</v-icon>
              </v-btn>
              <v-btn
                v-if="!audioUrl && isRecording"
                height="125"
                width="125"
                @click="stopRecording"
                fab
                x-large
                color="#ea4235"
                depressed
              >
                <v-icon color="white" size="55px">{{
                  icons.mdiStopCircle
                }}</v-icon>
              </v-btn>
              <v-btn
                v-if="audioUrl"
                height="125"
                width="125"
                @click="deleteRecording"
                fab
                x-large
                color="grey lighten-1"
                depressed
              >
                <v-icon color="white" size="55px">{{
                  icons.mdiArrowULeftTopBold
                }}</v-icon>
              </v-btn>
            </v-row>
            <v-row class="justify-center mx-0">
              <span class="text-h4">{{ seconds }} seconds</span>
            </v-row>
            <v-row
              v-if="isRecording && mediaStream"
              class="justify-center mt-8 mx-0"
            >
              <sound-response :mediaStream="mediaStream" />
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
            <playback v-if="audioUrl" :audioUrl="audioUrl" />
            <v-row v-if="audioUrl" class="ma-0 mt-n10">
              <v-spacer />
              <v-btn color="#4286f5" class="white--text mr-2" @click="submit"
                >SUBMIT</v-btn
              >
            </v-row>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import {
  mdiStopCircle,
  mdiDelete,
  mdiArrowULeftTopBold,
  mdiMicrophone,
} from "@mdi/js";
import BasePlayback from "./BasePlayback.vue";
import Playback from "./Playback.vue";
import SoundResponse from "./SoundResponse.vue";
import Vue from "vue";
import vuetify from "../plugins/vuetify";
import VueCompositionApi from "@vue/composition-api";

export default defineComponent({
  name: "MicDropButton",
  components: {
    Playback,
    SoundResponse,
  },
  setup() {
    const dialogOpen = ref(false);

    const icons = ref({
      mdiMicrophone,
      mdiStopCircle,
      mdiDelete,
      mdiArrowULeftTopBold,
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
          console.log(mediaStream.value);
          mediaRecorder.value = new MediaRecorder(mediaStream.value);

          mediaRecorder.value.ondataavailable = (e) => {
            chunks.push(e.data);
          };

          mediaRecorder.value.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/mpeg" });
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
        const newNode = document.createElement("div");
        newNode.id = "emailContent";

        const inputArea = document.querySelector(".LW-avf");
        inputArea?.appendChild(newNode);

        const blob = await (await fetch(audioUrl.value)).blob();
        const file = new File([blob], "newFile.mp3", {
          type: "audio/mpeg",
        });

        Vue.use(VueCompositionApi);
        new Vue({
          vuetify,
          render: (h) =>
            h(BasePlayback, {
              props: {
                audioUrl: audioUrl.value,
                file,
              },
            }),
        }).$mount("#emailContent");

        dialogOpen.value = false;
      }
    };

    return {
      dialogOpen,
      icons,
      isRecording,
      audioUrl,
      deleteRecording,
      seconds,
      startRecording,
      stopRecording,
      mediaStream,
      submit,
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep .v-application--wrap {
  min-height: fit-content;
}
</style>
