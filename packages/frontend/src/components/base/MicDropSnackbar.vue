<template>
  <v-snackbar v-model="showSnackbar" :color="snackbarColor" :top="false">
    {{ message }}
    <template #action="{ attrs }">
      <v-btn
        :color="buttonColor"
        text
        v-bind="attrs"
        @click="
          showSnackbar = false;
          onAction();
        "
      >
        {{ actionText }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from "@vue/composition-api";
import EventBus, { ACTIONS } from "../../EventBus";

export interface SnackbarOptions {
  text: string;
  error?: boolean;
  onAction?: () => void;
  actionText?: string;
}

export default defineComponent({
  setup() {
    const message = ref("");
    const showSnackbar = ref(false);
    const snackbarColor: Ref<string | undefined> = ref(undefined);
    const buttonColor = ref("info");
    const actionText = ref("Close");
    const onAction: Ref<() => void> = ref(() => {
      return;
    });

    onMounted(() => {
      EventBus.$on(ACTIONS.TOAST, (options: SnackbarOptions) => {
        showSnackbar.value = true;
        message.value = options.text;
        snackbarColor.value = options.error ? "error" : undefined;
        buttonColor.value = snackbarColor.value === "error" ? "white" : "info";
        onAction.value =
          options.onAction ||
          (() => {
            return;
          });
        actionText.value = options.actionText || "Close";
      });

      EventBus.$on(ACTIONS.CLOSE_TOAST, () => {
        showSnackbar.value = false;
      });
    });

    return {
      showSnackbar,
      message,
      snackbarColor,
      buttonColor,
      top,
      actionText,
      onAction,
    };
  },
});
</script>
