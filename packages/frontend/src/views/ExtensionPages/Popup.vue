<template>
  <v-col class="pa-0" align="center">
    <v-img :src="logoURL" max-width="140" class="ma-4" />
    <v-btn
      text
      color="primary"
      class="my-1"
      href="http://localhost:8080/account_dashboard"
      target="_blank"
      ><v-icon small class="mr-1">{{ icons.mdiAccount }}</v-icon> Account</v-btn
    >
    <v-btn
      text
      color="primary"
      class="my-1"
      href="http://localhost:8080/tutorial"
      target="_blank"
      ><v-icon small class="mr-1">{{ icons.mdiClipboardList }}</v-icon
      >Tutorial</v-btn
    >
    <v-btn
      text
      color="rgba(212, 175, 55, 1)"
      class="my-1"
      href="http://localhost:8080/upgrade"
      target="_blank"
      ><v-icon small class="mr-1">{{ icons.mdiCheckDecagram }}</v-icon
      >MicDrop Pro</v-btn
    >
    <v-btn
      text
      color="primary"
      class="my-1"
      href="mailto:feedback@sendmicdrop.com?subject=Feedback Report - MicDrop"
      target="_blank"
      ><v-icon small class="mr-1">{{ icons.mdiEmail }}</v-icon
      >Contact Us</v-btn
    >
  </v-col>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import {
  mdiAccount,
  mdiClipboardList,
  mdiCheckDecagram,
  mdiEmail,
} from "@mdi/js";
import sl from "../../serviceLocator";

export default defineComponent({
  setup() {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");

    const icons = ref({
      mdiAccount,
      mdiClipboardList,
      mdiCheckDecagram,
      mdiEmail,
    });

    const logoURL = ref("");
    onMounted(async () => {
      try {
        logoURL.value = await server.getImage("logo.png");
      } catch {
        actions.showErrorSnackbar(
          "Error retrieving logo resource. Please refresh to try again."
        );
      }
    });

    return {
      logoURL,
      icons,
    };
  },
});
</script>
