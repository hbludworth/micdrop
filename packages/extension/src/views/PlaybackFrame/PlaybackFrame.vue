<template>
  <div id="playback-insertion-point" class="postcsswrapper">
    <v-app>
      <v-row v-if="includeCenteredRow" class="ma-0" justify="center">
        <iframe :src="iframeSource" loading="eager" />
      </v-row>
      <iframe v-else :src="iframeSource" loading="eager" />
      <span id="audio-uuid" hidden>{{ uuid }}</span>
    </v-app>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
} from "@vue/composition-api";
import sl from "frontend/src/serviceLocator";

export default defineComponent({
  props: {
    includeCenteredRow: {
      type: Boolean,
      default: false,
    },
    uuid: {
      type: String,
      required: true,
    },
    showRemoveButton: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const actions = sl.get("globalActions");

    const iframeSource = ref(
      process.env.NODE_ENV === "development"
        ? `http://localhost:8080/base_playback/${props.uuid}?showRemove=${props.showRemoveButton}`
        : `https://app.sendmicdrop.com/base_playback/${props.uuid}?showRemove=${props.showRemoveButton}`
    );

    const messageEventHandler = async (event: MessageEvent) => {
      try {
        if (
          event.origin !== "https://app.sendmicdrop.com" &&
          event.origin !== "https://sendmicdrop.com" &&
          event.origin !== "http://localhost:8080"
        ) {
          return;
        }

        if (event.data.type !== "remove") {
          // Only accept remove events here
          return;
        }

        if (event.data.content === props.uuid) {
          // Prevents removal of incorrect messages. Checks that UUID matches before removing
          removeEventListener();
          emit("remove");
        }
      } catch {
        actions.showErrorSnackbar("Error removing audio. Please try again.");
      }
    };

    const addEventListener = () => {
      window.addEventListener("message", messageEventHandler);
    };

    const removeEventListener = () => {
      window.removeEventListener("message", messageEventHandler);
    };

    onMounted(() => {
      addEventListener();
    });

    onUnmounted(() => {
      removeEventListener();
    });
    return {
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
  position: relative;
  top: 0;
  left: 0;
  width: 385px;
  height: 140px;
  border: 0;
}
</style>
