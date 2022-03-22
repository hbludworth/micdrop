<template>
  <div
    id="playback-insertion-point"
    class="postcsswrapper playback-insertion-point"
  >
    <v-app>
      <playback :audioUrl="audioUrl" />
    </v-app>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import Playback from "./Playback.vue";

export default defineComponent({
  components: {
    Playback,
  },
  props: {
    audioUrl: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
::v-deep .v-application--wrap {
  min-height: fit-content;
}
</style>
