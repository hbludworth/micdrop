<template>
  <div id="playback-insertion-point" class="postcsswrapper">
    <v-app>
      <playback :audioUrl="audioUrl" />
      <span id="audio-uuid" hidden>{{ newUuid }}</span>
    </v-app>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import Playback from "./Playback.vue";
import axios from "axios";

export default defineComponent({
  components: {
    Playback,
  },
  props: {
    audioUrl: {
      type: String,
      required: true,
    },
    file: {
      type: File,
      required: false,
    },
  },
  setup(props) {
    const newUuid = ref("");

    onMounted(async () => {
      if (props.file) {
        const formData = new FormData();
        formData.append("newFile", props.file, "newFile.mp3");

        const { data: uuid } = await axios.post(
          "http://localhost:8081/api/v1/audio",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        newUuid.value = uuid;
      }
    });

    return {
      newUuid,
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep .v-application--wrap {
  min-height: fit-content;
}
</style>
