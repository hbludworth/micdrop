<template>
  <v-container class="ma-0 pa-10 mt-16" fluid>
    <v-row v-show="step === 1" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center">
          <router-link to="/"
            ><v-img
              :src="require('../../assets/logos/blue-logo-alpha-700w.png')"
              max-width="350px"
              contain
          /></router-link>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text">Type More, Say Less</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text">Welcome!</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >This guide will help you learn how MicDrop works and get you all
            set up. Let's go!</span
          >
        </v-row>
        <v-row justify="center"
          ><video
            :src="demoVideoURL"
            autoplay
            loop
            width="500px"
            muted
            class="record-dialog-border"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-row v-show="step === 2" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">What is MicDrop?</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="40px">{{
            icons.mdiClockTimeFour
          }}</v-icon>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >MicDrop helps you save time and communicate more clearly by
            harnessing the power of your voice.</span
          >
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="40px">{{ icons.mdiBullhorn }}</v-icon>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >By simply recording your message, you can communicate your thoughts
            exactly as you intended.</span
          >
        </v-row>
        <v-row justify="center" class="mt-8 mb-6">
          <v-icon color="primary" size="45px">{{
            icons.mdiTextToSpeech
          }}</v-icon>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >Using MicDrop is easy! This tutorial will help you create an
            account and get started!</span
          >
        </v-row>
      </v-col>
    </v-row>
    <v-row v-show="step === 3" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">Getting Started</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >To begin, compose a new message in Gmail. Click the new MicDrop
            icon in the tool bar to get started.</span
          >
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="25px">{{
            icons.mdiApplicationEdit
          }}</v-icon>
        </v-row>
        <v-row justify="center" class="my-6">
          <b class="grey--text"
            >NOTE: The first time you use MicDrop, you will be asked to grant
            the extension permission to use your microphone.</b
          >
        </v-row>
        <v-row justify="center">
          <v-img
            :src="micIconScreenshotURL"
            max-width="450px"
            class="compose-box-border"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-row v-show="step === 4" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">Recording</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >On the recording screen, use the microphone to begin recording. You
            can stop at any time using the red stop button.</span
          >
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="35px">{{ icons.mdiMicrophone }}</v-icon>
        </v-row>
        <v-row justify="center"
          ><video
            :src="audioScreenRecordingURL"
            autoplay
            loop
            width="450px"
            muted
            class="record-dialog-border"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-row v-show="step === 5" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">Playback</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >Once you're done recording, you can play back the audio message to
            make sure everything looks good. Sound bars help you visualize your
            recording as it plays.</span
          >
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="35px">{{ icons.mdiPlayCircle }}</v-icon>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >You can even use the built-in scrubber to find the exact part of
            your message you'd like to listen to. Simply click and drag across
            the playback bar to precisely seek.</span
          >
        </v-row>
        <v-row justify="center"
          ><video
            :src="playbackScreenRecordingURL"
            autoplay
            loop
            width="450px"
            muted
            class="record-dialog-border"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-row v-show="step === 6" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">Attach</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >When you're ready, click the "Add to Email" button to securely
            attach your audio message to your email message.</span
          >
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="30px">{{ icons.mdiEmail }}</v-icon>
        </v-row>
        <v-row justify="center">
          <v-img
            :src="attachScreenshotURL"
            max-width="450px"
            class="record-dialog-border"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-row v-show="step === 7" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">Complete Email</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >Your audio message will appear directly in the compose box. Feel
            free to type out any additional thoughts you might want to
            add.</span
          >
        </v-row>
        <v-row justify="center">
          <v-img
            :src="completedComposeBoxScreenshotURL"
            max-width="450px"
            class="compose-box-border"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-row v-show="step === 8" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">Remove Attachment</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >If you're having second thoughts, simply click the remove button
            that appears when hovering to delete the audio message from the
            email.</span
          >
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="30px">{{
            icons.mdiDeleteSweep
          }}</v-icon>
        </v-row>
        <v-row justify="center">
          <v-img
            :src="deleteRecordingScreenshotURL"
            max-width="450px"
            class="compose-box-border"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-row v-show="step === 9" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">You're All Set!</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >Now that you've learned how it works, you're ready to go!</span
          >
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="35px">{{
            icons.mdiPartyPopper
          }}</v-icon>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >Click the icon below to open Gmail and send a MicDrop audio
            message!</span
          >
        </v-row>
        <v-row justify="center" class="mt-10 mb-n4">
          <v-btn
            height="125"
            width="125"
            fab
            x-large
            color="red"
            depressed
            href="https://mail.google.com/mail/u/0/#inbox?compose=new"
          >
            <v-icon color="white" size="65px">{{ icons.mdiGmail }}</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="center" class="my-6">
          <a
            class="text-h6 red--text mr-1 no-underline"
            href="https://mail.google.com/mail/u/0/#inbox?compose=new"
            >Gmail
            <v-icon color="red" small>{{ icons.mdiOpenInNew }}</v-icon></a
          >
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="4" align-self="center">
        <v-row justify="end">
          <v-btn
            v-if="step > 1"
            height="60"
            width="60"
            @click="step -= 1"
            fab
            x-large
            color="primary"
          >
            <v-icon color="white" size="35px">{{
              icons.mdiChevronLeft
            }}</v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="4" align="center">
        <v-btn
          v-for="n in 9"
          :key="n"
          height="10"
          width="10"
          fab
          :color="n === step ? 'primary' : 'grey lighten-1'"
          class="mx-2"
          depressed
          @click="step = n"
        />
      </v-col>
      <v-col cols="4" align-self="center">
        <v-row justify="start">
          <v-btn
            v-if="step < 9"
            height="60"
            width="60"
            @click="step += 1"
            fab
            x-large
            color="primary"
          >
            <v-icon color="white" size="35px">{{
              icons.mdiChevronRight
            }}</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiBullhorn,
  mdiClockTimeFour,
  mdiTextToSpeech,
  mdiApplicationEdit,
  mdiMicrophone,
  mdiPlayCircle,
  mdiEmail,
  mdiDeleteSweep,
  mdiPartyPopper,
  mdiGmail,
  mdiOpenInNew,
} from "@mdi/js";
import sl from "../../serviceLocator";

export default defineComponent({
  setup() {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");

    const micIconScreenshotURL = ref("");
    const audioScreenRecordingURL = ref("");
    const playbackScreenRecordingURL = ref("");
    const attachScreenshotURL = ref("");
    const completedComposeBoxScreenshotURL = ref("");
    const deleteRecordingScreenshotURL = ref("");
    const demoVideoURL = ref("");

    const icons = ref({
      mdiChevronLeft,
      mdiChevronRight,
      mdiBullhorn,
      mdiClockTimeFour,
      mdiTextToSpeech,
      mdiApplicationEdit,
      mdiMicrophone,
      mdiPlayCircle,
      mdiEmail,
      mdiDeleteSweep,
      mdiPartyPopper,
      mdiGmail,
      mdiOpenInNew,
    });

    onMounted(async () => {
      try {
        demoVideoURL.value = await server.getImage("DemoVideo.mp4");
        micIconScreenshotURL.value = await server.getImage(
          "MicIconScreenshot.png"
        );
        audioScreenRecordingURL.value = await server.getImage(
          "AudioScreenRecording.mp4"
        );
        playbackScreenRecordingURL.value = await server.getImage(
          "PlaybackScreenRecording.mp4"
        );
        attachScreenshotURL.value = await server.getImage(
          "AttachScreenshot.png"
        );
        completedComposeBoxScreenshotURL.value = await server.getImage(
          "CompletedComposeBoxScreenshot.png"
        );
        deleteRecordingScreenshotURL.value = await server.getImage(
          "DeleteRecordingScreenshot.png"
        );
      } catch {
        actions.showErrorSnackbar(
          "Error retrieving tutorial resources. Please try again."
        );
      }
    });

    const step = ref(1);

    return {
      step,
      icons,
      micIconScreenshotURL,
      audioScreenRecordingURL,
      playbackScreenRecordingURL,
      attachScreenshotURL,
      completedComposeBoxScreenshotURL,
      deleteRecordingScreenshotURL,
      demoVideoURL,
    };
  },
});
</script>

<style scoped>
.step-area {
  height: 600px;
  position: relative;
}

.compose-box-border {
  border: 4px solid lightgray;
  border-radius: 15px;
}

.record-dialog-border {
  outline: 4px solid lightgray;
  border-radius: 25px;
  outline-offset: -4px;
}

a.no-underline {
  text-decoration: none;
}
</style>
