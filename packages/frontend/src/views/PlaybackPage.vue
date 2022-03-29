<template>
  <div>
    <playback :audioUrl="`http://localhost:8081/api/v1/audio/${uuid}`" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import Playback from "extension/src/components/Playback.vue";

export default defineComponent({
  name: "PlaybackPage",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  components: {
    Playback,
  },
  setup() {
    return {};
  },
});
</script>
