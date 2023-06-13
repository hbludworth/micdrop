<template>
  <v-col class="pa-0" align="center">
    <v-img
      :src="require('../../assets/logos/blue-logo-alpha-700w.png')"
      max-width="140"
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
      >{{ i18n.t('extension.account') }}</v-btn
    >
    <v-btn text color="primary" class="my-1" to="/onboard" target="_blank"
      ><v-icon small class="mr-1">{{ icons.mdiClipboardList }}</v-icon
      >{{ i18n.t('extension.tutorial') }}</v-btn
    >
    <v-btn
      text
      color="primary"
      class="my-1"
      href="mailto:feedback@sendmicdrop.com?subject=Feedback Report - MicDrop"
      target="_blank"
      ><v-icon small class="mr-1">{{ icons.mdiEmail }}</v-icon
      >{{ i18n.t('extension.contactUs') }}</v-btn
    >
  </v-col>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import {
  mdiAccount,
  mdiClipboardList,
  mdiCheckDecagram,
  mdiEmail,
} from '@mdi/js';
import i18n from '../../i18n';

export default defineComponent({
  setup() {
    const icons = ref({
      mdiAccount,
      mdiClipboardList,
      mdiCheckDecagram,
      mdiEmail,
    });

    return {
      icons,
      i18n,
    };
  },
});
</script>
