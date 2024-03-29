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
    <v-app-bar
      height="55"
      flat
      fixed
      :color="audioMessage.customPlayback.backgroundColor"
    >
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
              <span class="text-button white--text">{{
                i18n.t("audio.managePastRecording")
              }}</span>
            </v-row>
          </v-col>
          <v-col cols="1" class="pa-0" />
        </v-row>
      </v-container>
    </v-app-bar>
    <v-row class="ma-0 mb-1 pt-14 mt-4" justify="center">
      <span class="text-h5 accent--text mt-1">{{
        audioMessage.label || `${i18n.t("audio.noLabel")}`
      }}</span>
      <v-btn icon class="ml-1" @click="setupEdit"
        ><v-icon color="accent">{{ icons.mdiPencil }}</v-icon>
      </v-btn>
    </v-row>
    <v-row class="ma-0" justify="center">
      <span class="text-caption grey--text"
        >{{ i18n.t("audio.recorded") }}:
        {{ formatDate(audioMessage.createdOn) }}</span
      >
    </v-row>
    <v-row class="ma-0" justify="center">
      <playback :audioMessage="audioMessage" />
    </v-row>
    <v-row class="ma-0 mt-2" justify="center">
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on, attrs }">
          <v-btn
            :color="
              audioMessage
                ? audioMessage.customPlayback.backgroundColor
                : 'green'
            "
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
        <span>{{ i18n.t("audio.manageAudioGroup") }}</span>
      </v-tooltip>
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on, attrs }">
          <v-btn
            :color="
              audioMessage ? audioMessage.customPlayback.backgroundColor : 'red'
            "
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
        <span>{{ i18n.t("audio.permanentlyDeleteRecording") }}</span>
      </v-tooltip>
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on, attrs }">
          <v-btn
            :color="
              audioMessage
                ? audioMessage.customPlayback.backgroundColor
                : 'primary'
            "
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
        <span>{{ i18n.t("audio.addToEmail") }}</span>
      </v-tooltip>
    </v-row>
    <mic-drop-dialog
      v-model="confirmDeleteDialog"
      :title="`${i18n.t('audio.areYouSure')}`"
      :submitText="`${i18n.t('audio.yesContinue')}`"
      closeOnSubmit
      @submit="deleteRecording"
      >{{ i18n.t("audio.deleteConfirmation") }}</mic-drop-dialog
    >
    <mic-drop-dialog
      v-model="addToGroupDialog"
      :title="`${i18n.t('audio.manageAudioGroup')}`"
      :submitText="`${i18n.t('audio.add')}`"
      closeOnSubmit
      @submit="addToGroup"
    >
      <span class="grey--text">{{ i18n.t("audio.addConfirmation") }}</span>
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
      :title="`${i18n.t('audio.editRecordingLabel')}`"
      :submitText="`${i18n.t('audio.save')}`"
      closeOnSubmit
      @submit="editLabel"
    >
      <span>{{ i18n.t("audio.label") }}</span>
      <v-text-field
        outlined
        v-model="newLabelText"
        :placeholder="`${i18n.t('audio.exampleLabel')}`"
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
import i18n from "../../i18n";

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

    const submit = async () => {
      if (audioMessage.value) {
        const placeholderImageUrl = `https://app.sendmicdrop.com/api/v1/placeholder_image/${audioMessage.value.customPlaybackUuid}_placeholder.png`;
        parent.window.postMessage(
          {
            type: "uuid",
            content: {
              audioUuid: audioMessage.value.uuid,
              customPlaybackImage: placeholderImageUrl,
            },
          },
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
      i18n,
    };
  },
});
</script>
