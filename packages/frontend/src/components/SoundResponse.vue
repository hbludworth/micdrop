<template>
  <sound-visualizer
    :progressFraction="progressFraction"
    :mini="mini"
    :currentFrequencyData="currentFrequencyData"
    :scrubberColor="scrubberColor"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
} from "@vue/composition-api";
import SoundVisualizer from "./SoundVisualizer.vue";

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
    scrubberColor: {
      type: String,
      required: false,
    },
  },
  components: {
    SoundVisualizer,
  },
  setup(props) {
    onMounted(() => {
      if (props.autoStart) {
        setupAudioContext();
      }
    });

    onUnmounted(() => {
      analyzer.value?.disconnect();
      analyzer.value = undefined;
    });

    const currentFrequencyData = ref<number[]>([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    const targetFrequencyData = ref<number[]>([]);

    const audioContext = ref<AudioContext>();
    const analyzer = ref<AnalyserNode>();
    const dataArray = ref<Uint8Array>();

    const hasBeenSetup = ref(false);

    const createSourceNode = (audioContext: AudioContext) => {
      if (props.mediaStream) {
        return audioContext.createMediaStreamSource(props.mediaStream);
      } else if (props.audioElement) {
        const source = audioContext.createMediaElementSource(
          props.audioElement
        );
        source.connect(audioContext.destination);
        return source;
      }
    };

    const setupAudioContext = () => {
      hasBeenSetup.value = true;
      audioContext.value = new AudioContext();
      analyzer.value = audioContext.value.createAnalyser();
      analyzer.value.fftSize = 32;
      const bufferLength = analyzer.value.frequencyBinCount;
      dataArray.value = new Uint8Array(bufferLength);
      analyzer.value.getByteFrequencyData(dataArray.value);
      const source = createSourceNode(audioContext.value);
      if (source === undefined) {
        return;
      }
      source.connect(analyzer.value);
      analyzer.value.getByteFrequencyData(dataArray.value);
      handleAnimation();
    };

    let then = 0;
    let now = 0;
    let updateCount = 0;
    const handleAnimation = () => {
      if (!animationCancelled.value) {
        now = Date.now();
        if (analyzer.value && dataArray.value) {
          if (now > then + 250) {
            analyzer.value.getByteFrequencyData(dataArray.value);
            targetFrequencyData.value = Array.from(dataArray.value);
            then = now;
          } else if (targetFrequencyData.value.length > 0) {
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
          } else {
            currentFrequencyData.value = currentFrequencyData.value.map(
              (val, index) => {
                const isFirstHalf = index < 8;
                const indexToUse = isFirstHalf ? index : 15 - index;
                return val - (indexToUse + 1) * 0.6;
              }
            );
          }
        }
      }
      if (analyzer.value) {
        requestAnimationFrame(handleAnimation);
      }
    };

    const animationCancelled = ref(false);

    watch(
      () => props.isPlaying,
      () => {
        if (!hasBeenSetup.value) {
          setupAudioContext();
        }
        // animationCancelled.value = !props.isPlaying;
        if (!props.isPlaying) {
          animationCancelled.value = true;
        } else {
          animationCancelled.value = false;
        }
      }
    );
    return {
      currentFrequencyData,
    };
  },
});
</script>