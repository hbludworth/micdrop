<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    width="600"
    content-class="rounded-xl"
    overlay-opacity="0.80"
  >
    <v-card height="355">
      <v-row v-show="loading" justify="center" class="ma-0 pa-0">
        <v-progress-circular
          indeterminate
          size="150"
          width="15"
          color="primary"
          class="mt-14"
        />
      </v-row>
      <iframe
        v-show="!loading"
        :src="iframeSource"
        allow="microphone"
        loading="eager"
        ref="recordingFrame"
      />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
} from "@vue/composition-api";
import Playback from "frontend/src/components/Playback/Playback.vue";
import SoundResponse from "frontend/src/components/SoundResponse.vue";
import { insertImagePlaceholder, insertPlaybackBox } from "./utils";
import ImagePlaceholderObserver from "../../utils/contentObservers/ImagePlaceholderObserver";
import sl from "frontend/src/serviceLocator";

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
  setup({ composeBoxElement, composeBoxIndex, value }, { emit }) {
    const actions = sl.get("globalActions");

    const loading = ref(true);

    const iframeSource = ref(
      process.env.NODE_ENV === "development"
        ? `http://localhost:8080/record`
        : `https://sendmicdrop.com/record`
    );

    const uuid = ref<string | null>(null);

    const recordingFrame = ref<HTMLIFrameElement | null>(null);
    watch(recordingFrame, () => {
      if (recordingFrame.value) {
        recordingFrame.value.addEventListener("load", () => {
          loading.value = false;
        });
      }
    });

    const messageEventHandler = async (event: MessageEvent) => {
      try {
        if (
          event.origin !== "https://sendmicdrop.com" &&
          event.origin !== "http://localhost:8080"
        ) {
          return;
        }

        if (event.data.type !== "uuid") {
          // Only accept uuid events here
          return;
        }

        if (value === false) {
          // Prevents playback from being added to the wrong compose box. Only adds to box whose recording dialog is open
          return;
        }

        removeMessageEventListener();
        uuid.value = event.data.content as string;

        const imagePlaceholderObserver = new ImagePlaceholderObserver(
          composeBoxElement,
          uuid.value
        );

        insertImagePlaceholder(composeBoxElement, uuid.value);

        insertPlaybackBox(
          composeBoxElement,
          composeBoxIndex,
          uuid.value,
          imagePlaceholderObserver
        );

        imagePlaceholderObserver.observeContent();

        emit("input", false);
      } catch {
        actions.showErrorSnackbar("Error inserting audio. Please try again.");
      }
    };

    const addMessageEventListener = () => {
      window.addEventListener("message", messageEventHandler);
    };

    const removeMessageEventListener = () => {
      window.removeEventListener("message", messageEventHandler);
    };

    onMounted(() => {
      addMessageEventListener();
    });

    onUnmounted(() => {
      removeMessageEventListener();
    });

    return {
      recordingFrame,
      loading,
      iframeSource,
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep .v-application--wrap {
  min-height: fit-content;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
