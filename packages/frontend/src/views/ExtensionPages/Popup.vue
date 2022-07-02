<template>
  <v-col class="pa-0" align="center">
    <v-img
      v-if="subscriptionLevel === 'free'"
      :src="require('../../assets/logos/blue-logo-alpha-700w.png')"
      max-width="140"
      class="ma-4"
      contain
    />
    <v-img
      v-else-if="subscriptionLevel === 'pro'"
      :src="require('../../assets/logos/blue-logoPRO-alpha-1000w.png')"
      max-width="180"
      class="ma-4"
      contain
    />
    <v-btn
      text
      color="primary"
      class="my-1"
      to="/account_dashboard"
      target="_blank"
      ><v-icon small class="mr-1">{{ icons.mdiAccount }}</v-icon
      >Account</v-btn
    >
    <v-btn text color="primary" class="my-1" to="/tutorial" target="_blank"
      ><v-icon small class="mr-1">{{ icons.mdiClipboardList }}</v-icon
      >Tutorial</v-btn
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
    <v-btn
      v-if="subscriptionLevel === 'free'"
      text
      class="my-1"
      color="primary"
      to="/upgrade"
      target="_blank"
    >
      <v-img
        :src="require('../../assets/logos/blue-logoPRO-NoDrop-alpha-1000w.png')"
        max-width="100"
        class="ma-4"
        contain
      />
    </v-btn>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";
import {
  mdiAccount,
  mdiClipboardList,
  mdiCheckDecagram,
  mdiEmail,
} from "@mdi/js";
import sl from "../../serviceLocator";

export default defineComponent({
  setup() {
    const store = sl.get("store");

    const subscriptionLevel = computed(() =>
      store.getters.user ? store.getters.user.subscriptionLevel : "free"
    );

    const icons = ref({
      mdiAccount,
      mdiClipboardList,
      mdiCheckDecagram,
      mdiEmail,
    });

    return {
      icons,
      subscriptionLevel,
    };
  },
});
</script>
