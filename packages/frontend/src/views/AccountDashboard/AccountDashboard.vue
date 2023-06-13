<template>
  <div>
    <v-navigation-drawer app clipped v-model="drawer" color="primary">
      <v-list-item-group class="mt-4">
        <v-list-item
          v-for="(route, idx) in routes"
          :key="idx"
          @click="route.action"
        >
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              route.label
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-navigation-drawer>

    <v-app-bar color="primary" height="80" app clipped-left>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        color="white"
        class="mr-2 ml-1"
      />
      <span class="white--text text-h5">Account Dashboard</span>
      <v-spacer />
      <div class="mr-10">
        <v-btn text color="white" @click="logout">Logout</v-btn>
      </div>
    </v-app-bar>

    <profile v-if="selectedRoute === 'profile'" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import Profile from './components/Profile.vue';
import sl from '../../serviceLocator';

export type DashboardRoute = 'profile';

export default defineComponent({
  name: 'AccountDashboard',
  components: {
    Profile,
  },
  setup() {
    const server = sl.get('serverProxy');
    const actions = sl.get('globalActions');
    const store = sl.get('store');
    const router = sl.get('router');

    const drawer = ref(true);

    const logout = async () => {
      try {
        store.logout();
        await server.logout();
        router.push('/login');
      } catch {
        actions.showErrorSnackbar('Error logging out. Please try again.');
      }
    };

    const selectedRoute = ref<DashboardRoute>('profile');

    const state = reactive({
      routes: [
        {
          label: 'Profile',
          action: () => (selectedRoute.value = 'profile'),
        },
      ],
    });

    return {
      logout,
      drawer,
      ...toRefs(state),
      selectedRoute,
    };
  },
});
</script>
