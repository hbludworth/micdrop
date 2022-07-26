<template>
  <v-chip
    :color="customPlaybackOption.backgroundColor"
    class="font-weight-medium"
    @click="$emit('selected')"
    :outlined="!isSelected"
    :text-color="isSelected ? 'white' : customPlaybackOption.backgroundColor"
    :class="{ 'chip-border': isSelected }"
  >
    <v-img
      v-if="customPlaybackOption.circleImageUrl"
      class="rounded-circle mr-1 ml-n1"
      max-width="20"
      max-height="20"
      :src="customPlaybackOption.circleImageUrl"
    />
    <v-icon
      v-else
      size="23px"
      :color="isSelected ? 'white' : customPlaybackOption.backgroundColor"
      class="mr-1 ml-n2"
      >{{ icons.mdiPlayCircle }}</v-icon
    >
    {{ customPlaybackOption.name }}</v-chip
  >
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "@vue/composition-api";
import { CustomPlaybackDisplay } from "types";
import { mdiPlayCircle } from "@mdi/js";

export default defineComponent({
  props: {
    customPlaybackOption: {
      type: Object as PropType<CustomPlaybackDisplay>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const icons = ref({
      mdiPlayCircle,
    });

    return {
      icons,
    };
  },
});
</script>

<style scoped>
.chip-border {
  outline: 2px solid white;
}
</style>
