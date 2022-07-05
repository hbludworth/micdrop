<template>
  <div class="recording-dialog postcsswrapper">
    <v-app>
      <v-dialog
        v-model="dialogOpen"
        @input="$emit('input', $event)"
        width="600"
        content-class="rounded-xl"
        overlay-opacity="0.80"
        :key="dialogKey"
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
    </v-app>
  </div>
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
  setup() {
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

        if (
          composeBoxElement.value === undefined ||
          composeBoxIndex.value === undefined
        ) {
          throw new Error("Compose box not set");
        }

        removeMessageEventListener();
        uuid.value = event.data.content as string;

        const imagePlaceholderObserver = new ImagePlaceholderObserver(
          composeBoxElement.value,
          uuid.value
        );

        insertImagePlaceholder(composeBoxElement.value, uuid.value);

        insertPlaybackBox(
          composeBoxElement.value,
          composeBoxIndex.value,
          uuid.value,
          imagePlaceholderObserver
        );

        imagePlaceholderObserver.observeContent();

        dialogOpen.value = false;
        composeBoxElement.value = undefined;
        composeBoxIndex.value = undefined;
        uuid.value = null;
        recordingFrame.value = null;
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

    const dialogOpen = ref(false);
    const dialogKey = ref(false);

    watch(dialogOpen, () => {
      if (dialogOpen.value) {
        dialogKey.value = !dialogKey.value;
        addMessageEventListener();
      } else {
        removeMessageEventListener();
      }
    });

    onMounted(() => {
      window.addEventListener("micdrop-open-dialog", (event) => {
        composeBoxElement.value = (
          event as CustomEvent
        ).detail.composeBoxElement;
        composeBoxIndex.value = (event as CustomEvent).detail.composeBoxIndex;
        dialogOpen.value = true;
      });
    });

    onUnmounted(() => {
      removeMessageEventListener();
    });

    const composeBoxElement = ref<Element>();
    const composeBoxIndex = ref<number>();

    return {
      recordingFrame,
      loading,
      iframeSource,
      dialogOpen,
      dialogKey,
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
