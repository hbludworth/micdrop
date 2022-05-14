<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <mic-drop-snackbar />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import MicDropSnackbar from "./components/base/MicDropSnackbar.vue";

export default defineComponent({
  name: "App",
  components: {
    MicDropSnackbar,
  },
});
</script>
