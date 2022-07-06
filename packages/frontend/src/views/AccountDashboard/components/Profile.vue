<template>
  <div class="pa-12">
    <profile-row
      label="First Name"
      :currentValue="firstName"
      property="firstName"
      @updated="firstName = $event"
    />
    <profile-row
      label="Last Name"
      :currentValue="lastName"
      property="lastName"
      @updated="lastName = $event"
    />
    <profile-row
      label="Email"
      :currentValue="email"
      property="email"
      @updated="email = $event"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import sl from "../../../serviceLocator";
import ProfileRow from "./ProfileRow.vue";

export default defineComponent({
  components: {
    ProfileRow,
  },
  setup() {
    const store = sl.get("store");
    const { user } = store.getters;

    const firstName = ref(user ? user.firstName : "");
    const lastName = ref(user ? user.lastName : "");
    const email = ref(user ? user.email : "");

    return {
      firstName,
      lastName,
      email,
    };
  },
});
</script>
