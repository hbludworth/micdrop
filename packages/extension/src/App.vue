<template>
  <v-app>
    <iframe
      width="200px"
      height="240px"
      :src="iframeSource"
      style="top: 0; left: 0; border: 0"
    />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const iframeSource = ref(
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080/extension/popup"
        : "https://app.sendmicdrop.com/extension/popup"
    );
    return {
      iframeSource,
    };
  },
});
</script>
