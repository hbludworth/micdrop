<template>
  <v-container class="ma-0 mt-9" fluid>
    <v-row justify="center">
      <v-col cols="12" align="center">
        <v-row justify="center">
          <router-link to="/" target="_blank"
            ><v-img
              :src="require('../../assets/logos/blue-logo-alpha-700w.png')"
              :max-width="detailed ? '175px' : '120px'"
              contain
          /></router-link>
        </v-row>
        <v-row justify="center" class="mb-2 mt-8">
          <span class="text-h5 grey--text">{{
            i18n.t("extension.welcome")
          }}</span>
        </v-row>
        <v-row v-if="detailed" justify="center" class="mb-4 mt-2 mx-16">
          <span class="text-h6 grey--text">{{
            i18n.t("extension.beforeMessage")
          }}</span>
        </v-row>
        <v-row justify="center" class="my-4">
          <v-btn color="primary" to="/tutorial" target="_blank" class="mx-2">{{
            i18n.t("extension.getStarted")
          }}</v-btn>
        </v-row>
        <v-row justify="center" :class="{ 'mb-4': detailed }" class="mt-4">
          <v-btn
            color="primary"
            to="/login"
            target="_blank"
            class="ml-1"
            text
            >{{ i18n.t("extension.signIn") }}</v-btn
          >
        </v-row>
        <v-row v-if="detailed" justify="center" class="mt-4 mb-0 mx-16">
          <span class="text-caption grey--text"
            >{{ i18n.t("extension.refresh") }}
          </span>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import i18n from "../../i18n";

export default defineComponent({
  props: {
    detailed: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      i18n,
    };
  },
});
</script>
