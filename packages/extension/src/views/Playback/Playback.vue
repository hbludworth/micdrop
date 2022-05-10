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
      <v-hover v-slot="{ hover }">
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
              :color="isPlaying ? '#ea4235' : '#4286f5'"
              depressed
            >
              <v-icon color="white" size="35px">{{
                isPlaying ? icons.mdiPauseCircle : icons.mdiPlayCircle
              }}</v-icon>
            </v-btn>
            <!-- <v-slider
            v-model="playbackTime"
            min="0"
            :max="audioDuration"
            class="mx-4"
            hide-details
            color="info"
            ticks
            step="0.1"
          /> -->
            <v-spacer />
            <sound-response
              :key="!isPlaying"
              v-if="!isPlaying"
              :progressFraction="progressFraction"
              mini
              class="mx-2"
            />
            <sound-response
              v-if="isPlaying"
              :audioElement="defaultAudio"
              :progressFraction="progressFraction"
              mini
              class="mx-2"
            />
            <v-spacer />
            <v-btn
              height="60"
              width="60"
              fab
              x-large
              :color="hover && showRemoveButton ? '#ea4235' : '#34a853'"
              depressed
              class="white--text"
            >
              <v-icon
                v-if="hover && showRemoveButton"
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
          :src="logoURL"
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
  watch,
  nextTick,
} from "@vue/composition-api";
import {
  mdiPlayCircle,
  mdiPauseCircle,
  mdiMessageAlertOutline,
  mdiCloseCircle,
} from "@mdi/js";
import SoundResponse from "../../components/SoundResponse.vue";

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
    });

    const defaultAudio = ref<HTMLAudioElement | null>(null);

    const playbackTime = ref(0);
    const audioDuration = ref(0);
    const isPlaying = ref(false);

    const progressFraction = ref(0);
    const individualDuration = ref(0);
    const progressFractionInterval = ref(0);

    const initProgressFraction = () => {
      progressFraction.value = 0;
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

    const playbackListener = () => {
      if (defaultAudio.value) {
        playbackTime.value = defaultAudio.value.currentTime;
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

    watch(playbackTime, () => {
      const diff = Math.abs(
        playbackTime.value - (defaultAudio.value?.currentTime || 0)
      );
      if (diff > 0.5 && defaultAudio.value) {
        defaultAudio.value.currentTime = playbackTime.value;
      }
    });

    const logoURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8081/api/v1/image/logo.png"
        : "https://www.sendmicdrop.com/api/v1/image/logo.png";

    const logoLink =
      process.env.NODE_ENV === "development"
        ? "localhost:8080"
        : "https://www.sendmicdrop.com";

    const sendFeedback = () => {
      window.open(
        "mailto:feedback@sendmicdrop.com?subject=Feedback Report - MicDrop"
      );
    };

    return {
      defaultAudio,
      icons,
      isPlaying,
      toggleAudio,
      playbackTime,
      audioDuration,
      convertTime,
      logoURL,
      logoLink,
      sendFeedback,
      progressFraction,
    };
  },
});
</script>

<style scoped>
.hide-audio {
  display: none;
}
</style>
