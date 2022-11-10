<template>
  <div class="px-6 py-7">
    <v-row justify="center" class="ma-0">
      <span class="text-h5 primary--text">Continue using MicDrop Pro?</span>
    </v-row>
    <v-row justify="center" class="my-4">
      <v-icon color="primary" size="20px">{{
        icons.mdiCreditCardRemove
      }}</v-icon>
    </v-row>
    <v-row justify="center" class="ma-0 my-6">
      <span class="text-subtitle-1 grey--text text-center"
        >Your free trial of MicDrop Pro is ending soon!</span
      >
    </v-row>
    <v-row justify="center" class="ma-0 mb-6">
      <span class="text-subtitle-1 grey--text text-center"
        >You will still have access to all free features after your trial
        ends.</span
      >
    </v-row>
    <v-row justify="center" class="ma-0 my-6">
      <span class="text-caption grey--text text-center"
        >To continue using MicDrop Pro, please visit your
        <router-link to="/account_dashboard" target="_blank"
          >account dashboard</router-link
        >
        to subscribe for just $4/month.</span
      >
    </v-row>
    <v-row justify="center" class="ma-0 mt-6">
      <span class="text-caption grey--text text-center"
        >If you do not choose to subscribe, your Pro subscription will be
        automatically
        <router-link to="/account_dashboard" target="_blank">
          cancelled</router-link
        >
        in a few days. You can always resubscribe in your
        <router-link to="/account_dashboard" target="_blank">
          account dashboard</router-link
        >.</span
      >
    </v-row>
    <v-row justify="center" class="ma-0 mt-3">
      <v-btn text color="primary" to="/record?ignore_trial_ending=true"
        >Ignore</v-btn
      >
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { mdiCreditCardRemove } from "@mdi/js";

export default defineComponent({
  setup() {
    const icons = ref({ mdiCreditCardRemove });

    return {
      icons,
    };
  },
});
</script>
