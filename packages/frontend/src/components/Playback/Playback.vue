<template>
  <div style="width: 385px">
    <v-row class="ma-0 justify-center">
      <audio
        :src="audioUrl"
        controls
        class="hide-audio"
        ref="defaultAudio"
        crossorigin="anonymous"
      />
      <v-hover v-model="playbackHover">
        <v-card
          class="pa-3 mt-6 rounded-pill"
          width="385"
          color="blue lighten-3"
          flat
        >
          <v-row class="justify-center align-center ma-0">
            <v-btn
              height="60"
              width="60"
              @click="toggleAudio"
              fab
              x-large
              :color="isPlaying ? '#ea4235' : 'primary'"
              depressed
            >
              <v-icon color="white" size="35px">{{
                isPlaying ? icons.mdiPauseCircle : icons.mdiPlayCircle
              }}</v-icon>
            </v-btn>
            <v-hover v-model="soundResponseHover">
              <v-slider
                v-model="playbackTime"
                min="0"
                :max="audioDuration"
                class="mx-4 slider"
                hide-details
                color="transparent"
                track-color="transparent"
                step="0.05"
                @input="updateSlider"
                @mousedown="hideAnimation = true"
                @mouseup="hideAnimation = false"
              />
            </v-hover>
            <v-card
              v-if="soundResponseHover"
              class="scrubber-indicator rounded-pill"
              :class="{ 'scrubber-hide': hideAnimation }"
              outlined
            >
              <span class="text-caption grey--text text--lighten-1">
                <v-icon small class="mt-n1" color="grey lighten-1">{{
                  icons.mdiChevronLeft
                }}</v-icon>
                <span>Drag to Seek</span>
                <v-icon small class="mt-n1" color="grey lighten-1">{{
                  icons.mdiChevronRight
                }}</v-icon>
              </span>
            </v-card>
            <v-spacer />
            <sound-response
              v-if="defaultAudio"
              :audioElement="defaultAudio"
              :progressFraction="progressFraction"
              :isPlaying="isPlaying"
              mini
              class="mx-2"
            />
            <v-spacer />
            <v-btn
              height="60"
              width="60"
              fab
              x-large
              :color="playbackHover && showRemoveButton ? '#ea4235' : '#34a853'"
              depressed
              class="white--text"
            >
              <v-icon
                v-if="playbackHover && showRemoveButton"
                size="35px"
                @click="$emit('remove')"
                >{{ icons.mdiCloseCircle }}</v-icon
              >
              <span v-else>{{
                playbackTime !== 0
                  ? convertTime(playbackTime)
                  : convertTime(audioDuration)
              }}</span>
            </v-btn>
          </v-row>
        </v-card>
      </v-hover>
    </v-row>
    <v-row class="ma-0 mt-0">
      <v-spacer />
      <span class="text-overline"> Powered by </span>
      <a :href="logoLink" target="_blank">
        <v-img
          :src="require('../../assets/logos/blue-logo-alpha-700w.png')"
          height="15px"
          max-width="80px"
          contain
          class="mt-2 ml-1"
        />
      </a>
      <v-tooltip top open-delay="500">
        <template #activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            icon
            small
            color="blue lighten-2"
            class="mr-n3"
            @click="sendFeedback"
          >
            <v-icon small>{{ icons.mdiMessageAlertOutline }}</v-icon></v-btn
          >
        </template>
        <span>Send Feedback</span>
      </v-tooltip>
      <v-spacer />
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  nextTick,
} from "@vue/composition-api";
import {
  mdiPlayCircle,
  mdiPauseCircle,
  mdiMessageAlertOutline,
  mdiCloseCircle,
  mdiChevronLeft,
  mdiChevronRight,
} from "@mdi/js";
import SoundResponse from "frontend/src/components/SoundResponse.vue";

export default defineComponent({
  props: {
    audioUrl: {
      type: String,
      required: true,
    },
    showRemoveButton: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SoundResponse,
  },
  setup() {
    const icons = ref({
      mdiPlayCircle,
      mdiPauseCircle,
      mdiMessageAlertOutline,
      mdiCloseCircle,
      mdiChevronLeft,
      mdiChevronRight,
    });

    const defaultAudio = ref<HTMLAudioElement | null>(null);

    const playbackTime = ref(0);
    const audioDuration = ref(0);
    const isPlaying = ref(false);

    const progressFraction = ref(0);
    const individualDuration = ref(0);
    const progressFractionInterval = ref(0);

    const initProgressFraction = () => {
      if (defaultAudio.value?.currentTime !== undefined) {
        progressFraction.value =
          (defaultAudio.value.currentTime / audioDuration.value) * 16 - 0.5;
      }
      individualDuration.value = (audioDuration.value / 16) * 1000;
    };

    const initSlider = async () => {
      if (defaultAudio.value) {
        while (defaultAudio.value.duration === Infinity) {
          await new Promise((resolve) => setTimeout(resolve, 10));
          defaultAudio.value.currentTime = 10000000 * Math.random();
        }
        defaultAudio.value.currentTime = 0;
        audioDuration.value = Math.round(defaultAudio.value.duration);
        initProgressFraction();
      }
    };

    const convertTime = (seconds: number) => {
      const format = (val: number) => `0${Math.floor(val)}`.slice(-2);
      const minutes = (seconds % 3600) / 60;
      return [minutes, seconds % 60].map(format).join(":");
    };

    const playbackListener = async () => {
      if (defaultAudio.value) {
        allowUpdates.value = false;
        playbackTime.value = defaultAudio.value.currentTime;
        await nextTick();
        allowUpdates.value = true;
      }
    };

    const pauseListener = () => {
      isPlaying.value = false;
      cleanupListeners();
      clearInterval(progressFractionInterval.value);
    };

    const endListener = () => {
      isPlaying.value = false;
      cleanupListeners();
    };

    const cleanupListeners = () => {
      defaultAudio.value?.removeEventListener("timeupdate", playbackListener);
      defaultAudio.value?.removeEventListener("ended", endListener);
      defaultAudio.value?.removeEventListener("pause", pauseListener);
    };

    const toggleAudio = () => {
      if (defaultAudio.value?.paused) {
        defaultAudio.value.play();
        isPlaying.value = true;
        defaultAudio.value?.addEventListener("timeupdate", playbackListener);
        defaultAudio.value?.addEventListener("ended", endListener);
        defaultAudio.value?.addEventListener("pause", pauseListener);

        initProgressFraction();

        progressFractionInterval.value = setInterval(() => {
          progressFraction.value += 0.1;
        }, individualDuration.value / 10);
      } else {
        defaultAudio.value?.pause();
        isPlaying.value = false;
      }
    };

    onMounted(async () => {
      await nextTick();
      defaultAudio.value?.addEventListener("loadedmetadata", async () => {
        await initSlider();
      });
    });

    const logoLink =
      process.env.NODE_ENV === "development"
        ? "localhost:8080"
        : "https://www.sendmicdrop.com";

    const sendFeedback = () => {
      window.open(
        "mailto:feedback@sendmicdrop.com?subject=Feedback Report - MicDrop"
      );
    };

    const allowUpdates = ref(true);

    const updateSlider = () => {
      if (allowUpdates.value) {
        if (defaultAudio.value) {
          defaultAudio.value.pause();
          defaultAudio.value.currentTime = playbackTime.value;
        }
        initProgressFraction();
      }
    };

    const playbackHover = ref(false);
    const soundResponseHover = ref(false);

    const hideAnimation = ref(false);

    return {
      defaultAudio,
      icons,
      isPlaying,
      toggleAudio,
      playbackTime,
      audioDuration,
      convertTime,
      logoLink,
      sendFeedback,
      progressFraction,
      updateSlider,
      allowUpdates,
      playbackHover,
      soundResponseHover,
      hideAnimation,
    };
  },
});
</script>

<style scoped>
.hide-audio {
  display: none;
}

.slider {
  position: absolute;
  z-index: 200;
  width: 200px;
}

.slider >>> .v-slider--horizontal .v-slider__track-container {
  height: 80px;
}

.scrubber-indicator {
  position: absolute;
  z-index: 199;
  animation: fadeInOut 4s infinite;
}

.scrubber-hide {
  display: none;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
