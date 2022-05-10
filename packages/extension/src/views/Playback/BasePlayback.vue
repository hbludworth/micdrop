<template>
  <div id="playback-insertion-point" class="postcsswrapper">
    <v-app>
      <v-row v-if="includeCenteredRow" class="ma-0" justify="center">
        <playback
          :audioUrl="audioUrl"
          :showRemoveButton="showRemoveButton"
          @remove="$emit('remove')"
        />
      </v-row>
      <playback
        v-else
        :audioUrl="audioUrl"
        :showRemoveButton="showRemoveButton"
        @remove="$emit('remove')"
      />
      <span id="audio-uuid" hidden>{{ uuid }}</span>
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
    includeCenteredRow: {
      type: Boolean,
      default: false,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: false,
    },
    showRemoveButton: {
      type: Boolean,
      default: false,
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
