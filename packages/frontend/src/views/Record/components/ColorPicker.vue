<template>
  <v-row class="ma-0" justify="center">
    <v-col class="pa-0" cols="1">
      <v-btn
        icon
        color="primary"
        @click="showSlider = !showSlider"
        class="ml-1 mt-3"
        ><v-icon>{{ icons.mdiPalette }}</v-icon></v-btn
      >
    </v-col>
    <v-col class="pa-0" cols="8">
      <v-color-picker
        hide-canvas
        :show-swatches="!showSlider"
        :hide-sliders="!showSlider"
        hide-inputs
        hide-mode-switch
        mode="hexa"
        swatches-max-height="70px"
        :swatches="swatches"
        v-model="color"
      />
    </v-col>
    <v-col class="pa-0" cols="3">
      <v-text-field
        outlined
        dense
        class="mt-3"
        hide-details
        v-model="hexCode"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import { mdiPalette } from "@mdi/js";

export default defineComponent({
  props: {
    startingColor: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const showSlider = ref(false);

    const swatches = ref<string[][]>([
      ["#ca4640", "#3a79d9"],
      ["#e46c36", "#9a66d2"],
      ["#f6cd53", "#de6d7c"],
      ["#b5c147", "#FFFFFF"],
      ["#61bbb7", "#000000"],
    ]);

    const color = ref(props.startingColor);
    watch(color, () => {
      hexCode.value = color.value;
      emit("color-changed", color.value);
    });

    const hexCode = ref(props.startingColor);
    watch(hexCode, () => {
      if (hexCode.value.length === 7) {
        color.value = hexCode.value;
      }
    });

    const icons = ref({ mdiPalette });

    return { showSlider, swatches, icons, color, hexCode };
  },
});
</script>
