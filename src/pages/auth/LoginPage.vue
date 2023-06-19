<script setup lang="ts">

import {ref} from 'vue';
import {useAuthStore} from 'src/stores/auth-store';
import {navigate} from 'src/utils/router';
import {api} from 'boot/axios'
import {useRoute, useRouter} from 'vue-router';
import {RoutePaths} from 'src/constants/routes';
import {LOGIN} from 'src/constants/app';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const route = useRoute();
const router = useRouter();

if (authStore.isAuthenticated) {
  router.push(RoutePaths.dashboard);
}

console.log('typeof(authStore)', typeof (authStore));


async function login() {
  try {
    await authStore.login(email.value, password.value);
    console.log(typeof (api.defaults.headers.common['Authorization']))
    console.log(api.defaults.headers.common['Authorization'])
    navigate(RoutePaths.dashboard, route, router);
  } catch (error: any) {
    console.log(typeof (error));
    console.log(error);
    console.log(error.name);
    console.log('***********************');
    errorMessage.value = error.message;
  }
}

</script>

<template>
  <q-page class="flex flex-center q-mx-md">
    <q-card class=" full-width " style="max-width: 600px;">
      <q-card-section class="text-center">
        <!-- <q-img src="~/assets/logo.svg" alt="Logo"  width="150px"/> -->

        <h1 class="text-h5">
          {{ LOGIN }}
        </h1>
      </q-card-section>

      <q-separator class="q-mb-md"/>

      <q-card-section>
        <q-input v-model="email" class="q-mb-md" label="Email" outlined required/>
        <q-input v-model="password" label="Пароль" type="password" outlined required/>

        <q-btn class="full-width q-mt-md" color="primary" label="Вход" @click="login"/>

        <!-- Display error message if it exists -->
        <div v-if="errorMessage" class="q-mt-md" color="negative">
          <div>{{ errorMessage }}</div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped lang="scss">
.iconComponent {
  fill: $primary;
}
</style>
