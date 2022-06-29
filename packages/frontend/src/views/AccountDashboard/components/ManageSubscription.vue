<template>
  <div class="pa-12">
    <v-row class="ma-0 mb-4">
      <span class="text-h4 grey--text">Manage Subscription</span>
    </v-row>
    <v-card flat outlined class="px-4 py-2" width="600">
      <v-row class="ma-0 my-2">
        <span class="grey--text">Current Plan</span>
        <v-spacer />
        <span>{{ displayableSubscriptionLevel }}</span>
      </v-row>
      <v-row class="ma-0 my-2">
        <span class="grey--text">Credit Card</span>
        <v-spacer />
        <span v-if="paymentMethodLoading">Loading...</span>
        <span v-else>{{
          paymentMethod && paymentMethod.brand && paymentMethod.last4
            ? `${paymentMethod.brand.toUpperCase()} **** ${paymentMethod.last4}`
            : "None"
        }}</span>
      </v-row>
      <v-row v-if="subscriptionLevel !== 'free'" class="ma-0 my-2">
        <a @click="cancelSubscriptionDialog = true">
          Cancel Subscription
          <v-icon color="primary">{{ icons.mdiArrowRightThin }}</v-icon>
        </a>
      </v-row>
      <v-row v-if="subscriptionLevel === 'free'" class="ma-0 my-2">
        <router-link to="/upgrade" class="no-underline">
          Upgrade to MicDrop Pro
          <v-icon color="primary">{{ icons.mdiArrowRightThin }}</v-icon>
        </router-link>
      </v-row>
    </v-card>
    <mic-drop-dialog
      v-model="cancelSubscriptionDialog"
      title="Are you sure you want to cancel?"
      submitText="Yes, Continue"
      closeOnSubmit
      @submit="cancelSubscription"
      >Are you sure you want to permanently cancel your subscription to MicDrop
      Pro? You will no longer have access to features such as unlimited
      recording time, playback customization, past recordings access and more.
      You may re-subscribe at any time. You will continue to have access to the
      Pro features until the end of the current billing cycle.
    </mic-drop-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
} from "@vue/composition-api";
import { mdiArrowRightThin } from "@mdi/js";
import sl from "../../../serviceLocator";
import MicDropDialog from "../../../components/base/MicDropDialog.vue";
import { PaymentMethodResponse } from "types";
import getStripe from "../../../stripeInstance";
import { Stripe } from "@stripe/stripe-js";

export default defineComponent({
  components: {
    MicDropDialog,
  },
  setup() {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");
    const store = sl.get("store");

    const icons = ref({
      mdiArrowRightThin,
    });

    const subscriptionLevel = computed(() =>
      store.getters.user ? store.getters.user.subscriptionLevel : "free"
    );

    const displayableSubscriptionLevel = computed(() => {
      if (subscriptionLevel.value === "free") {
        return "Free";
      } else if (subscriptionLevel.value === "pro") {
        return "MicDrop Pro";
      } else {
        return "Unknown";
      }
    });

    const cancelSubscriptionDialog = ref(false);

    const cancelSubscription = async () => {
      try {
        await server.cancelSubscription();
        store.setUser({
          ...store.getters.user!,
          subscriptionLevel: "free",
        });
      } catch {
        actions.showErrorSnackbar(
          "Error canceling subscription. Please try again."
        );
      }
    };

    const paymentMethod = ref<PaymentMethodResponse>();
    const paymentMethodLoading = ref(false);

    onMounted(async () => {
      try {
        paymentMethodLoading.value = true;
        stripe.value = await getStripe();
        paymentMethod.value = await server.getPaymentMethod();
      } catch {
        actions.showErrorSnackbar(
          "Error loading payment method information. Please try again."
        );
      } finally {
        paymentMethodLoading.value = false;
      }
    });

    const stripe = ref<Stripe | null>(null);

    return {
      icons,
      cancelSubscription,
      cancelSubscriptionDialog,
      subscriptionLevel,
      displayableSubscriptionLevel,
      paymentMethod,
      paymentMethodLoading,
    };
  },
});
</script>

<style scoped>
a.no-underline {
  text-decoration: none;
}
</style>
