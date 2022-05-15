<template>
  <div class="pt-12 mt-12">
    <v-row class="justify-center">
      <router-link to="/"
        ><v-img :src="logoURL" max-width="300px" class="mb-12 mt-8"
      /></router-link>
    </v-row>
    <v-row justify="center">
      <v-card class="mt-12 pa-3 max-auto" width="600" elevation="24">
        <v-card-title><h2 class="mb-4 primary--text">Sign In</h2></v-card-title>
        <v-card-text class="d-flex flex-column">
          <div class="d-flex flex-column" v-if="!emailSent">
            <span
              >Enter your email below. A link will be sent to you allowing you
              to reset your password.</span
            >
            <v-text-field
              class="mt-2"
              autofocus
              v-model="email"
              outlined
              label="Email"
              @keypress.enter="sendEmail"
            />
          </div>
          <div v-else class="d-flex flex-column">
            Please check your inbox. A link has been sent to you that will help
            you reset your password.
            <router-link to="/login">Go back to login</router-link>
          </div>
          <v-card-actions>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!email"
              @click="sendEmail"
              v-if="!emailSent"
              ><v-progress-circular
                v-if="loading"
                indeterminate
                size="25"
                width="3"
              />
              <span v-else>Submit</span>
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
} from "@vue/composition-api";
import sl from "../serviceLocator";

export default defineComponent({
  setup() {
    const email = ref("");
    const loading = ref(false);
    const emailSent = ref(false);

    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");

    const logoURL = ref("");

    const sendEmail = async () => {
      try {
        loading.value = true;
        await server.sendResetPasswordEmail(email.value);
        emailSent.value = true;
      } catch (err) {
        const { code, message } = err as any;
        if (code === "auth/invalid-email") {
          actions.showErrorSnackbar(
            "The email you have provided is invalid. Please try again."
          );
        } else if (code === "auth/user-not-found") {
          actions.showErrorSnackbar(
            "There is no user associated with the given email address."
          );
        } else {
          actions.showErrorSnackbar(message);
        }
      } finally {
        loading.value = false;
      }
    };

    const title = computed(() =>
      emailSent.value ? "Check your email" : "Reset password"
    );

    onMounted(async () => {
      try {
        logoURL.value = await server.getImage("logo.png");
      } catch {
        actions.showErrorSnackbar(
          "Error loading image resource. Please try again."
        );
      }
    });

    return {
      email,
      loading,
      emailSent,
      title,
      sendEmail,
      logoURL,
    };
  },
});
</script>

<style></style>
