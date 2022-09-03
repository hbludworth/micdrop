<template>
  <div>
    <div
      id="header-bar"
      :class="[
        scrollState.atTop ? 'heightTall' : 'heightShort elevation-5',
        'pa-4',
      ]"
    >
      <a href="#top">
        <transition mode="out-in">
          <v-img
            v-if="scrollState.mainLogoIsVisible"
            :src="IMAGE_URL.WHITE_DROP"
            @load="imageLoaded('HEADER_BAR_LOGO')"
            height="30"
            width="38"
            contain
          />
          <v-img
            v-else
            :src="IMAGE_URL.WHITE_LOGO_ALPHA"
            @load="imageLoaded('HEADER_BAR_LOGO')"
            max-width="200"
            width="30vw"
            max-height="40"
            contain
          />
        </transition>
      </a>
      <div class="d-flex flex-wrap justify-end align-center">
        <template v-if="!isAuthenticated">
          <v-btn
            href="https://chrome.google.com/webstore/detail/cfeaabebicbbcmddmgphgncpdlkadgfl?authuser=2&hl=en"
            target="_blank"
            rounded
            :small="widthState.small"
            :x-small="widthState.x_small"
            class="primary--text mx-1"
          >
            Get Started
          </v-btn>
          <v-btn
            text
            rounded
            :small="widthState.small"
            :x-small="widthState.x_small"
            color="secondary"
            to="/login"
            class="mx-1"
          >
            Login
          </v-btn>
        </template>
        <template v-else>
          <span class="secondary--text mx-1 px-4"
            >Welcome, {{ firstName }}</span
          >
          <div>
            <v-btn
              rounded
              :small="widthState.small"
              :x-small="widthState.x_small"
              @click="router.push('/account_dashboard')"
              class="primary--text mx-1"
            >
              Dashboard
            </v-btn>
            <v-btn
              text
              rounded
              :small="widthState.small"
              :x-small="widthState.x_small"
              color="secondary"
              @click="logout"
              class="mx-1"
            >
              Logout
            </v-btn>
          </div>
        </template>
      </div>
    </div>
    <span class="anchor" id="top"></span>
    <div
      id="header"
      class="
        primary
        d-flex
        flex-column
        align-center
        justify-space-between
        secondary--text
        mb-8
      "
    >
      <div class="d-flex flex-column align-center">
        <v-img
          id="main-logo"
          :src="IMAGE_URL.WHITE_LOGO_ALPHA"
          @load="imageLoaded('HEADER_LOGO')"
          max-height="70"
          max-width="250"
          contain
        />
        <div class="pt-2 px-10">
          <span class="text-h4 font-weight-thin"
            >Send audio messages through email</span
          >
        </div>
      </div>
      <div class="mt-8 mb-6 relative d-flex justify-center">
        <v-img
          id="compose-box"
          @load="imageLoaded('COMPOSE_BOX')"
          :src="IMAGE_URL.BLANK_COMPOSE_BOX"
          contain
          width="475"
          max-width="70vw"
          class="rounded-lg"
        />
        <playback
          id="playback-ui"
          class="accent--text d-none d-md-block"
          :audioMessage="audioMessage"
        />
        <div class="left">
          <div class="text-bubble">
            <div class="point"></div>
            <span>Try it out!</span>
          </div>
        </div>
        <div class="right">
          <div class="text-bubble">
            <div class="point"></div>
            <span>Integrate MicDrop seamlessly within Gmail</span>
          </div>
        </div>
      </div>
      <div id="try-free-section" class="mb-10">
        <div class="pa-2 d-flex justify-center subtitle-1">
          <span>No attachments, no files, no hassle</span>
        </div>
        <v-btn rounded class="primary--text mx-auto d-flex pa-5"
          >Try For Free Today</v-btn
        >
      </div>
    </div>

    <div v-show="cardsRenderReady">
      <div class="cards d-flex justify-space-around py-16">
        <v-card
          v-for="card in cards"
          :key="card.key"
          class="card elevation-4 d-flex flex-column align-center pa-6 relative"
        >
          <v-chip
            v-if="card.id === 'card_3'"
            outlined
            color="red"
            id="coming-soon"
            >Coming Soon!</v-chip
          >
          <v-img
            v-if="true"
            :src="IMAGE_URL[card.logo]"
            @load="imageLoaded(card.id)"
            contain
            max-height="30"
            class="mb-3"
          />
          <div v-else style="background: teal; width: 100%; height: 60px"></div>
          <div class="text-caption font-weight-light">
            <span class="text-h4" style="vertical-align: sub"
              >${{ card.price }}</span
            >
            /Month
          </div>
          <div class="text-caption font-weight-light py-2">
            {{ card.blurb }}
          </div>
          <ul class="font-weight-medium pr-6">
            <li v-for="point in card.points" :key="point.id">
              {{ point.text }}
            </li>
          </ul>
        </v-card>
      </div>

      <div
        id="contact-us-text"
        class="d-flex justify-center flex-wrap align-center pb-12"
      >
        <span class="primary--text text-center ma-3 font-weight-medium"
          >Let us show you how MicDrop can help your team</span
        >
        <v-btn
          rounded
          class="primary secondary--text pa-5"
          href="mailto:feedback@sendmicdrop.com"
          >Contact Us</v-btn
        >
      </div>
    </div>

    <hr class="ma-8 mt-10" />

    <div class="footer d-flex flex-wrap justify-center mx-auto">
      <v-img
        :src="require('../assets/logos/blue-logo-alpha-700w.png')"
        max-height="30"
        max-width="170"
        class="mr-auto mb-4"
        contain
      ></v-img>

      <div class="d-flex justify-space-around flex-grow-1 mb-4">
        <div class="mx-2">
          <h3>Products</h3>
          <ul>
            <li>MicDrop</li>
            <li>MicDropPro</li>
            <li>MicDropTeams</li>
          </ul>
        </div>

        <div class="mx-2">
          <h3>About Us</h3>
          <ul>
            <li>Our Story</li>
          </ul>
        </div>

        <div class="mx-2">
          <h3>Contact Us</h3>
          <ul>
            <li>feedback@sendmicdrop.com</li>
          </ul>
        </div>
      </div>

      <div class="social text-h4">
        <span
          class="mdi mdi-linkedin"
          href="https://www.facebook.com/sendmicdrop"
        ></span>
        <span
          class="mdi mdi-facebook"
          href="https://www.linkedin.com/company/micdrop2022/"
        ></span>
      </div>
    </div>

    <div class="accent--text text-caption font-weight-light pb-8 pl-8 pt-4">
      <span class="mdi mdi-copyright mr-2"></span>Copyright, MicDrop LLC, All
      Rights Reserved
    </div>
  </div>
</template>

<style scoped>
#header {
  height: 750px;
  padding-top: 100px;
}

#header * {
  text-align: center;
}

#playback-ui {
  position: absolute;
  top: 90px;
}

.relative {
  position: relative;
}

.left {
  position: absolute;
  top: 26%;
  left: -25px;
}

.right {
  position: absolute;
  width: 200px;
  min-height: 50px;
  bottom: -2%;
  right: -100px;
}

@media screen and (max-width: 960px) {
  .left {
    top: 35%;
    left: calc(50% - 150px);
  }

  .right {
    top: calc(35% + 60px);
    left: calc(50% - 50px);
  }
}

.right .point {
  width: 40%;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  left: 0;
}

.left .point {
  width: 50%;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  right: 0;
}

.text-bubble {
  height: 100%;
  background: var(--v-secondary-base);
  padding: 0.65rem;
  width: 100%;
  border-radius: 15px;
  position: relative;
  filter: drop-shadow(2px 2px 6px var(--v-accent-base));
}

.text-bubble span {
  color: var(--v-primary-base);
  position: relative;
}

.point {
  height: 70%;
  background: var(--v-secondary-base);
  position: absolute;
  top: 50%;
}

.cards {
  margin: auto;
  width: 80%;
  max-width: 1100px;
  flex-wrap: wrap;
}

.card {
  width: 275px;
  margin: 20px 10px;
}

#coming-soon {
  position: absolute;
  bottom: 101%;
  font-size: 1rem;
  font-weight: 500;
}

.footer {
  color: var(--v-accent-base);
  max-width: 95%;
}

.footer ul {
  list-style: none;
  padding: 0;
}

.footer ul li {
  font-size: 0.75rem;
  padding: 0.2rem 0;
}

.footer .social {
  width: 200px;
  text-align: center;
}

.footer .social span {
  margin: 0 0.5rem;
}

/* Transitions */

#header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--v-primary-base);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: height 0.3s ease-in-out;
}

.heightTall {
  height: 90px;
}

.heightShort {
  height: 60px;
}

.disappear {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease-in;
}

#header .disappear {
  transition-duration: 0.7s;
  transition-property: opacity, transform;
  transition-timing-function: ease-in;
}

.disappear.left {
  transform: translateX(-10px);
}

.disappear.right {
  transform: translateX(10px);
}

.appear {
  opacity: 1;
  transform: translate(0) !important;
}

#try-free-section {
  transition-delay: 0.5s;
}
</style>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
} from "@vue/composition-api";
import sl from "../serviceLocator";
import Playback from "frontend/src/components/Playback/Playback.vue";
import { AudioMessageWithUrl } from "types";

export default defineComponent({
  name: "Home",
  components: {
    Playback,
  },
  setup() {
    const server = sl.get("serverProxy");
    const actions = sl.get("globalActions");
    const store = sl.get("store");
    const router = sl.get("router");

    const audioMessage = ref<AudioMessageWithUrl>();

    onMounted(async () => {
      getImages();
      getHTMLElements();
      handleScroll();
      document.addEventListener("scroll", handleScroll);
      updateWidth();
      window.addEventListener("resize", updateWidth);
      check("onMounted");

      try {
        audioMessage.value = await server.getAudioMessage(
          "79609125-9549-46cd-babc-58f581516945"
        );
      } catch {
        actions.showErrorSnackbar(
          "Error retriving audio message. Please try again."
        );
      }
    });

    const check = (string: string) => {
      console.log(`${string} - ${window.scrollY}`);
    };

    const cardsRenderReady = computed(() => {
      return (
        IMAGE_LOADED.value.card_1 &&
        IMAGE_LOADED.value.card_2 &&
        IMAGE_LOADED.value.card_3
      );
    });

    const IMAGE_LOADED = ref<{ [key: string]: boolean }>({
      HEADER_BAR_LOGO: false,
      HEADER_LOGO: false,
      COMPOSE_BOX: false,
      card_1: false,
      card_2: false,
      card_3: false,
    });
    let headerBarRenderReady = false;
    let headerRenderReady = false;
    const imageLoaded = (key: string) => {
      console.log(key);
      check(key);
      IMAGE_LOADED.value[key] = true;
      if (key === "HEADER_BAR_LOGO" && !headerBarRenderReady) {
        headerBarRenderReady = true;
        headerBarElements.makeElementsAppear();
        if (headerRenderReady) {
          headerElements.makeElementsAppear();
        }
      } else if (key === "HEADER_LOGO" || key === "COMPOSE_BOX") {
        if (IMAGE_LOADED.value.HEADER_LOGO && IMAGE_LOADED.value.COMPOSE_BOX) {
          headerRenderReady = true;
          if (headerBarRenderReady) {
            headerElements.makeElementsAppear();
          }
        }
      }
    };

    const IMAGE_URL = ref<{ [key: string]: string }>({
      WHITE_DROP: "white-drop-500w.png",
      WHITE_LOGO_ALPHA: "white-logo-alpha-700w.png",
      BLUE_LOGO_ALPHA: "blue-logo-alpha-700w.png",
      BLUE_LOGO_PRO_ALPHA: "blue-logoPRO-alpha-1000w.png",
      BLUE_LOGO_TEAMS_ALPHA: "blue-teamslogo-drop-alpha-1000w.png",
      BLANK_COMPOSE_BOX: "BlankGmailDraft.png",
    });
    let headerElements: ElementArray;
    let headerBarElements: ElementArray;
    const getImages = async () => {
      try {
        headerBarElements = new ElementArray(
          ...Array.from(document.getElementById("header-bar")?.children || [])
        );
        headerBarElements.makeElementsDisappear();
        headerElements = new ElementArray(
          document.getElementById("header")?.children[0],
          document.getElementById("try-free-section"),
          document.querySelector("#header .left"),
          document.querySelector("#header .right"),
          document.getElementById("compose-box"),
          document.getElementById("playback-ui")
        );
        headerElements.makeElementsDisappear();

        for (let image of Object.keys(IMAGE_URL.value)) {
          server.getImage(IMAGE_URL.value[image]).then((url) => {
            IMAGE_URL.value[image] = url;
          });
        }
        check("getImages");
      } catch (error) {
        console.log(error);
      }
    };

    class ElementArray extends Array<Element> {
      constructor(...elements: Array<Element | null | undefined>) {
        super();
        this.add(...elements);
      }

      add(...elements: Array<Element | null | undefined>) {
        elements.forEach((element) => {
          if (element !== null && element !== undefined) {
            this.push(element);
          }
        });
      }

      makeElementsDisappear() {
        this.forEach((element) => {
          element.classList.add("disappear");
        });
      }

      makeElementsAppear() {
        this.forEach((element) => {
          element.classList.add("appear");
        });
      }
    }

    var mainLogo: HTMLElement;
    var elementsToAppear: ElementArray;
    const getHTMLElements = () => {
      let logo = document.getElementById("main-logo");
      if (logo != null) {
        mainLogo = logo;
      }

      let cardElements = Array.from(
        document.getElementsByClassName("card v-card")
      );
      let contactUsText = document.getElementById("contact-us-text");

      elementsToAppear = new ElementArray(...cardElements, contactUsText);
      elementsToAppear.makeElementsDisappear();
    };

    const windowWidth = ref(0);
    const updateWidth = () => {
      windowWidth.value =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    };
    const widthState = computed(() => {
      let width = windowWidth.value;
      return {
        x_small: width < 425,
        small: width < 700 && width >= 425,
      };
    });

    const scrollState = ref({
      atTop: true,
      mainLogoIsVisible: true,
    });
    const handleScroll = () => {
      const atTop = window.scrollY === 0;
      const mainLogoIsVisible =
        atTop ||
        mainLogo.getBoundingClientRect().bottom - 20 > getHeaderHeight();
      scrollState.value = { atTop, mainLogoIsVisible };
      showVisibleElements();
    };

    const showVisibleElements = () => {
      for (let element of elementsToAppear) {
        let boundingRect = element.getBoundingClientRect();
        if (boundingRect.top < window.innerHeight - boundingRect.height / 3) {
          element.classList.add("appear");
        } else {
          element.classList.remove("appear");
        }
      }
    };

    const getHeaderHeight = () => {
      let header = document.getElementById("header-bar");
      if (header != null) {
        let height = header.getBoundingClientRect().bottom;
        return Number(height);
      }
      return 0;
    };

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

    const cards = ref([
      {
        id: "card_1",
        logo: "BLUE_LOGO_ALPHA",
        logoName: "",
        price: 0,
        blurb: "For casual users looking to improve efficiency",
        points: [
          {
            text: "Integrate MicDrop seamlessly within Gmail",
            id: 1,
          },
          {
            text: "Record and send 30 audio messages/month",
            id: 2,
          },
          {
            text: "Record audio messages up to 60 seconds",
            id: 3,
          },
        ],
      },
      {
        id: "card_2",
        logo: "BLUE_LOGO_PRO_ALPHA",
        logoName: "",
        price: 4,
        blurb: "For professionals looking to build rapport with their clients",
        points: [
          {
            text: "Record and send unlimited audio messages/month",
            id: 1,
          },
          {
            text: "Unlimited audio recording time",
            id: 2,
          },
          {
            text: "Customize your MicDrop playback",
            id: 3,
          },
          {
            text: "Save and resend past recordings",
            id: 4,
          },
        ],
      },
      {
        id: "card_3",
        logo: "BLUE_LOGO_TEAMS_ALPHA",
        logoName: "",
        price: 12,
        blurb:
          "For Business teams looking to improve email efficiency and response rate",
        points: [
          {
            text: "Custom playback branding for your business",
            id: 1,
          },
          {
            text: "Team dashboard with key email analytics",
            id: 2,
          },
          {
            text: "AI assisted scripting to help improve response rate",
            id: 3,
          },
        ],
      },
    ]);

    return {
      isAuthenticated,
      firstName,
      logout,
      router,
      cards,
      scrollState,
      widthState,
      IMAGE_URL,
      imageLoaded,
      IMAGE_LOADED,
      cardsRenderReady,
      audioMessage,
    };
  },
});
</script>