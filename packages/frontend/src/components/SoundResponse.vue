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
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
} from "@vue/composition-api";

export default defineComponent({
  props: {
    mediaStream: {
      type: MediaStream,
      required: false,
    },
    audioElement: {
      type: HTMLAudioElement,
      required: false,
    },
    progressFraction: {
      type: Number,
      required: false,
    },
    mini: {
      type: Boolean,
      default: false,
    },
    isPlaying: {
      type: Boolean,
      required: true,
    },
    autoStart: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    const currentFrequencyData = ref<number[]>([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    const targetFrequencyData = ref<number[]>([]);

    const animationCancelled = ref(false);

    const getHeight = (index: number) => {
      const isFirstHalf = index < 8;
      const indexToUse = isFirstHalf ? index : 15 - index;
      const valueToUse = currentFrequencyData.value[indexToUse];

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
      switch (index) {
        case 0:
        case 1:
        case 2:
        case 3:
          return `rgba(66, 134, 245, ${getAlpha(index)})`; // blue
        case 4:
        case 5:
        case 10:
        case 11:
          return `rgba(245, 180, 0, ${getAlpha(index)})`; // yellow
        case 6:
        case 7:
        case 8:
        case 9:
          return `rgba(234, 66, 53, ${getAlpha(index)})`; // red
        case 12:
        case 13:
        case 14:
        case 15:
          return `rgba(52, 168, 83, ${getAlpha(index)})`; // green
        default:
          return `rgba(234, 66, 53, ${getAlpha(index)})`; // red
      }
    };

    const getAlpha = (index: number) => {
      if (props.progressFraction === undefined) {
        return 1;
      }
      if (props.progressFraction > index + 1) {
        return 1;
      }
      if (props.progressFraction < index) {
        return 0.2;
      }

      const decimalValue = props.progressFraction % 1;
      const adjustedDecimalValue = 0.7 * decimalValue + 0.2;
      return adjustedDecimalValue;
    };

    let then = 0;
    let now = 0;
    let updateCount = 0;
    const handleAnimation = () => {
      if (!animationCancelled.value) {
        now = Date.now();
        if (analyzer.value && dataArray.value && now > then + 250) {
          analyzer.value.getByteFrequencyData(dataArray.value);
          targetFrequencyData.value = Array.from(dataArray.value);
          then = now;
        } else if (
          analyzer.value &&
          dataArray.value &&
          targetFrequencyData.value.length > 0
        ) {
          currentFrequencyData.value = currentFrequencyData.value.map(
            (val, index) => {
              const isFirstHalf = index < 8;
              const indexToUse = isFirstHalf ? index : 15 - index;
              const increasedValue = val + (indexToUse + 1) * 0.6;
              if (increasedValue < targetFrequencyData.value[indexToUse]) {
                return increasedValue;
              }
              updateCount++;
              if (updateCount === 16) {
                updateCount = 0;
                targetFrequencyData.value = [];
              }
              return currentFrequencyData.value[indexToUse];
            }
          );
        } else if (analyzer.value && dataArray.value) {
          currentFrequencyData.value = currentFrequencyData.value.map(
            (val, index) => {
              const isFirstHalf = index < 8;
              const indexToUse = isFirstHalf ? index : 15 - index;
              return val - (indexToUse + 1) * 0.6;
            }
          );
        }
      }
      if (analyzer.value) {
        requestAnimationFrame(handleAnimation);
      }
    };

    const audioContext = ref<AudioContext>();
    const analyzer = ref<AnalyserNode>();
    const dataArray = ref<Uint8Array>();

    const hasBeenSetup = ref(false);
    const setup = () => {
      hasBeenSetup.value = true;
      if (props.mediaStream) {
        audioContext.value = new AudioContext();
        analyzer.value = audioContext.value.createAnalyser();
        analyzer.value.fftSize = 32;
        const bufferLength = analyzer.value.frequencyBinCount;
        dataArray.value = new Uint8Array(bufferLength);
        analyzer.value.getByteFrequencyData(dataArray.value);
        const source = audioContext.value.createMediaStreamSource(
          props.mediaStream
        );
        source.connect(analyzer.value);
        analyzer.value.getByteFrequencyData(dataArray.value);
        handleAnimation();
      } else if (props.audioElement) {
        audioContext.value = new AudioContext();
        analyzer.value = audioContext.value.createAnalyser();
        analyzer.value.fftSize = 32;
        const bufferLength = analyzer.value.frequencyBinCount;
        dataArray.value = new Uint8Array(bufferLength);
        analyzer.value.getByteFrequencyData(dataArray.value);
        const source = audioContext.value.createMediaElementSource(
          props.audioElement
        );
        source.connect(analyzer.value);
        source.connect(audioContext.value.destination);
        analyzer.value.getByteFrequencyData(dataArray.value);
        handleAnimation();
      }
    };

    onMounted(() => {
      if (props.autoStart) {
        setup();
      }
    });

    onUnmounted(() => {
      analyzer.value?.disconnect();
      analyzer.value = undefined;
    });

    watch(
      () => props.isPlaying,
      () => {
        if (!hasBeenSetup.value) {
          setup();
        }
        if (!props.isPlaying) {
          animationCancelled.value = true;
        } else {
          animationCancelled.value = false;
        }
      }
    );

    return {
      handleAnimation,
      currentFrequencyData,
      targetFrequencyData,
      getHeight,
      getColor,
    };
  },
});
</script>
