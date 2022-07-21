<template>
  <div id="playback-insertion-point" class="postcsswrapper">
    <v-app>
      <playback
        v-if="audioMessage"
        :showRemoveButton="showRemoveButton"
        :audioMessage="audioMessage"
        @remove="removeRecording"
      />
      <span id="audio-uuid" hidden>{{ uuid }}</span>
    </v-app>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import Playback from "./Playback.vue";
import sl from "../../serviceLocator";
import { AudioMessageWithUrl } from "types";

export default defineComponent({
  components: {
    Playback,
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    showRemoveButton: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");

    const audioMessage = ref<AudioMessageWithUrl>();
    onMounted(async () => {
      try {
        audioMessage.value = await server.getAudioMessage(props.uuid);
      } catch {
        actions.showErrorSnackbar("Error retrieving audio. Please try again.");
      }
    });

    const removeRecording = async () => {
      try {
        await server.deleteAudio(props.uuid);

        parent.window.postMessage(
          { type: "remove", content: props.uuid },
          "https://mail.google.com"
        );
      } catch {
        actions.showErrorSnackbar("Error removing audio. Please try again.");
      }
    };
    return {
      audioMessage,
      removeRecording,
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep .v-application--wrap {
  min-height: fit-content;
}
</style>
