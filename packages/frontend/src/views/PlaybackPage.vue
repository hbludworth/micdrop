<template>
  <div>
    <v-container class="ma-0 pa-10" fluid>
      <v-row class="justify-center">
        <v-img
          src="http://localhost:8081/api/v1/image/logo"
          max-width="300px"
          class="mb-12 mt-8"
        />
      </v-row>
      <v-row class="justify-center mt-10">
        <h3>Hey! You've received an audio message through MicDrop!</h3>
      </v-row>
      <v-row class="justify-center text--disabled">
        <span> To listen, simply hit the play button below.</span>
      </v-row>
      <v-row class="justify-center my-12">
        <playback :audioUrl="`http://localhost:8081/api/v1/audio/${uuid}`" />
      </v-row>
      <v-row class="justify-center">
        <h3>Want to send your own audio messages?</h3>
      </v-row>
      <v-row class="justify-center text--disabled my-4">
        <span>With the <a>MicDrop Chrome Extension</a>, you can:</span>
      </v-row>
      <v-row class="justify-center text--disabled">
        <span>- Reply to this message with your own recording</span>
      </v-row>
      <v-row class="justify-center text--disabled">
        <span>- Send your own audio emails to anyone</span>
      </v-row>
      <v-row class="justify-center text--disabled">
        <span>- Listen to MicDrop messages directly within Gmail</span>
      </v-row>
      <v-row class="justify-center text--disabled">
        <span>- And so much more!</span>
      </v-row>
      <!-- <v-row class="justify-center text--disabled">
        <span
          >Add our Chrome Extension <a>here</a> to reply with a MicDrop audio
          message, send your own audio emails, and listen within Gmail.</span
        >
      </v-row> -->
    </v-container>
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

<style scoped>
.full_screen {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>