<template>
  <div>
    <v-row v-if="!onlyShowButtons" class="justify-center pt-12 mt-12">
      <router-link to="/"
        ><v-img
          :src="require('../../assets/logos/blue-logo-alpha-700w.png')"
          max-width="300px"
          class="mb-12 mt-8"
          contain
      /></router-link>
    </v-row>
    <v-row justify="center">
      <v-card
        class="mt-12 pa-3 max-auto"
        width="600"
        :elevation="onlyShowButtons ? 0 : 24"
      >
        <v-card-title v-if="!onlyShowButtons"
          ><h2 class="mb-2 primary--text">Sign In</h2></v-card-title
        >
        <v-card-text class="d-flex flex-column">
          <v-row justify="center" class="ma-0">
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
          <v-row justify="center" class="ma-0">
            <v-btn
              color="primary"
              class="mb-n4"
              width="300"
              x-large
              dark
              :to="`/login_with_email?redirect=${redirectURL}`"
            >
              <v-icon small class="mr-2">{{ icons.mdiEmail }}</v-icon>
              Sign In with Email
            </v-btn>
          </v-row>
        </v-card-text>
        <v-card-actions
          ><p class="subtitle error--text mt-3">
            {{ errorMessage }}
          </p></v-card-actions
        >
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import sl from "../../serviceLocator";
import { mdiGoogle, mdiArrowLeft, mdiEmail } from "@mdi/js";

export default defineComponent({
  name: "Login",
  props: {
    redirectURL: {
      type: String,
      required: true,
    },
    onlyShowButtons: {
      type: Boolean,
      default: false,
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

    return {
      errorMessage,
      loading,
      loginWithGoogle,
      icons,
    };
  },
});
</script>
