<template>
  <v-container class="ma-0 pa-10 mt-16" fluid>
    <v-row v-show="step === 1" justify="center" class="step-area mt-16">
      <v-col align="center">
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
          <span class="text-h6 grey--text"
            >Welcome! Let's get you set up! Don't worry, this won't take
            long.</span
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
        <v-row justify="center" class="mt-12">
          <v-btn color="primary" x-large @click="step = 2">Get Started</v-btn>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-show="step === 2" justify="center" class="step-area mt-16">
      <v-col align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">Activate MicDrop</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >To activate MicDrop, log in below.</span
          >
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="30px">{{ icons.mdiLock }}</v-icon>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >Signing into your account allows you to personalize your
            experience, use MicDrop on multiple devices, and access Pro
            features. Your data is always kept secure and private.</span
          >
        </v-row>
        <v-row v-if="isAuthenticated" justify="center" class="my-6">
          <v-icon color="green" size="50px">{{ icons.mdiCheckCircle }}</v-icon>
        </v-row>
        <v-row v-if="isAuthenticated" justify="center" class="my-6">
          <span class="text-h4 green--text"
            >You're logged in! Click continue to finish up and start using
            MicDrop!</span
          >
        </v-row>
        <v-row v-if="!isAuthenticated" justify="center" class="my-6">
          <v-icon color="primary" size="30px">{{ icons.mdiAccount }}</v-icon>
        </v-row>
        <login
          v-if="!isAuthenticated"
          redirectURL="/tutorial?step=2"
          onlyShowButtons
          class="mt-n12"
        />
        <v-row v-if="isAuthenticated" justify="center" class="mt-12">
          <v-btn color="primary" x-large @click="step = 3">Continue</v-btn>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-show="step === 3" justify="center" class="step-area mt-16">
      <v-col cols="4" align="center">
        <v-row justify="center" class="my-6">
          <span class="text-h4 primary--text">You're All Set!</span>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >Now that MicDrop has been activated, you're ready to go!</span
          >
        </v-row>
        <v-row justify="center" class="my-6">
          <v-icon color="primary" size="35px">{{
            icons.mdiPartyPopper
          }}</v-icon>
        </v-row>
        <v-row justify="center" class="my-6">
          <span class="text-h6 grey--text"
            >Click the icon below to open Gmail and send your first MicDrop
            audio message!</span
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
        <v-row justify="center" class="mt-12">
          <span class="text-h6 grey--text"
            >Need some help getting started?</span
          >
        </v-row>
        <v-row justify="center" class="mt-6">
          <v-btn color="primary" x-large to="/onboard"
            >View Full Tutorial</v-btn
          >
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
} from "@vue/composition-api";
import sl from "../../serviceLocator";
import {
  mdiAccount,
  mdiCheckCircle,
  mdiLock,
  mdiPartyPopper,
  mdiOpenInNew,
  mdiGmail,
} from "@mdi/js";
import Login from "../Authentication/Login.vue";

export default defineComponent({
  props: {
    defaultStep: {
      type: Number,
      required: false,
    },
  },
  components: {
    Login,
  },
  setup(props) {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");
    const store = sl.get("store");

    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const step = ref(
      props.defaultStep && props.defaultStep <= 3 ? props.defaultStep : 1
    );

    const demoVideoURL = ref("");

    const icons = ref({
      mdiLock,
      mdiCheckCircle,
      mdiAccount,
      mdiPartyPopper,
      mdiOpenInNew,
      mdiGmail,
    });

    onMounted(async () => {
      try {
        demoVideoURL.value = await server.getImage("DemoVideo.mp4");
      } catch {
        actions.showErrorSnackbar(
          "Error retrieving tutorial resources. Please try again."
        );
      }

      if (
        isAuthenticated.value &&
        props.defaultStep &&
        props.defaultStep === 2
      ) {
        step.value = 3;
      }
    });

    return {
      step,
      demoVideoURL,
      icons,
      isAuthenticated,
    };
  },
});
</script>

<style scoped>
.record-dialog-border {
  outline: 4px solid lightgray;
  border-radius: 25px;
  outline-offset: -4px;
}

a.no-underline {
  text-decoration: none;
}
</style>
