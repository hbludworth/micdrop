<template>
  <div class="px-6 py-7">
    <v-row justify="center" class="ma-0">
      <span class="text-h5 primary--text">Subscription Payment Error</span>
    </v-row>
    <v-row justify="center" class="my-4">
      <v-icon color="primary" size="20px">{{
        icons.mdiCreditCardRemove
      }}</v-icon>
    </v-row>
    <v-row justify="center" class="ma-0 my-6">
      <span class="text-subtitle-1 grey--text text-center"
        >Looks like we had an issue collectiong this month's subscription
        payment</span
      >
    </v-row>
    <v-row justify="center" class="ma-0 my-6">
      <span class="text-caption grey--text text-center"
        >To continue using MicDrop Pro, please visit your
        <router-link to="/account_dashboard" target="_blank"
          >account dashboard</router-link
        >
        to update your default payment method or update your subscription
        options.</span
      >
    </v-row>
    <v-row justify="center" class="ma-0 mt-6">
      <span class="text-caption grey--text text-center"
        >If you do not update your default payment method, we will attempt
        payment a few more times over the next few days. If all attempts fail,
        your Pro subscription will be automatically
        <router-link to="/account_dashboard" target="_blank">
          cancelled</router-link
        >.</span
      >
    </v-row>
    <v-row justify="center" class="ma-0 mt-3">
      <v-btn text color="primary" to="/record?ignore_past_due=true"
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
