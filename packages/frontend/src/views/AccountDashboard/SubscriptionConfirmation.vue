<template>
  <div class="pa-12">
    <v-row justify="center" class="ma-0 mt-16">
      <v-img
        :src="require('../../assets/logos/blue-logoPRO-alpha-1000w.png')"
        max-width="350px"
        contain
      />
    </v-row>
    <v-row justify="center" class="my-6">
      <span class="text-h4">{{ setupStatus }}</span>
    </v-row>
    <v-row justify="center" class="my-6" v-if="setupStatus === 'Success!'">
      <span class="text-caption grey--text"
        >Simply open Gmail to get started! All Pro features will now be
        available for use!</span
      >
    </v-row>
    <v-row
      justify="center"
      class="my-6 mt-16"
      v-if="setupStatus === 'Success!'"
    >
      <v-btn
        height="125"
        width="125"
        fab
        x-large
        color="red"
        depressed
        href="https://mail.google.com/mail/u/0/#inbox?compose=new"
      >
        <v-icon color="white" size="65px">{{ icons.mdiGmail }}</v-icon>
      </v-btn>
    </v-row>
    <v-row justify="center" class="my-6" v-if="setupStatus === 'Success!'">
      <a
        class="text-h6 red--text mr-1 no-underline"
        href="https://mail.google.com/mail/u/0/#inbox?compose=new"
        >Gmail <v-icon color="red" small>{{ icons.mdiOpenInNew }}</v-icon></a
      >
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { Stripe } from "@stripe/stripe-js";
import getStripe from "../../stripeInstance";
import sl from "../../serviceLocator";
import { mdiGmail, mdiOpenInNew } from "@mdi/js";

export default defineComponent({
  props: {
    setupIntent: {
      type: String,
      required: true,
    },
    setupIntentClientSecret: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const actions = sl.get("globalActions");
    const stripe = ref<Stripe | null>(null);

    const icons = ref({
      mdiGmail,
      mdiOpenInNew,
    });

    onMounted(async () => {
      try {
        stripe.value = await getStripe();

        if (stripe.value) {
          const setupIntentResult = await stripe.value.retrieveSetupIntent(
            props.setupIntentClientSecret
          );

          switch (setupIntentResult.setupIntent?.status) {
            case "succeeded":
              setupStatus.value = "Success!";
              break;

            case "processing":
              setupStatus.value =
                "Setup processing. We'll update you when setup is complete.";
              break;

            case "requires_payment_method":
              setupStatus.value =
                "Payment method setup failed. Please try another payment method.";
              break;

            default:
              setupStatus.value = `Something went wrong: ${setupIntentResult.setupIntent?.status}`;
          }
        } else {
          throw new Error("Stripe not initialized");
        }
      } catch {
        actions.showErrorSnackbar(
          "Error getting payment setup status. Please try again."
        );
      }
    });

    const setupStatus = ref("");

    return {
      setupStatus,
      icons,
    };
  },
});
</script>

<style scoped>
a.no-underline {
  text-decoration: none;
}
</style>
