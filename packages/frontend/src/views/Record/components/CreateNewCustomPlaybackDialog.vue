<template>
  <mic-drop-dialog
    :value="value"
    @input="$emit('input', $event)"
    submitText="Save"
    :submitLoading="saveLoading"
    :width="600"
    :showCancel="!selectedCustomizationOption"
    :showSubmit="!selectedCustomizationOption"
    v-if="previewCustomPlayback"
    @submit="createCustomPlayback"
    :submitDisabled="
      !previewCustomPlayback || !previewCustomPlayback.customPlayback.name
    "
  >
    <v-row class="ma-0 my-2 mt-n4" justify="center"
      >Customization Options</v-row
    >
    <v-row class="ma-0" justify="center">
      <v-chip
        color="primary"
        :outlined="selectedCustomizationOption !== 'base'"
        class="mr-1"
        @click="setCustomizationOption('base')"
        >Base</v-chip
      >
      <v-chip
        color="primary"
        :outlined="selectedCustomizationOption !== 'controls'"
        class="mr-1"
        @click="setCustomizationOption('controls')"
        >Controls</v-chip
      >
      <v-chip
        color="primary"
        :outlined="selectedCustomizationOption !== 'scrubber'"
        class="mr-1"
        @click="setCustomizationOption('scrubber')"
        >Scrubber</v-chip
      >
      <v-chip
        color="primary"
        :outlined="selectedCustomizationOption !== 'time'"
        class="mr-1"
        @click="setCustomizationOption('time')"
        >Time</v-chip
      >
      <v-chip
        color="primary"
        :outlined="selectedCustomizationOption !== 'branding'"
        class="mr-1"
        @click="setCustomizationOption('branding')"
        >Branding</v-chip
      >
      <v-chip
        color="primary"
        :outlined="selectedCustomizationOption !== 'signature'"
        class="mr-1"
        @click="setCustomizationOption('signature')"
        >Signature</v-chip
      >
    </v-row>
    <v-row
      v-if="!selectedCustomizationOption"
      class="ma-0 mt-4"
      justify="center"
      align="center"
    >
      <v-col cols="5" v-if="editingName" class="pa-0">
        <v-text-field
          v-if="editingName"
          dense
          hide-details
          outlined
          v-model="previewCustomPlayback.customPlayback.name"
          label="Name"
          placeholder="Ex: Personal"
          autofocus
        />
      </v-col>
      <v-btn v-if="editingName" icon color="accent" @click="editingName = false"
        ><v-icon>{{ icons.mdiCheck }}</v-icon></v-btn
      >
      <span v-if="!editingName" class="text-h5 accent--text my-1">{{
        previewCustomPlayback.customPlayback.name || "No Name"
      }}</span>
      <v-btn
        v-if="!editingName"
        icon
        color="accent"
        @click="editingName = true"
        class="ml-1"
        ><v-icon>{{ icons.mdiPencil }}</v-icon></v-btn
      >
    </v-row>
    <div
      class="ma-0 mt-2"
      justify="center"
      v-show="selectedCustomizationOption === 'base'"
    >
      <v-row class="ma-0" justify="center">Background Color</v-row>
      <color-picker
        :key="selectedCustomizationOption"
        :startingColor="previewCustomPlayback.customPlayback.backgroundColor"
        @color-changed="updateCustomPlayback('backgroundColor', $event)"
      />
    </div>
    <div
      class="ma-0 mt-2"
      justify="center"
      v-show="selectedCustomizationOption === 'controls'"
    >
      <v-row class="ma-0" justify="center">Play Button Color</v-row>
      <color-picker
        :key="selectedCustomizationOption"
        :startingColor="previewCustomPlayback.customPlayback.playButtonColor"
        @color-changed="updateCustomPlayback('playButtonColor', $event)"
      />
      <v-row class="ma-0" justify="center">Pause Button Color</v-row>
      <color-picker
        :key="selectedCustomizationOption"
        :startingColor="previewCustomPlayback.customPlayback.pauseButtonColor"
        @color-changed="updateCustomPlayback('pauseButtonColor', $event)"
      />
      <v-row class="ma-0" justify="center">Play/Pause Icon Color</v-row>
      <color-picker
        :key="selectedCustomizationOption"
        :startingColor="previewCustomPlayback.customPlayback.playPauseIconColor"
        @color-changed="updateCustomPlayback('playPauseIconColor', $event)"
      />
    </div>
    <div
      class="ma-0 mt-2"
      justify="center"
      v-show="selectedCustomizationOption === 'scrubber'"
    >
      <v-row class="ma-0" justify="center">Scrubber Color</v-row>
      <color-picker
        :key="selectedCustomizationOption"
        :startingColor="previewCustomPlayback.customPlayback.scrubberColor"
        @color-changed="updateCustomPlayback('scrubberColor', $event)"
      />
    </div>
    <div
      class="ma-0 mt-2"
      justify="center"
      v-show="selectedCustomizationOption === 'time'"
    >
      <v-row class="ma-0" justify="center">Time Background Color</v-row>
      <color-picker
        :key="selectedCustomizationOption"
        :startingColor="
          previewCustomPlayback.customPlayback.timeBackgroundColor
        "
        @color-changed="updateCustomPlayback('timeBackgroundColor', $event)"
      />
      <v-row class="ma-0" justify="center">Time Font Color</v-row>
      <color-picker
        :key="selectedCustomizationOption"
        :startingColor="previewCustomPlayback.customPlayback.timeFontColor"
        @color-changed="updateCustomPlayback('timeFontColor', $event)"
      />
    </div>
    <div
      class="ma-0 mt-2"
      justify="center"
      v-show="selectedCustomizationOption === 'branding'"
    >
      <v-row class="ma-0 mt-4" justify="center">
        <v-img
          class="rounded-circle circle-image"
          :src="previewCustomPlayback.customPlayback.circleImageUrl"
          width="60"
          height="60"
        />
        <v-card
          class="rounded-circle image-template"
          outlined
          height="60"
          width="60"
        ></v-card>
      </v-row>
      <v-row class="ma-0 mb-4 mt-2" justify="center" align="center">
        <v-col class="pa-0" cols="3">
          <v-row class="ma-0 mr-2" justify="end"> Circle Image </v-row>
        </v-col>
        <v-col class="pa-0" cols="6">
          <v-row class="ma-0 my-2" justify="center" align="center">
            <v-file-input
              chips
              dense
              outlined
              accept="image/png"
              @change="setCircleImage"
              label="Click to upload"
              hide-details
              prepend-icon=""
              :key="noCircleImage"
              :disabled="noCircleImage"
            />
          </v-row>
        </v-col>
      </v-row>
      <v-row class="ma-0 mt-n6 mb-4" justify="center" align="center">
        <v-col class="pa-0" cols="3"></v-col>
        <v-col class="pa-0" cols="6">
          <v-row class="ma-0">
            <v-checkbox
              dense
              label="No Image"
              v-model="noCircleImage"
              hide-details
            />
          </v-row>
        </v-col>
      </v-row>
      <v-row class="ma-0 mt-n2" justify="center">
        <span class="text-caption grey--text text-center"
          >Do not upload images with transparent elements to prevent unexpected
          behavior. The image will be cropped to a circle.</span
        >
      </v-row>
    </div>
    <div
      class="ma-0 mt-2"
      justify="center"
      v-show="selectedCustomizationOption === 'signature'"
    >
      <v-row class="ma-0" justify="center" align="center">
        <v-col class="pa-0" cols="3">
          <v-row class="ma-0 mr-2" justify="end"> Signature Text </v-row>
        </v-col>
        <v-col class="pa-0" cols="6">
          <v-text-field
            outlined
            dense
            hide-details
            v-model="previewCustomPlayback.customPlayback.signatureText"
          />
        </v-col>
      </v-row>
      <v-row class="ma-0 my-4" justify="center" align="center">
        <v-col class="pa-0" cols="3">
          <v-row class="ma-0 mr-2" justify="end"> Signature Image </v-row>
        </v-col>
        <v-col class="pa-0" cols="6">
          <v-row class="ma-0 my-2" justify="center" align="center">
            <v-file-input
              chips
              dense
              outlined
              accept="image/png"
              @change="setSignatureImage"
              label="Click to upload"
              hide-details
              prepend-icon=""
              :key="noSignatureImage"
              :disabled="noSignatureImage"
            />
          </v-row>
        </v-col>
      </v-row>
      <v-row class="ma-0 mt-n6 mb-4" justify="center" align="center">
        <v-col class="pa-0" cols="3"></v-col>
        <v-col class="pa-0" cols="6">
          <v-row class="ma-0">
            <v-checkbox
              dense
              label="No Image"
              v-model="noSignatureImage"
              hide-details
            />
            <v-img
              :src="previewCustomPlayback.customPlayback.signatureImageUrl"
              max-width="80"
              height="15"
              contain
              class="ml-8 mt-3"
            />
          </v-row>
        </v-col>
      </v-row>
      <v-row
        class="ma-0"
        justify="center"
        align="center"
        v-if="previewCustomPlayback.customPlayback.signatureImageUrl !== null"
      >
        <v-col class="pa-0" cols="3">
          <v-row class="ma-0 mr-2" justify="end">Image Link</v-row>
        </v-col>
        <v-col class="pa-0" cols="6">
          <v-text-field
            outlined
            dense
            hide-details
            v-model="previewCustomPlayback.customPlayback.link"
          />
        </v-col>
      </v-row>
    </div>
    <v-row class="ma-0" v-if="selectedCustomizationOption" justify="center">
      <v-btn
        text
        color="primary"
        @click="selectedCustomizationOption = undefined"
        class="mt-1"
      >
        <v-icon class="mr-1">{{ icons.mdiCheck }}</v-icon> OK
      </v-btn>
    </v-row>
    <v-row
      v-if="!selectedCustomizationOption"
      class="ma-0 mb-n6 mt-n2"
      justify="center"
    >
      <playback :audioMessage="previewCustomPlayback" />
    </v-row>
  </mic-drop-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  onMounted,
  watch,
} from "@vue/composition-api";
import MicDropDialog from "../../../components/base/MicDropDialog.vue";
import Playback from "../../../components/Playback/Playback.vue";
import {
  AudioMessageWithUrl,
  CreateNewCustomPlaybackPayload,
  CustomPlaybackDisplay,
} from "types";
import ColorPicker from "./ColorPicker.vue";
import { mdiCheck, mdiPencil } from "@mdi/js";
import sl from "../../../serviceLocator";
import { v4 } from "uuid";

type CustomizationOption =
  | "base"
  | "controls"
  | "scrubber"
  | "time"
  | "branding"
  | "signature";

export default defineComponent({
  components: {
    MicDropDialog,
    Playback,
    ColorPicker,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    startingTemplate: {
      type: Object as PropType<AudioMessageWithUrl>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");

    const saveLoading = ref(false);

    const selectedCustomizationOption = ref<CustomizationOption>();

    const setCustomizationOption = (option: CustomizationOption) => {
      if (selectedCustomizationOption.value !== option) {
        selectedCustomizationOption.value = option;
      } else {
        selectedCustomizationOption.value = undefined;
      }
    };

    const previewCustomPlayback = ref<AudioMessageWithUrl>();

    onMounted(() => {
      previewCustomPlayback.value = {
        ...props.startingTemplate,
      };
      originalSignatureImageUrl.value =
        props.startingTemplate.customPlayback.signatureImageUrl || "";
      originalCircleImageUrl.value =
        props.startingTemplate.customPlayback.circleImageUrl || "";
    });

    const updateCustomPlayback = (
      key: keyof CustomPlaybackDisplay,
      value: string
    ) => {
      if (previewCustomPlayback.value) {
        previewCustomPlayback.value.customPlayback[key] = value;
      }
    };

    const circleImage = ref<File>();
    const setCircleImage = async (upload: File) => {
      circleImage.value = upload;
      if (previewCustomPlayback.value) {
        previewCustomPlayback.value.customPlayback.circleImageUrl =
          await readURL(upload);
      }
    };
    const noCircleImage = ref(false);
    const originalCircleImageUrl = ref<string>("");
    watch(noCircleImage, () => {
      if (noCircleImage.value && previewCustomPlayback.value) {
        previewCustomPlayback.value.customPlayback.circleImageUrl = null;
        circleImage.value = undefined;
      } else if (previewCustomPlayback.value) {
        previewCustomPlayback.value.customPlayback.circleImageUrl =
          originalCircleImageUrl.value;
      }
    });

    const signatureImage = ref<File>();
    const setSignatureImage = async (upload: File) => {
      signatureImage.value = upload;
      if (previewCustomPlayback.value) {
        previewCustomPlayback.value.customPlayback.signatureImageUrl =
          await readURL(upload);
      }
    };
    const noSignatureImage = ref(false);
    const originalSignatureImageUrl = ref<string>("");
    watch(noSignatureImage, () => {
      if (noSignatureImage.value && previewCustomPlayback.value) {
        previewCustomPlayback.value.customPlayback.signatureImageUrl = null;
        signatureImage.value = undefined;
      } else if (previewCustomPlayback.value) {
        previewCustomPlayback.value.customPlayback.signatureImageUrl =
          originalSignatureImageUrl.value;
      }
    });

    const readURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (event) => reject(event);
        reader.readAsDataURL(file);
      });
    };

    const icons = ref({
      mdiCheck,
      mdiPencil,
    });

    const createCustomPlayback = async () => {
      try {
        if (!previewCustomPlayback.value) {
          throw new Error("Error. No selections available.");
        }
        saveLoading.value = true;

        let circleImageName: string | null = null;
        let signatureImageName: string | null = null;

        if (circleImage.value) {
          circleImageName = `${v4()}.png`;
          await server.uploadImage({
            name: circleImageName,
            file: circleImage.value,
          });
        }

        if (signatureImage.value) {
          signatureImageName = `${v4()}.png`;
          await server.uploadImage({
            name: signatureImageName,
            file: signatureImage.value,
          });
        }

        const newCustomPlaybackRow: CreateNewCustomPlaybackPayload = {
          name: previewCustomPlayback.value.customPlayback.name,
          backgroundColor:
            previewCustomPlayback.value.customPlayback.backgroundColor,
          playButtonColor:
            previewCustomPlayback.value.customPlayback.playButtonColor,
          pauseButtonColor:
            previewCustomPlayback.value.customPlayback.pauseButtonColor,
          playPauseIconColor:
            previewCustomPlayback.value.customPlayback.playPauseIconColor,
          timeBackgroundColor:
            previewCustomPlayback.value.customPlayback.timeBackgroundColor,
          timeFontColor:
            previewCustomPlayback.value.customPlayback.timeFontColor,
          scrubberColor:
            previewCustomPlayback.value.customPlayback.scrubberColor,
          signatureText:
            previewCustomPlayback.value.customPlayback.signatureText,
          link: previewCustomPlayback.value.customPlayback.link,
          circleImage: circleImageName,
          signatureImage: signatureImageName,
        };

        const newlyCreatedCustomPlaybackRow = await server.createCustomPlayback(
          newCustomPlaybackRow
        );

        emit("select-new-custom-playback", newlyCreatedCustomPlaybackRow);

        emit("input", false);
      } catch {
        actions.showErrorSnackbar(
          "Error saving custom playback interface. Please try again."
        );
      } finally {
        saveLoading.value = false;
      }
    };

    const editingName = ref(false);

    return {
      saveLoading,
      selectedCustomizationOption,
      setCustomizationOption,
      previewCustomPlayback,
      updateCustomPlayback,
      circleImage,
      setCircleImage,
      signatureImage,
      setSignatureImage,
      icons,
      createCustomPlayback,
      editingName,
      noCircleImage,
      noSignatureImage,
    };
  },
});
</script>

<style scoped>
.image-template {
  outline: 2px solid lightslategray;
}

.circle-image {
  position: absolute;
  z-index: 5;
}
</style>
