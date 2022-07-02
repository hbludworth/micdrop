<template>
  <div class="mic-button postcsswrapper">
    <v-app>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            @click="dialogOpen = !dialogOpen"
            text
            class="ml-3 pa-0 mr-n1"
            min-width="28"
            min-height="28"
            max-height="28"
            v-bind="attrs"
            v-on="on"
          >
            <v-img max-width="20px" max-height="20px" :src="iconURL" />
          </v-btn>
        </template>
        <span>MicDrop</span>
      </v-tooltip>
      <recording-dialog
        v-model="dialogOpen"
        :key="dialogKey"
        :composeBoxElement="composeBoxElement"
        :composeBoxIndex="composeBoxIndex"
      />
      <mic-drop-snackbar />
    </v-app>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import { mdiMicrophone } from "@mdi/js";
import RecordingDialog from "../RecordingDialog/RecordingDialog.vue";
import MicDropSnackbar from "frontend/src/components/base/MicDropSnackbar.vue";

export default defineComponent({
  name: "MicButton",
  components: {
    RecordingDialog,
    MicDropSnackbar,
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

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../../assets/icons/128.png");

    const iconURL = browser.runtime.getURL("/img/128.676198ac.png");

    const dialogKey = ref(false);
    watch(dialogOpen, () => {
      if (dialogOpen.value) {
        dialogKey.value = !dialogKey.value;
      }
    });

    return {
      dialogOpen,
      dialogKey,
      icons,
      iconURL,
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep .v-application--wrap {
  min-height: fit-content;
}
</style>
