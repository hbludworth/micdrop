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
import Playback from "./Playback.vue";
import SoundResponse from "./SoundResponse.vue";
import BasePlayback from "./BasePlayback.vue";
import axios from "axios";
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

    const insertImagePlaceholder = (uuid: string) => {
      const inputArea = document.querySelector(".LW-avf");

      const div = document.createElement("div");
      div.id = "image-placeholder";
      div.hidden = true;

      const previewMessage = document.createElement("span");
      previewMessage.innerHTML =
        "You've received a MicDrop audio message. Play now!" +
        "&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;&#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;";
      div.appendChild(previewMessage);

      const link = document.createElement("a");
      link.href =
        process.env.NODE_ENV === "development"
          ? `http://localhost:8080/playback/${uuid}`
          : `https://www.sendmicdrop.com/playback/${uuid}`;
      link.target = "_blank";

      const image = document.createElement("img");
      image.src =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8081/api/v1/image/placeholder.png"
          : "https://www.sendmicdrop.com/api/v1/image/placeholder.png";
      image.width = 400;

      link.appendChild(image);

      div.appendChild(link);

      const uuidPlaceholder = document.createElement("span");
      uuidPlaceholder.id = "audio-uuid";
      uuidPlaceholder.style.display = "none";
      uuidPlaceholder.innerHTML = uuid;

      div.appendChild(uuidPlaceholder);

      inputArea?.appendChild(div);
    };

    const submit = async () => {
      if (audioUrl.value) {
        const blob = await (await fetch(audioUrl.value)).blob();
        const file = new File([blob], "newFile.mp3", {
          type: "audio/mpeg",
        });

        const formData = new FormData();
        formData.append("newFile", file, "newFile.mp3");

        const url =
          process.env.NODE_ENV === "development"
            ? "http://localhost:8081/api/v1/audio"
            : "https://www.sendmicdrop.com/api/v1/audio";

        const { data: uuid } = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        insertImagePlaceholder(uuid);

        const inputTable = document.querySelector(".iN");
        const tbody = inputTable?.children.item(0);
        const tr = tbody?.children.item(0);

        const playbackRow = document.createElement("tr");
        const playbackData = document.createElement("td");
        playbackRow.appendChild(playbackData);

        const insertionDiv = document.createElement("div");
        insertionDiv.id = "emailContent";
        playbackData.appendChild(insertionDiv);

        tr?.insertAdjacentElement("beforebegin", playbackRow);

        Vue.use(VueCompositionApi);
        new Vue({
          vuetify,
          render: (h) =>
            h(BasePlayback, {
              props: {
                audioUrl: audioUrl.value,
                uuid,
              },
            }),
        }).$mount("#emailContent");

        const contentObserver = new MutationObserver(() => {
          if (!document.getElementById("image-placeholder")) {
            contentObserver.disconnect();

            insertImagePlaceholder(uuid);

            observeContent();
          }
        });

        const observeContent = () => {
          contentObserver.observe(document.body, {
            childList: true,
            subtree: true,
          });
        };
        observeContent();

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
