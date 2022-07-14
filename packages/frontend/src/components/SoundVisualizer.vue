<template>
  <v-card
    class="d-flex d-inline align-center px-1"
    :class="mini ? 'rounded-pill' : ''"
    :height="mini ? 60 : 80"
    flat
  >
    <v-card
      v-for="(value, idx) in currentFrequencyData"
      :key="idx"
      :color="getColor(idx)"
      :width="mini ? 8 : 15"
      :height="getHeight(idx)"
      class="rounded-lg"
      :class="{
        'ml-1': mini,
        'mx-1': !mini,
        'mr-3': mini && idx === currentFrequencyData.length - 1,
        'ml-3': mini && idx === 0,
        'rounded-lg': !mini,
        'rounded-md': mini,
      }"
      flat
    />
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
  props: {
    progressFraction: {
      type: Number,
      required: false,
    },
    mini: {
      type: Boolean,
      default: false,
    },
    currentFrequencyData: {
      type: Array as PropType<Array<number>>,
      required: true,
    },
  },
  setup(props) {
    const getHeight = (index: number) => {
      const isFirstHalf = index < 8;
      const indexToUse = isFirstHalf ? index : 15 - index;
      const valueToUse = props.currentFrequencyData[indexToUse];

      const indexMultiplier = indexToUse + 1;
      const calculatedHeight =
        (valueToUse / 128) * indexMultiplier * indexMultiplier * 2 + 10;

      if (calculatedHeight <= 80 && calculatedHeight >= 20) {
        return props.mini ? calculatedHeight / 2 : calculatedHeight;
      } else if (calculatedHeight > 80) {
        return props.mini ? 40 : 80;
      } else {
        return props.mini ? 12 : 20;
      }
    };

    const getColor = (index: number) => {
      const blue = "66, 134, 245";
      const yellow = "245, 180, 0,";
      const red = "234, 66, 53,";
      const green = "52, 168, 83,";
      switch (index) {
        case 0:
        case 1:
        case 2:
        case 3:
          return `rgba(${blue} ${getAlpha(index)})`;
        case 4:
        case 5:
        case 10:
        case 11:
          return `rgba(${yellow} ${getAlpha(index)})`;
        case 6:
        case 7:
        case 8:
        case 9:
          return `rgba(${red} ${getAlpha(index)})`;
        case 12:
        case 13:
        case 14:
        case 15:
          return `rgba(${green} ${getAlpha(index)})`;
        default:
          return `rgba(${red} ${getAlpha(index)})`;
      }
    };

    const getAlpha = (index: number) => {
      if (
        props.progressFraction === undefined ||
        props.progressFraction > index + 1
      ) {
        return 1;
      }
      if (props.progressFraction < index) {
        return 0.2;
      }

      const decimalValue = props.progressFraction % 1;
      const adjustedDecimalValue = 0.7 * decimalValue + 0.2;
      return adjustedDecimalValue;
    };

    return {
      getHeight,
      getColor,
    };
  },
});
</script>
