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
        <v-btn color="primary" text width="75" @click="goBack">
          <v-icon small class="mr-1">{{ icons.mdiArrowLeft }}</v-icon>
          Back</v-btn
        >
        <v-card-title
          ><h2 class="mb-2 primary--text">Sign In With Email</h2></v-card-title
        >
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
import { defineComponent, ref } from "@vue/composition-api";
import sl from "../../serviceLocator";
import { LoginPayload } from "types";
import { mdiArrowLeft } from "@mdi/js";

export default defineComponent({
  props: {
    redirectURL: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const server = sl.get("serverProxy");
    const router = sl.get("router");

    const errorMessage = ref("");
    const loading = ref(false);

    const email = ref("");
    const password = ref("");

    const icons = ref({
      mdiArrowLeft,
    });

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
          errorMessage.value = "There was an unknown authentication error";
        }
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      history.back();
    };

    return {
      email,
      password,
      errorMessage,
      loading,
      login,
      icons,
      goBack,
    };
  },
});
</script>
