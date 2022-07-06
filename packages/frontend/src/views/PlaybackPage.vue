<template>
  <div>
    <v-container class="ma-0 pa-10" fluid>
      <v-row class="justify-center">
        <router-link to="/"
          ><v-img
            :src="require('../assets/logos/blue-logo-alpha-700w.png')"
            max-width="300px"
            class="mb-12 mt-8"
            contain
        /></router-link>
      </v-row>
      <v-row class="justify-center mt-10">
        <h3>Hey! You've received an audio message through MicDrop!</h3>
      </v-row>
      <v-row class="justify-center text--disabled">
        <span> To listen, simply hit the play button below.</span>
      </v-row>
      <v-row class="justify-center my-12">
        <playback :audioUrl="audioURL" />
      </v-row>
      <v-row class="justify-center">
        <h3>Want to send your own audio messages?</h3>
      </v-row>
      <v-row class="justify-center text--disabled my-4">
        <span
          >With the
          <a
            href="https://chrome.google.com/webstore/detail/cfeaabebicbbcmddmgphgncpdlkadgfl?authuser=2&hl=en"
            >MicDrop Chrome Extension</a
          >, you can:</span
        >
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
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import Playback from "../components/Playback/Playback.vue";
import sl from "../serviceLocator";

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
  setup(props) {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");

    const audioURL = ref("");
    onMounted(async () => {
      try {
        audioURL.value = await server.getAudio(props.uuid);
      } catch {
        actions.showErrorSnackbar("Error retrieving audio. Please try again.");
      }
    });

    return {
      audioURL,
    };
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
