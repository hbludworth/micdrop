<template>
  <div class="pt-12 mt-12">
    <v-row class="justify-center">
      <router-link to="/"
        ><v-img
          :src="require('../../assets/logos/blue-logo-alpha-700w.png')"
          max-width="300px"
          class="mb-12 mt-8"
          contain
      /></router-link>
    </v-row>
    <v-row justify="center">
      <v-card class="mt-12 pa-3 max-auto" width="600" elevation="24">
        <v-card-title><h2 class="mb-2 primary--text">Sign In</h2></v-card-title>
        <v-card-text class="d-flex flex-column">
          <v-row v-if="!signingInWithEmail" justify="center" class="ma-0">
            <v-btn
              color="red"
              class="mb-6"
              @click="loginWithGoogle"
              width="300"
              x-large
              dark
            >
              <v-icon small class="mr-2">{{ icons.mdiGoogle }}</v-icon>
              Sign In with Google
            </v-btn>
          </v-row>
          <v-row v-if="!signingInWithEmail" justify="center" class="ma-0">
            <v-btn
              color="primary"
              class="mb-n4"
              @click="signingInWithEmail = true"
              width="300"
              x-large
              dark
            >
              <v-icon small class="mr-2">{{ icons.mdiEmail }}</v-icon>
              Sign In with Email
            </v-btn>
          </v-row>
          <v-btn
            v-if="signingInWithEmail"
            color="primary"
            class="mb-4"
            @click="signingInWithEmail = false"
            text
            width="75"
          >
            <v-icon small class="mr-1">{{ icons.mdiArrowLeft }}</v-icon>
            Back</v-btn
          >
          <v-text-field
            v-if="signingInWithEmail"
            v-model="email"
            label="Email"
            outlined
          />
          <v-text-field
            v-if="signingInWithEmail"
            v-model="password"
            label="Password"
            outlined
            type="password"
            @keyup.enter="login"
          />
          <p class="subtitle error--text">{{ errorMessage }}</p>
          <v-btn
            v-if="signingInWithEmail"
            text
            to="/send_reset_password"
            color="primary"
            >Forgot your password?</v-btn
          >
          <v-btn v-if="signingInWithEmail" text to="/register" color="primary"
            >Register</v-btn
          >
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
import { defineComponent, ref } from "@vue/composition-api";
import { LoginPayload } from "types";
import sl from "../../serviceLocator";
import { mdiGoogle, mdiArrowLeft, mdiEmail } from "@mdi/js";

export default defineComponent({
  name: "Login",
  props: {
    redirectURL: {
      type: String,
      required: true,
    },
  },
  beforeRouteEnter: (_to, _from, next) => {
    next(() => {
      const store = sl.get("store");
      const router = sl.get("router");
      if (store.getters.isAuthenticated) {
        router.push("/");
      }
    });
  },
  setup(props) {
    const server = sl.get("serverProxy");
    const router = sl.get("router");

    const loading = ref(false);

    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const icons = ref({
      mdiGoogle,
      mdiArrowLeft,
      mdiEmail,
    });

    const loginWithGoogle = async () => {
      loading.value = true;
      try {
        await server.loginWithGoogle();
        router.push(props.redirectURL);
      } catch (error) {
        errorMessage.value = "Error signing in with Google";
      } finally {
        loading.value = false;
      }
    };

    const login = async () => {
      errorMessage.value = "";
      loading.value = true;

      const loginPayload: LoginPayload = {
        email: email.value,
        password: password.value,
      };

      try {
        await server.login(loginPayload);
        router.push(props.redirectURL);
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

    const signingInWithEmail = ref(false);

    return {
      email,
      password,
      errorMessage,
      login,
      loading,
      loginWithGoogle,
      icons,
      signingInWithEmail,
    };
  },
});
</script>
