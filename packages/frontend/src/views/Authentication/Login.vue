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
          <v-text-field v-model="email" label="Email" outlined />
          <v-text-field
            v-model="password"
            label="Password"
            outlined
            type="password"
            @keyup.enter="login"
          />
          <p class="subtitle error--text">{{ errorMessage }}</p>
          <v-btn text to="/send_reset_password" color="primary"
            >Forgot your password?</v-btn
          >
          <v-btn text to="/register" color="primary">Register</v-btn>
          <br />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="login" color="primary" :disabled="!email || !password">
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="25"
              width="3"
            />
            <span v-else>Sign In</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { LoginPayload } from "types";
import sl from "../../serviceLocator";

export default defineComponent({
  name: "Login",
  beforeRouteEnter: (_to, _from, next) => {
    next(() => {
      const store = sl.get("store");
      const router = sl.get("router");
      if (store.getters.isAuthenticated) {
        router.push("/");
      }
    });
  },
  setup() {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");
    const router = sl.get("router");

    const loading = ref(false);

    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const logoURL = ref("");

    const login = async () => {
      errorMessage.value = "";
      loading.value = true;

      const loginPayload: LoginPayload = {
        email: email.value,
        password: password.value,
      };

      try {
        await server.login(loginPayload);
        router.push("/account_dashboard");
      } catch (err) {
        const errorCode = (err as any).code;
        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/user-not-found"
        ) {
          errorMessage.value = "Invalid Credentials";
        } else if ((err as any).message) {
          errorMessage.value = (err as any).message;
        } else {
          errorMessage.value = "There was an unknown error";
        }
      } finally {
        loading.value = false;
      }
    };

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
      password,
      errorMessage,
      login,
      logoURL,
      loading,
    };
  },
});
</script>
