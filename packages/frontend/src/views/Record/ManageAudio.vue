<template>
  <v-row v-if="loading" justify="center" class="ma-0 pa-0 pt-14">
    <v-progress-circular
      indeterminate
      size="150"
      width="15"
      color="primary"
      class="mt-14"
    />
  </v-row>
  <div v-else-if="audioMessage">
    <v-app-bar height="55" flat fixed color="primary">
      <v-container class="ma-0 pa-0" fluid>
        <v-row class="ma-0" align="center">
          <v-col cols="1" class="pa-0">
            <v-btn
              icon
              color="white"
              :to="`/extension/past_recordings_list?startingGroupUuid=${sourceGroupUuid}`"
              class="ml-n3"
            >
              <v-icon>{{ icons.mdiArrowLeft }}</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="10" class="pa-0">
            <v-row justify="center" class="ma-0">
              <span class="text-button white--text">Manage Past Recording</span>
            </v-row>
          </v-col>
          <v-col cols="1" class="pa-0" />
        </v-row>
      </v-container>
    </v-app-bar>
    <v-row class="ma-0 mb-1 pt-14 mt-4" justify="center">
      <span class="text-h5 primary--text mt-1">{{
        audioMessage.label || "No Label"
      }}</span>
      <v-btn icon class="ml-1" @click="setupEdit"
        ><v-icon color="primary">{{ icons.mdiPencil }}</v-icon>
      </v-btn>
    </v-row>
    <v-row class="ma-0" justify="center">
      <span class="text-caption grey--text"
        >Recorded: {{ formatDate(audioMessage.createdOn) }}</span
      >
    </v-row>
    <v-row class="ma-0" justify="center">
      <playback :audioUrl="audioMessage.url" />
    </v-row>
    <v-row class="ma-0 mt-2" justify="center">
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on, attrs }">
          <v-btn
            color="green"
            @click="addToGroupDialog = true"
            fab
            depressed
            v-bind="attrs"
            v-on="on"
            class="mx-2"
          >
            <v-icon color="white">{{
              icons.mdiFormatListBulletedSquare
            }}</v-icon></v-btn
          >
        </template>
        <span>Manage Audio Group</span>
      </v-tooltip>
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on, attrs }">
          <v-btn
            color="red"
            @click="confirmDeleteDialog = true"
            fab
            depressed
            v-bind="attrs"
            v-on="on"
            class="mx-2"
          >
            <v-icon color="white">{{ icons.mdiDelete }}</v-icon></v-btn
          >
        </template>
        <span>Permanently Delete Recording</span>
      </v-tooltip>
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on, attrs }">
          <v-btn
            color="primary"
            @click="submit"
            fab
            depressed
            v-bind="attrs"
            v-on="on"
            class="mx-2"
          >
            <v-icon color="white">{{
              icons.mdiEmailSendOutline
            }}</v-icon></v-btn
          >
        </template>
        <span>Add to Email</span>
      </v-tooltip>
    </v-row>
    <mic-drop-dialog
      v-model="confirmDeleteDialog"
      title="Are you sure?"
      submitText="Yes, Continue"
      closeOnSubmit
      @submit="deleteRecording"
      >Are you sure you want to permanently delete this audio recording? If
      deleted, this MicDrop message will not appear in past recordings, cannot
      be used again, and will be removed from cloud storage.</mic-drop-dialog
    >
    <mic-drop-dialog
      v-model="addToGroupDialog"
      title="Manage Audio Group"
      submitText="Add"
      closeOnSubmit
      @submit="addToGroup"
    >
      <span class="grey--text"
        >The audio message will be added to the selected group. A message can
        only belong to one group at a time.</span
      >
      <v-checkbox
        v-for="group in userAudioGroups"
        :key="group.uuid"
        :label="group.name"
        hide-details
        :value="group.uuid"
        v-model="selectedGroupUuid"
      />
    </mic-drop-dialog>
    <mic-drop-dialog
      v-model="editLabelDialog"
      title="Edit Recording Label"
      submitText="Save"
      closeOnSubmit
      @submit="editLabel"
    >
      <span>Label</span>
      <v-text-field
        outlined
        v-model="newLabelText"
        placeholder="Ex: Sales Pitch 1"
        hide-details
      />
    </mic-drop-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import sl from "../../serviceLocator";
import { AudioMessageWithUrl, AudioGroup } from "types";
import {
  mdiArrowLeft,
  mdiPencil,
  mdiCheck,
  mdiClose,
  mdiEmailSendOutline,
  mdiDelete,
  mdiFormatListBulletedSquare,
} from "@mdi/js";
import Playback from "../../components/Playback/Playback.vue";
import MicDropDialog from "../../components/base/MicDropDialog.vue";
import { DateTime } from "luxon";

export default defineComponent({
  props: {
    uuid: {
      type: String,
      required: true,
    },
    sourceGroupUuid: {
      type: String,
      required: false,
    },
  },
  components: {
    Playback,
    MicDropDialog,
  },
  setup(props) {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");
    const router = sl.get("router");

    const loading = ref(false);

    const audioMessage = ref<AudioMessageWithUrl>();

    const icons = ref({
      mdiArrowLeft,
      mdiPencil,
      mdiCheck,
      mdiClose,
      mdiEmailSendOutline,
      mdiDelete,
      mdiFormatListBulletedSquare,
    });

    onMounted(async () => {
      try {
        loading.value = true;
        audioMessage.value = await server.getAudioMessage(props.uuid);
        selectedGroupUuid.value =
          audioMessage.value.audioGroupUuid || undefined;
        userAudioGroups.value = await server.getUserAudioGroups();
      } catch {
        actions.showErrorSnackbar(
          "Error loading audio message data. Please try again."
        );
      } finally {
        loading.value = false;
      }
    });

    const newLabelText = ref<string | null>(null);

    const editLabelDialog = ref(false);

    const setupEdit = () => {
      if (audioMessage.value) {
        editLabelDialog.value = true;
        newLabelText.value = audioMessage.value.label;
      }
    };

    const editLabel = async () => {
      try {
        if (audioMessage.value) {
          await server.editLabel(
            audioMessage.value.uuid,
            newLabelText.value || ""
          );
          audioMessage.value.label = newLabelText.value;
        }
      } catch {
        actions.showErrorSnackbar(
          "Error editing message label. Please try again"
        );
      } finally {
        newLabelText.value = null;
      }
    };

    const submit = () => {
      if (audioMessage.value) {
        parent.window.postMessage(
          { type: "uuid", content: audioMessage.value.uuid },
          "https://mail.google.com"
        );
      }
    };

    const confirmDeleteDialog = ref(false);
    const deleteRecording = async () => {
      try {
        if (audioMessage.value) {
          await server.deleteAudio(audioMessage.value.uuid);
          router.push("/extension/past_recordings_list");
        }
      } catch {
        actions.showErrorSnackbar(
          "Error permanently deleting audio message. Please try again."
        );
      }
    };

    const addToGroupDialog = ref(false);
    const addToGroup = async () => {
      try {
        if (audioMessage.value) {
          await server.addGroupToAudio(
            audioMessage.value.uuid,
            selectedGroupUuid.value || null
          );
          actions.showSnackbar("Successfully updated audio group");
        }
      } catch {
        actions.showErrorSnackbar(
          "Error adding updating group information. Please try again."
        );
      }
    };

    const userAudioGroups = ref<AudioGroup[]>([]);
    const selectedGroupUuid = ref<string>();

    const formatDate = (date: Date) => {
      return DateTime.fromJSDate(new Date(date)).toLocaleString(
        DateTime.DATETIME_MED
      );
    };

    return {
      audioMessage,
      icons,
      newLabelText,
      setupEdit,
      editLabel,
      submit,
      deleteRecording,
      confirmDeleteDialog,
      addToGroupDialog,
      addToGroup,
      userAudioGroups,
      selectedGroupUuid,
      loading,
      editLabelDialog,
      formatDate,
    };
  },
});
</script>
