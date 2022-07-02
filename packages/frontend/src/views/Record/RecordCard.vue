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
      <v-row class="justify-center ma-4 mt-4">
        <v-btn
          height="125"
          width="125"
          @click="primaryButtonOptions.clickAction"
          fab
          x-large
          :color="primaryButtonOptions.color"
          depressed
          :disabled="currentStep === 1 && disableRecording"
          ><v-icon color="white" size="55px">{{
            primaryButtonOptions.icon
          }}</v-icon></v-btn
        >
      </v-row>
      <v-row v-if="currentStep === 1" class="justify-center mt-6 mx-0">
        <span class="text-h5">Welcome to</span>
        <v-img
          v-if="subscriptionLevel === 'free'"
          :src="require('../../assets/logos/blue-logo-NoDrop-alpha-700w.png')"
          max-width="100px"
          contain
          class="mt-1 ml-2"
        />
        <v-img
          v-else-if="subscriptionLevel === 'pro'"
          :src="
            require('../../assets/logos/blue-logoPRO-NoDrop-alpha-1000w.png')
          "
          max-width="120px"
          contain
          class="mt-1 ml-2"
        />
      </v-row>
      <v-row
        v-if="currentStep === 1"
        class="justify-center mt-4 mx-0"
        :class="{ 'fade-animation-2': subscriptionLevel === 'free' }"
      >
        <span>Press to Begin Recording</span>
      </v-row>
      <v-row
        v-if="
          currentStep === 1 &&
          monthlyMessagesLeft !== null &&
          subscriptionLevel === 'free'
        "
        class="justify-center mt-n5 mx-0 fade-animation"
      >
        <span class="primary--text" v-if="monthlyMessagesLeft > 0"
          >{{ monthlyMessagesLeft }} Message{{
            monthlyMessagesLeft > 1 ? "s" : ""
          }}
          Left This Month</span
        >
        <span class="primary--text" v-if="monthlyMessagesLeft === 0"
          >No More Messages Left This Month</span
        >
      </v-row>
      <v-row
        v-if="currentStep === 1 && subscriptionLevel === 'free'"
        class="justify-center mt-12 mx-0 text-caption grey--text"
      >
        <span>Want more? Check out</span>
      </v-row>
      <v-row
        v-if="currentStep === 1 && subscriptionLevel === 'free'"
        class="justify-center mt-3 mx-0"
      >
        <v-btn text color="primary" to="/upgrade" target="_blank">
          <v-img
            :src="require('../../assets/logos/blue-logoPRO-alpha-1000w.png')"
            max-width="100"
            class="ma-4"
            contain
          />
        </v-btn>
      </v-row>
      <v-row
        v-if="currentStep === 1 && subscriptionLevel === 'pro'"
        class="justify-center mt-9 mx-0"
      >
        <v-btn large text color="primary" to="/extension/past_recordings_list"
          ><v-icon small class="mr-1">{{ icons.mdiArchive }}</v-icon
          >Past Recordings</v-btn
        >
      </v-row>
      <v-row v-if="currentStep === 2" class="justify-center mx-0">
        <span class="text-h4">{{ seconds }} seconds</span>
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
      <v-row
        v-if="currentStep === 3 && subscriptionLevel === 'free'"
        class="justify-center mt-6 mx-0 text-caption grey--text"
      >
        <span>Need more recording time? Try </span>
        <v-btn text x-small color="primary" to="/upgrade" target="_blank">
          <v-img
            :src="
              require('../../assets/logos/blue-logoPRO-NoDrop-alpha-1000w.png')
            "
            max-width="70"
            class="mx-n1"
            contain
          />
        </v-btn>
      </v-row>
      <v-row class="ma-0 mt-n4" v-if="currentStep === 3">
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
  watch,
  onMounted,
} from "@vue/composition-api";
import sl from "../../serviceLocator";
import { PrimaryButtonOptions, SubscriptionStatus } from "types";
import {
  mdiStopCircle,
  mdiDelete,
  mdiArrowULeftTopBold,
  mdiEmailSendOutline,
  mdiMicrophone,
  mdiArchive,
} from "@mdi/js";
import SoundResponse from "../../components/SoundResponse.vue";
import Playback from "../../components/Playback/Playback.vue";
import audioEncoder from "audio-encoder";

export default defineComponent({
  props: {
    ignorePastDue: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SoundResponse,
    Playback,
  },
  setup(props) {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");
    const store = sl.get("store");
    const router = sl.get("router");

    const subscriptionLevel = computed(() =>
      store.getters.user ? store.getters.user.subscriptionLevel : "free"
    );

    const primaryButtonOptions: ComputedRef<PrimaryButtonOptions> = computed(
      () => {
        if (!audioUrl.value && !isRecording.value) {
          return {
            icon: icons.value.mdiMicrophone,
            clickAction: startRecording,
            color: "primary",
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
      mdiArchive,
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
      const timeLimit = subscriptionLevel.value === "free" ? 60 : null;
      beginSeconds(timeLimit);
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

    const seconds = ref(subscriptionLevel.value === "free" ? 60 : 0);
    let countingInterval: number | undefined;
    const beginSeconds = (timeLimit: number | null) => {
      if (!timeLimit) {
        seconds.value = 0;
        countingInterval = setInterval(() => {
          seconds.value++;
        }, 1000);
      } else {
        seconds.value = timeLimit;
        countingInterval = setInterval(() => {
          seconds.value--;
        }, 1000);
      }
    };

    watch(seconds, () => {
      if (subscriptionLevel.value === "free" && seconds.value === 0) {
        stopRecording();
      }
    });

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
    const monthlyMessagesLeft = ref<number | null>(null);
    const subscriptionStatus = ref<SubscriptionStatus>();
    onMounted(async () => {
      try {
        loading.value = true;
        monthlyMessagesLeft.value = (
          await server.getMonthlyMessagesLeft()
        ).monthlyMessagesLeft;
        if (subscriptionLevel.value !== "free") {
          subscriptionStatus.value = await server.getSubscriptionStatus();
          if (subscriptionStatus.value === "past_due" && !props.ignorePastDue) {
            router.push("/past_due_warning");
          }
        }
      } catch {
        actions.showErrorSnackbar(
          "Error preparing recording setup. Please try again."
        );
      } finally {
        loading.value = false;
      }
    });

    const disableRecording = computed(() => {
      if (
        subscriptionLevel.value === "free" &&
        monthlyMessagesLeft.value === 0
      ) {
        return true;
      }
      return false;
    });

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
      subscriptionLevel,
      monthlyMessagesLeft,
      disableRecording,
      loading,
    };
  },
});
</script>

<style scoped>
.fade-animation {
  animation: fadeInOut 7s infinite;
}

.fade-animation-2 {
  animation: fadeInOut2 7s infinite;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  35% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fadeInOut2 {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  65% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
