<template>
  <div class="mt-10">
    <v-row class="justify-center">
      <router-link to="/"
        ><v-img
          :src="require('../../assets/logos/blue-logo-alpha-700w.png')"
          max-width="300px"
          class="mb-12 mt-8"
          contain
      /></router-link>
    </v-row>
    <v-row justify="center">
      <v-card class="mt-10 pa-3 max-auto" width="600" elevation="24">
        <v-card-title
          ><h2 class="mb-4 primary--text">Register</h2></v-card-title
        >
        <v-card-text class="d-flex flex-column">
          <v-text-field
            v-model="user.firstName"
            label="First Name"
            outlined
            :error-messages="formErrors.firstName"
          />
          <v-text-field
            v-model="user.lastName"
            label="Last Name"
            outlined
            :error-messages="formErrors.lastName"
          />
          <v-text-field
            v-model="user.email"
            label="Email"
            outlined
            :error-messages="formErrors.email"
          />
          <v-text-field
            v-model="user.password"
            label="Password"
            outlined
            :error-messages="formErrors.password"
            type="password"
          />
          <v-text-field
            v-model="user.repeatPassword"
            label="Confirm Password"
            outlined
            :error-messages="formErrors.repeatPassword"
            type="password"
          />
          <p class="subtitle error--text">{{ errorMessage }}</p>
          <v-btn text to="/login" color="primary"
            >Already have an account? Log In</v-btn
          >
          <br />
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="register"
            color="primary"
            :disabled="Object.values(user).some((v) => !v.trim())"
            ><v-progress-circular
              v-if="loading"
              indeterminate
              size="25"
              width="3"
            />
            <span v-else>Register</span></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { RegisterPayload } from "types";
import sl from "../../serviceLocator";

export default defineComponent({
  name: "Register",
  props: {
    redirectURL: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const server = sl.get("serverProxy");
    const store = sl.get("store");
    const router = sl.get("router");

    const loading = ref(false);

    const user = ref({
      email: "",
      password: "",
      repeatPassword: "",
      firstName: "",
      lastName: "",
    });

    const formErrors = ref({
      email: "",
      password: "",
      repeatPassword: "",
      firstName: "",
      lastName: "",
    });

    const errorMessage = ref("");

    const validate = () => {
      let valid = true;
      formErrors.value = {
        email: "",
        password: "",
        repeatPassword: "",
        firstName: "",
        lastName: "",
      };

      if (
        user.value.repeatPassword !== user.value.password &&
        user.value.password !== "" &&
        user.value.repeatPassword !== ""
      ) {
        formErrors.value.repeatPassword = "Passwords do not match";
        valid = false;
      }

      if (user.value.password.length < 8 && user.value.password !== "") {
        formErrors.value.password =
          "Password must be at least 8 characters long";
        valid = false;
      }

      if (!/.+@.+\..+/.test(user.value.email) && user.value.email !== "") {
        formErrors.value.email = "Email is not formatted correctly";
        valid = false;
      }

      return valid;
    };

    const register = async () => {
      loading.value = true;

      if (!validate()) {
        loading.value = false;
        return;
      }

      errorMessage.value = "";
      const registerPayload: RegisterPayload = {
        firstName: user.value.firstName,
        lastName: user.value.lastName,
        email: user.value.email,
        password: user.value.password,
      };

      try {
        const user = await server.register(registerPayload);
        store.setUser(user);
        router.push(props.redirectURL);
      } catch (err) {
        errorMessage.value = (err as any).response.data.message;
      } finally {
        loading.value = false;
      }
    };

    return {
      user,
      formErrors,
      errorMessage,
      validate,
      register,
      loading,
    };
  },
});
</script>
