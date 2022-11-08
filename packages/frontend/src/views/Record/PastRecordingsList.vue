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
  <div v-else>
    <v-app-bar height="55" flat fixed color="primary">
      <v-container class="ma-0 pa-0" fluid>
        <v-row class="ma-0" align="center">
          <v-col cols="1" class="pa-0">
            <v-btn icon color="white" to="/record" class="ml-n3">
              <v-icon>{{ icons.mdiArrowLeft }}</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="10" class="pa-0">
            <v-row justify="center" class="ma-0">
              <span class="text-button white--text">{{
                i18n.t("pastRecordings.pastRecordings")
              }}</span>
            </v-row>
          </v-col>
          <v-col cols="1" class="pa-0" />
        </v-row>
      </v-container>
    </v-app-bar>
    <v-row class="ma-0 px-2 py-1 pt-14 primary">
      <v-col cols="4" class="pa-0">
        <v-row class="ma-0 py-1">
          <span class="text-h6 white--text pl-3">{{
            i18n.t("pastRecordings.groups")
          }}</span>
        </v-row>
      </v-col>
      <v-col cols="1" class="pa-0" align="center" />
      <v-col cols="7" class="pa-0 ml-n6">
        <v-row class="ma-0 py-1">
          <span class="text-h6 pl-6 white--text pl-10">{{
            i18n.t("pastRecordings.recordings")
          }}</span>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="ma-0 px-2 fill-height">
      <v-col cols="4" class="pa-0">
        <v-card class="overflow-y-auto pb-6 pt-2" height="255" flat>
          <v-list-item-group v-model="currentGroupIndex">
            <v-list-item dense @click="setCurrentGroup(null)"
              ><span class="text-button primary--text">{{
                i18n.t("pastRecordings.allRecordings")
              }}</span></v-list-item
            >
            <v-hover
              v-slot="{ hover }"
              v-for="(group, idx) in userAudioGroups"
              :key="idx"
            >
              <v-list-item dense @click="setCurrentGroup(group.uuid)">
                <span class="text-button grey--text">{{ group.name }}</span>
                <v-spacer />
                <v-btn
                  v-if="hover"
                  icon
                  color="primary"
                  small
                  @click.native.stop
                  @click="setupGroupRename(group.uuid, group.name)"
                >
                  <v-icon small>{{ icons.mdiPencil }}</v-icon>
                </v-btn>
                <v-btn
                  v-if="hover"
                  icon
                  color="red"
                  small
                  class="mr-n3"
                  @click.native.stop
                  @click="setupGroupDelete(group.uuid)"
                >
                  <v-icon small>{{ icons.mdiDelete }}</v-icon>
                </v-btn>
              </v-list-item>
            </v-hover>
            <v-list-item dense @click="createAudioGroupDialog = true">
              <span class="text-button primary--text">{{
                i18n.t("pastRecordings.createGroup")
              }}</span>
            </v-list-item>
          </v-list-item-group>
        </v-card>
      </v-col>
      <v-col cols="1" align="center">
        <v-divider vertical />
      </v-col>
      <v-col cols="7" class="pa-0">
        <v-card class="overflow-y-auto pb-6 pt-2" height="255" flat>
          <v-row
            v-if="groupMessages.length === 0"
            class="ma-0 mt-12 pt-12"
            justify="center"
          >
            <span class="text-caption grey--text px-2">{{
              i18n.t("pastRecordings.noRecordings")
            }}</span>
          </v-row>
          <v-list-item-group v-else>
            <v-list-item
              dense
              v-for="message in groupMessages"
              :key="message.uuid"
              :to="`/extension/manage_audio/${message.uuid}?sourceGroupUuid=${
                currentGroup || undefined
              }`"
            >
              <v-row justify="start" class="ma-0">
                <span class="text-button grey--text">{{
                  message.label || "No Label"
                }}</span>
              </v-row>
              <v-row justify="end" class="ma-0 mr-1">
                <span class="text-caption grey--text">{{
                  formatDate(message.createdOn)
                }}</span>
              </v-row>
            </v-list-item>
          </v-list-item-group>
        </v-card>
      </v-col>
    </v-row>
    <mic-drop-dialog
      v-model="createAudioGroupDialog"
      :title="`${i18n.t('pastRecordings.createAudioGroup')}`"
      :submitText="`${i18n.t('pastRecordings.createGroupSubmitText')}`"
      closeOnSubmit
      @submit="createAudioGroup"
    >
      <span>{{ i18n.t("pastRecordings.name") }}</span>
      <v-text-field
        outlined
        v-model="newGroupName"
        :placeholder="`${i18n.t('pastRecordings.exampleName')}`"
        hide-details
      />
    </mic-drop-dialog>
    <mic-drop-dialog
      v-model="deleteAudioGroupDialog"
      :title="`${i18n.t('pastRecordings.deleteAudioGroup')}?`"
      :submitText="`${i18n.t('pastRecordings.yes')}`"
      closeOnSubmit
      @submit="deleteAudioGroup"
    >
      <span>{{ i18n.t("pastRecordings.deleteConfirmation") }}</span>
    </mic-drop-dialog>
    <mic-drop-dialog
      v-model="renameAudioGroupDialog"
      :title="`${i18n.t('pastRecordings.renameAudioGroup')}`"
      closeOnSubmit
      @submit="renameAudioGroup"
    >
      <span>{{ i18n.t("pastRecordings.newName") }}</span>
      <v-text-field
        outlined
        v-model="renameGroupName"
        :placeholder="`${i18n.t('pastRecordings.exampleName')}`"
        hide-details
      />
    </mic-drop-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "@vue/composition-api";
import { mdiArrowLeft, mdiDelete, mdiPencil } from "@mdi/js";
import sl from "../../serviceLocator";
import { AudioGroup, AudioMessage } from "types";
import MicDropDialog from "../../components/base/MicDropDialog.vue";
import { DateTime } from "luxon";
import i18n from "../../i18n";

export default defineComponent({
  props: {
    startingGroupUuid: {
      type: String,
      required: false,
    },
  },
  components: {
    MicDropDialog,
  },
  setup(props) {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");

    const loading = ref(false);

    const icons = ref({
      mdiArrowLeft,
      mdiDelete,
      mdiPencil,
    });

    const userAudioGroups = ref<AudioGroup[]>([]);

    onMounted(async () => {
      try {
        loading.value = true;
        userAudioGroups.value = await server.getUserAudioGroups();
        setCurrentGroup(props.startingGroupUuid || null);
        currentGroupIndex.value = props.startingGroupUuid
          ? userAudioGroups.value
              .map((group) => group.uuid)
              .indexOf(props.startingGroupUuid) + 1
          : 0;
        await getGroupAudioMessages();
      } catch {
        actions.showErrorSnackbar(
          "Error loading audio groups. Please try again."
        );
      } finally {
        loading.value = false;
      }
    });

    const createAudioGroupDialog = ref(false);
    const deleteAudioGroupDialog = ref(false);
    const renameAudioGroupDialog = ref(false);

    const newGroupName = ref("");

    const createAudioGroup = async () => {
      try {
        await server.createAudioGroup(newGroupName.value);
        userAudioGroups.value = await server.getUserAudioGroups();
        newGroupName.value = "";
      } catch {
        actions.showErrorSnackbar(
          "Error creating audio group. Please try again."
        );
      }
    };

    const currentGroup = ref<string | null>(null);
    const currentGroupIndex = ref(0);
    const setCurrentGroup = (uuid: string | null) => {
      currentGroup.value = uuid;
    };

    const groupMessages = ref<AudioMessage[]>([]);
    watch(currentGroup, async () => {
      await getGroupAudioMessages();
    });

    const getGroupAudioMessages = async () => {
      try {
        groupMessages.value = await server.getGroupAudioMessages(
          currentGroup.value
        );
      } catch {
        actions.showErrorSnackbar(
          "Error getting group audio messages. Please try again"
        );
      }
    };

    const formatDate = (date: Date) => {
      return DateTime.fromJSDate(new Date(date)).toLocaleString(
        DateTime.DATETIME_MED
      );
    };

    const groupUuidToDelete = ref<string>();
    const setupGroupDelete = (groupUuid: string) => {
      deleteAudioGroupDialog.value = true;
      groupUuidToDelete.value = groupUuid;
    };

    const deleteAudioGroup = async () => {
      try {
        if (groupUuidToDelete.value) {
          await server.deleteAudioGroup(groupUuidToDelete.value);
          userAudioGroups.value = userAudioGroups.value.filter(
            (group) => group.uuid !== groupUuidToDelete.value
          );
          setCurrentGroup(null);
          currentGroupIndex.value = 0;
          actions.showSnackbar("Successfully deleted audio group");
        }
      } catch {
        actions.showErrorSnackbar(
          "Error deleting audio group. Please try again."
        );
      } finally {
        groupUuidToDelete.value = undefined;
      }
    };

    const renameGroupName = ref("");
    const groupUuidToRename = ref<string>();
    const setupGroupRename = (groupUuid: string, groupName: string) => {
      groupUuidToRename.value = groupUuid;
      renameGroupName.value = groupName;
      renameAudioGroupDialog.value = true;
    };

    const renameAudioGroup = async () => {
      try {
        if (groupUuidToRename.value) {
          actions.showSnackbar("Successfully renamed audio group");
          await server.renameAudioGroup(
            groupUuidToRename.value,
            renameGroupName.value
          );
          userAudioGroups.value = await server.getUserAudioGroups();
        }
      } catch {
        actions.showErrorSnackbar(
          "Error renaming audio group. Please try again."
        );
      } finally {
        renameGroupName.value = "";
        groupUuidToRename.value = undefined;
      }
    };

    return {
      icons,
      userAudioGroups,
      createAudioGroupDialog,
      newGroupName,
      createAudioGroup,
      currentGroup,
      setCurrentGroup,
      groupMessages,
      getGroupAudioMessages,
      formatDate,
      loading,
      deleteAudioGroupDialog,
      groupUuidToDelete,
      setupGroupDelete,
      deleteAudioGroup,
      currentGroupIndex,
      setupGroupRename,
      groupUuidToRename,
      renameAudioGroupDialog,
      renameGroupName,
      renameAudioGroup,
      i18n,
    };
  },
});
</script>
