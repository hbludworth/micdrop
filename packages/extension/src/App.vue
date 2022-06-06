<template>
  <v-app>
    <iframe
      width="170px"
      height="240px"
      src="http://localhost:8080/extension/popup"
      style="top: 0; left: 0; border: 0"
    />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
