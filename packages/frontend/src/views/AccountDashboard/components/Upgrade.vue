<template>
  <div class="pa-12">
    <div v-if="!paymentStepReady">
      <v-row justify="center" class="ma-0 mt-16">
        <router-link to="/"
          ><v-img
            :src="require('../../../assets/logos/blue-logoPRO-alpha-1000w.png')"
            max-width="350px"
            contain
        /></router-link>
      </v-row>
      <v-row justify="center" class="my-6">
        <span class="text-h6 grey--text"
          >MicDrop Pro brings a ton of new features to help you do more, improve
          credibility, and save time!</span
        >
      </v-row>
      <v-row justify="center" class="mt-16 mb-6">
        <span class="text-h5 grey--text"
          >All of the same great features, plus:</span
        >
      </v-row>
      <v-row justify="center" class="mx-0 my-2">
        <span class="text-button grey--text">
          <v-icon color="green" class="mr-1">{{ icons.mdiCheckCircle }}</v-icon>
          Unlimited audio messages per month
        </span>
      </v-row>
      <v-row justify="center" class="mx-0 my-2">
        <span class="text-button grey--text">
          <v-icon color="green" class="mr-1">{{ icons.mdiCheckCircle }}</v-icon>
          Unlimited audio cloud storage
        </span>
      </v-row>
      <v-row justify="center" class="mx-0 my-2">
        <span class="text-button grey--text">
          <v-icon color="green" class="mr-1">{{ icons.mdiCheckCircle }}</v-icon>
          Label and resend previously recordings
        </span>
      </v-row>
      <v-row justify="center" class="mx-0 my-2">
        <span class="text-button grey--text">
          <v-icon color="green" class="mr-1">{{ icons.mdiCheckCircle }}</v-icon>
          Customize playback interface
        </span>
      </v-row>
      <v-row justify="center" class="mx-0 my-2">
        <span class="text-button grey--text">
          <v-icon color="green" class="mr-1">{{ icons.mdiCheckCircle }}</v-icon>
          Read Receipts
        </span>
      </v-row>
      <v-row justify="center" class="mt-16 mb-6">
        <span class="text-h3 grey--text font-weight-bold">$4/month</span>
      </v-row>
      <v-row justify="center" class="my-6">
        <span class="text-h6 grey--text"
          >Get started with a 14-day free trial!</span
        >
      </v-row>
      <v-row class="ma-0 my-6" justify="center">
        <v-btn @click="upgrade" color="primary" x-large>Start Now</v-btn>
      </v-row>
    </div>
    <div v-show="paymentStepReady">
      <v-row class="ma-0 mt-8 mb-4" justify="center">
        <span class="text-h3 grey--text">Enter Payment Details</span>
      </v-row>
      <v-row justify="center" class="mt-6 mb-16">
        <v-col cols="4" />
        <v-col cols="4">
          <v-row class="ma-0" justify="center">
            <span class="text-caption grey--text text-center"
              >14-day trial beginning today. After the trial period, you will be
              billed $4/month for access to the Pro features. Additional fees
              may apply. Cancel at any time.</span
            >
          </v-row>
        </v-col>
        <v-col cols="4" />
      </v-row>
      <v-row class="ma-0" justify="center">
        <v-card width="800">
          <v-card-text>
            <div id="payment-element" />
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="ma-0" justify="center">
        <v-btn
          v-if="paymentStepReady"
          @click="confirmPayment"
          color="primary"
          class="my-12"
          x-large
        >
          <v-progress-circular
            v-if="confirmPaymentLoading"
            indeterminate
            size="25"
            width="3"
          />
          <span v-else>Submit</span>
        </v-btn>
      </v-row>
      <v-row class="ma-0" justify="center">
        <span v-if="paymentErrorMessage" class="red--text">{{
          paymentErrorMessage
        }}</span>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
} from "@vue/composition-api";
import sl from "../../../serviceLocator";
import { CreateSubscriptionResponse } from "types";
import getStripe from "../../../stripeInstance";
import {
  Stripe,
  StripeElements,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { mdiCheckCircle } from "@mdi/js";

export default defineComponent({
  setup() {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");
    const store = sl.get("store");

    const icons = ref({ mdiCheckCircle });

    const customerId = computed(() => store.getters.user?.stripeCustomerId);

    const subscriptionResponse = ref<CreateSubscriptionResponse>();

    const upgrade = async () => {
      try {
        if (customerId.value) {
          subscriptionResponse.value = await server.createProSubscription(
            customerId.value
          );
          paymentStepReady.value = true;
        } else {
          throw new Error("Customer ID undefined");
        }
      } catch {
        actions.showErrorSnackbar(
          "Error creating subscription. Please try again."
        );
      }
    };

    const paymentStepReady = ref(false);

    watch(paymentStepReady, () => {
      if (
        !!paymentStepReady.value &&
        !!subscriptionResponse.value &&
        !!stripe.value
      ) {
        if (subscriptionResponse.value.clientSecret) {
          const options: StripeElementsOptions = {
            clientSecret: subscriptionResponse.value.clientSecret,
          };

          elements.value = stripe.value.elements(options);

          const paymentElement = elements.value.create("payment");
          paymentElement.mount("#payment-element");
        } else {
          actions.showErrorSnackbar(
            "Error initializing payment setup. Please try again."
          );
        }
      }
    });

    const stripe = ref<Stripe | null>(null);
    const elements = ref<StripeElements>();

    onMounted(async () => {
      try {
        stripe.value = await getStripe();
      } catch {
        actions.showErrorSnackbar("Error loading resources. Please try again.");
      }
    });

    const paymentErrorMessage = ref("");
    const confirmPaymentLoading = ref(false);
    const confirmPayment = async () => {
      try {
        paymentErrorMessage.value = "";
        confirmPaymentLoading.value = true;
        if (!!stripe.value && !!elements.value) {
          const { error } = await stripe.value.confirmSetup({
            elements: elements.value,
            confirmParams: {
              return_url:
                process.env.NODE_ENV === "development"
                  ? "http://localhost:8080/subscription_confirmation"
                  : "https://sendmicdrop.com/subscription_confirmation",
            },
          });

          if (error) {
            console.log("ERROR HERE");
            console.log(error);
            paymentErrorMessage.value = error.message || "ERROR";
          } else {
            console.log("Cool");
          }
        } else {
          throw new Error("Stripe not initialized");
        }
      } catch {
        actions.showErrorSnackbar(
          "Error confirming payment. Please try again."
        );
      } finally {
        confirmPaymentLoading.value = false;
      }
    };

    return {
      upgrade,
      paymentStepReady,
      confirmPayment,
      confirmPaymentLoading,
      paymentErrorMessage,
      icons,
    };
  },
});
</script>
