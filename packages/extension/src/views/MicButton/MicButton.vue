<template>
  <div class="mic-button postcsswrapper">
    <v-app>
      <v-btn
        @click="dialogOpen = !dialogOpen"
        text
        class="ml-3 pa-0 mr-n1"
        min-width="28"
        min-height="28"
        max-height="28"
      >
        <v-icon size="20px" color="#737373">{{ icons.mdiMicrophone }}</v-icon>
      </v-btn>
      <recording-dialog
        v-model="dialogOpen"
        :composeBoxElement="composeBoxElement"
        :composeBoxIndex="composeBoxIndex"
      />
    </v-app>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { mdiMicrophone } from "@mdi/js";
import RecordingDialog from "../RecordingDialog/RecordingDialog.vue";

export default defineComponent({
  name: "MicButton",
  components: {
    RecordingDialog,
  },
  props: {
    composeBoxElement: {
      type: Element,
      required: true,
    },
    composeBoxIndex: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const dialogOpen = ref(false);

    const icons = ref({
      mdiMicrophone,
    });

    return {
      dialogOpen,
      icons,
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep .v-application--wrap {
  min-height: fit-content;
}
</style>
