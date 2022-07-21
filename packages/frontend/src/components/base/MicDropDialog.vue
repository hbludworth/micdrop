<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    :width="width"
    :persistent="persistent"
    :eager="eager"
    content-class="rounded-xl"
  >
    <template v-slot:activator="{ on }">
      <slot name="activator" :on="on"></slot>
    </template>

    <v-card>
      <div v-if="closeButton">
        <v-card-actions>
          <h2 class="ml-3" v-if="actionTitle">{{ actionTitle }}</h2>
          <v-spacer />
          <slot name="action-options" />
          <v-btn @click="$emit('input', false)" text color="error">Close</v-btn>
        </v-card-actions>
        <v-divider />
      </div>
      <v-card-title data-testid="dialog-title" class="test-dialog-title">
        <slot name="title">{{ title }}</slot>
      </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <div v-if="showCancel || showSubmit">
        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn
            class="rounded-lg"
            v-if="showCancel"
            @click="$emit('input', false)"
            color="error"
            text
            data-testid="cancel-btn"
            >{{ cancelText }}</v-btn
          >

          <slot v-if="showSubmit" name="submit-button" :on="{ click: submit }">
            <v-btn
              class="rounded-lg"
              @click="submit"
              color="primary"
              text
              :disabled="submitLoading || submitDisabled"
            >
              <v-progress-circular
                v-if="submitLoading"
                indeterminate
                size="25"
                width="3"
              />
              <span v-else>{{ submitText }}</span>
            </v-btn>
          </slot>
          <v-spacer />
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    showSubmit: {
      type: Boolean,
      default: true,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    persistent: {
      type: Boolean,
      default: true,
    },
    submitText: {
      type: String,
      default: "Submit",
    },
    cancelText: {
      type: String,
      default: "Cancel",
    },
    submitLoading: {
      type: Boolean,
      default: false,
    },
    submitDisabled: {
      type: Boolean,
      default: false,
    },
    closeOnSubmit: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 500,
    },
    closeButton: {
      type: Boolean,
      default: false,
    },
    actionTitle: {
      type: String,
      required: false,
    },
    eager: {
      type: Boolean,
      default: false,
    },
  },
  setup({ closeOnSubmit }, { emit }) {
    const submit = () => {
      if (closeOnSubmit) {
        emit("input", false);
      }
      emit("submit");
    };

    return {
      submit,
    };
  },
});
</script>
