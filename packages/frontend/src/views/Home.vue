<template>
  <div>
    <v-app-bar color="primary" height="120" app elevate-on-scroll>
      <a href="#top">
        <v-img :src="logoURL" max-width="280" class="ma-12" href="#top" />
      </a>

      <v-spacer />
      <div class="mr-10">
        <v-btn text color="white" href="#aboutCard">About</v-btn>
        <v-btn text color="white" href="#requestDemoCard">Request a Demo</v-btn>
        <v-btn
          color="white"
          class="primary--text mx-2"
          depressed
          href="https://chrome.google.com/webstore/detail/cfeaabebicbbcmddmgphgncpdlkadgfl?authuser=2&hl=en"
          target="_blank"
          >Install Now</v-btn
        >
        <v-btn v-if="!isAuthenticated" text color="white" to="/login"
          >Login</v-btn
        >
        <v-menu v-else offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" color="white">Welcome, {{ firstName }}</v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <span class="anchor" id="top"></span>

    <div class="pa-10">
      <v-card color="rgba(242, 242, 242, 1)" flat rounded>
        <v-row class="ma-0">
          <v-col cols="6" class="pa-8">
            <div class="text-h3 grey--text text--darken-1 font-weight-bold">
              Send and receive audio messages seamlessly within Gmail
            </div>
            <div class="text-h5 grey--text text--darken-1 mt-10">
              MicDrop improves your emails' efficiency, clarity, and rapport so
              you can get more done.
            </div>
            <v-btn
              color="primary"
              class="white--text mt-14"
              depressed
              x-large
              href="https://chrome.google.com/webstore/detail/cfeaabebicbbcmddmgphgncpdlkadgfl?authuser=2&hl=en"
              target="_blank"
              >Install Now</v-btn
            >
          </v-col>
          <v-col cols="6">
            <video
              :src="videoURL"
              height="420px"
              autoplay
              loop
              width="700px"
              muted
            />
          </v-col>
        </v-row>
      </v-card>

      <v-card color="primary" flat rounded class="mt-6">
        <span class="anchor" id="aboutCard"></span>
        <v-row class="ma-0">
          <v-col cols="6" class="pa-8">
            <div class="text-h3 white--text font-weight-bold">Our Product</div>
            <div class="text-h5 white--text mt-10">
              With the click of a button, record and send audio messages right
              within Gmail. No attachments. No files. No hassle.
            </div>
          </v-col>
        </v-row>
        <v-row class="ma-0" justify="center">
          <v-card
            color="rgba(242, 242, 242, 1)"
            height="325"
            width="325"
            flat
            rounded
            class="mx-6 mb-n16 pa-8"
            ><div class="text-h4 grey--text text--darken-1 font-weight-bold">
              Maximize your time
            </div>
            <div
              class="text-h6 grey--text text--darken-1 mt-6 font-weight-light"
            >
              You are able to speak 7x faster than you type! Listeners will
              interpret audio 2-3x faster than text.
            </div>
          </v-card>
          <v-card
            color="rgba(242, 242, 242, 1)"
            height="325"
            width="325"
            flat
            rounded
            class="mx-6 mb-n16 pa-8"
          >
            <div class="text-h4 grey--text text--darken-1 font-weight-bold">
              Get rid of long drawn-out text
            </div>
            <div
              class="text-h6 grey--text text--darken-1 mt-6 font-weight-light"
            >
              Some ideas are too complex to explain using text. Communicate your
              ideas more clearly through audio.
            </div>
          </v-card>
          <v-card
            color="rgba(242, 242, 242, 1)"
            height="325"
            width="325"
            flat
            rounded
            class="mx-6 mb-n16 pa-8"
          >
            <div class="text-h4 grey--text text--darken-1 font-weight-bold">
              Build rapport with clients
            </div>
            <div
              class="text-h6 grey--text text--darken-1 mt-6 font-weight-light"
            >
              It is difficult to express yourself through text. Be more
              personable with your clients by letting them hear your own voice.
            </div>
          </v-card>
        </v-row>
      </v-card>

      <v-card
        color="rgba(242, 242, 242, 1)"
        flat
        rounded
        style="margin-top: 100px"
      >
        <div class="pa-8">
          <v-row class="ma-0">
            <div class="text-h3 grey--text text--darken-1 font-weight-bold">
              Request a Demo
            </div>
          </v-row>
          <v-row class="ma-0">
            <div class="text-h5 grey--text text--darken-1 mt-4">
              Let us show you how MicDrop can help you and your business.
            </div>
          </v-row>

          <v-row>
            <span class="anchor" id="requestDemoCard"></span>
            <v-col cols="2" />
            <v-col cols="8">
              <v-row class="ma-0 mt-8">
                <v-col cols="6" class="pa-0">
                  <v-text-field
                    filled
                    rounded
                    label="First Name"
                    class="mr-2"
                    hide-details
                  />
                </v-col>
                <v-col cols="6" class="pa-0">
                  <v-text-field
                    filled
                    rounded
                    label="Last Name"
                    class="ml-2"
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-6">
                <v-col cols="6" class="pa-0">
                  <v-text-field
                    filled
                    rounded
                    label="Company"
                    class="mr-2"
                    hide-details
                  />
                </v-col>
                <v-col cols="6" class="pa-0">
                  <v-text-field
                    filled
                    rounded
                    label="Title"
                    class="ml-2"
                    hide-details
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-6">
                <v-text-field filled rounded label="Email" hide-details />
              </v-row>
              <v-row class="ma-0 mt-6">
                <v-textarea
                  filled
                  rounded
                  label="Message"
                  hide-details
                  auto-grow
                />
              </v-row>
              <v-row class="ma-0 mt-6" justify="end">
                <span class="mr-4 mt-1 red--text">Coming Soon</span>
                <v-btn color="primary" class="white--text" depressed disabled
                  >Submit</v-btn
                >
              </v-row>
            </v-col>
            <v-col cols="2" />
          </v-row>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
} from "@vue/composition-api";
import sl from "../serviceLocator";

export default defineComponent({
  name: "Home",
  setup() {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");
    const store = sl.get("store");
    const router = sl.get("router");

    const logoURL = ref("");
    const videoURL = ref("");
    onMounted(async () => {
      try {
        logoURL.value = await server.getImage("logo-drop.png");
      } catch {
        actions.showErrorSnackbar(
          "Error retrieving logo resource. Please refresh to try again."
        );
      }

      try {
        videoURL.value = await server.getImage("MicDropScreenRecording.mp4");
      } catch {
        actions.showErrorSnackbar(
          "Error retrieving video resource. Please refresh to try again."
        );
      }
    });

    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const firstName = computed(() =>
      store.getters.user ? store.getters.user.firstName : ""
    );

    const logout = async () => {
      try {
        store.logout();
        await server.logout();
        router.push("/login");
      } catch {
        actions.showErrorSnackbar("Error logging out. Please try again");
      }
    };

    return {
      logoURL,
      videoURL,
      isAuthenticated,
      firstName,
      logout,
    };
  },
});
</script>

<style scoped>
span.anchor {
  position: absolute;
  top: -120px;
}
</style>
