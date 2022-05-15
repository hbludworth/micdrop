<template>
  <div class="pt-12 mt-12">
    <v-row class="justify-center">
      <router-link to="/"
        ><v-img :src="logoURL" max-width="300px" class="mb-12 mt-8"
      /></router-link>
    </v-row>
    <v-progress-linear v-if="verifyingCode" indeterminate />
    <v-row justify="center">
      <v-card class="mt-12 pa-3 max-auto" width="600" elevation="24">
        <v-card-title
          ><h2 class="mb-4 primary--text">{{ title }}</h2></v-card-title
        >
        <v-card-text class="d-flex flex-column">
          <v-col v-if="serverError">
            {{ serverError }}
          </v-col>
          <v-col v-else-if="!submitted">
            <v-text-field
              outlined
              v-model="newPassword"
              label="New password"
              type="password"
              autofocus
            />
            <v-text-field
              outlined
              v-model="confirmNewPassword"
              label="Confirm new password"
              type="password"
            />
            <span class="subtitle error--text" v-if="formError">
              {{ formError }}
            </span>
          </v-col>
          <v-col v-else> Your password has successfully been reset. </v-col>

          <v-card-actions>
            <v-btn color="primary" v-if="serverError" to="/send_reset_password"
              >Try again</v-btn
            >
            <v-btn
              v-else-if="!submitted"
              color="primary"
              :disabled="
                !newPassword || !confirmNewPassword || Boolean(formError)
              "
              @click="resetPassword"
              ><v-progress-circular
                v-if="loading"
                indeterminate
                size="25"
                width="3"
              />
              <span v-else>Submit</span>
            </v-btn>
            <v-btn class="test-action" color="primary" v-else to="/login"
              >Login</v-btn
            >
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
    const newPassword = ref("");
    const confirmNewPassword = ref("");
    const serverError = ref("");
    const loading = ref(false);
    const submitted = ref(false);
    const verifyingCode = ref(true);
    const resettingEmail = ref("");

    const server = sl.get("serverProxy");
    const router = sl.get("router");

    const oobCode = router.currentRoute.query.oobCode as string;

    const logoURL = ref("");

    const title = computed(() =>
      serverError.value
        ? "Cannot reset password"
        : `Resetting password for ${resettingEmail.value}`
    );

    const handleAuthError = (err: { code: string; message: string }) => {
      const { code } = err;
      if (code === "auth/expired-action-code") {
        serverError.value = "The code you have provided is expired.";
      } else if (code === "auth/invalid-action-code") {
        serverError.value = "The code you have provided is invalid.";
      } else if (code === "auth/user-not-found") {
        serverError.value = "No user was found for the given code.";
      } else {
        serverError.value = "There was an unknown error.";
      }
    };

    onMounted(async () => {
      try {
        const email = await server.verifyPasswordResetCode(oobCode);
        logoURL.value = await server.getImage("logo.png");
        resettingEmail.value = email;
      } catch (err) {
        handleAuthError(err as any);
      } finally {
        verifyingCode.value = false;
      }
    });

    const formError = computed(() => {
      if (newPassword.value !== confirmNewPassword.value) {
        return "Passwords do not match";
      }

      if (newPassword.value.length < 8) {
        return "Passwords must be at least 8 characters long";
      }

      return "";
    });

    const resetPassword = async () => {
      try {
        loading.value = true;

        await server.resetPassword(oobCode, newPassword.value);
      } catch (err) {
        handleAuthError(err as any);
      } finally {
        loading.value = false;
        submitted.value = true;
      }
    };

    return {
      newPassword,
      confirmNewPassword,
      loading,
      resetPassword,
      submitted,
      formError,
      title,
      serverError,
      resettingEmail,
      logoURL,
    };
  },
});
</script>
