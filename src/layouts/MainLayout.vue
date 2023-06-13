<script setup lang="ts">
import { BRAND_NAME } from 'src/constants/app';
import { useAuthStore } from 'src/stores/auth-store';
import { ref } from 'vue'
// import { fabYoutube } from '@quasar/extras/fontawesome-v6'
import MainLayoutMenuList from './MainLayoutMenuList.vue'

const authStore = useAuthStore();

const leftDrawerOpen = ref(false);
const search = ref('');
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

</script>

<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn v-if="authStore.isAuthenticated" flat dense round aria-label="Menu" icon="menu" @click="toggleLeftDrawer" />

        <q-btn v-if="$q.screen.gt.xs" flat no-caps no-wrap class="q-ml-xs">
          <!-- <q-img src="~/assets/logo.png" alt="Logo"  width="150px"/> -->
          <q-toolbar-title shrink class="text-weight-bold">
            {{ BRAND_NAME }}
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <div v-if="authStore.isAuthenticated" class="YL__toolbar-input-container row no-wrap">
          <q-input v-model="search" dense outlined square placeholder="Search" class="bg-white col" />
          <q-btn class="YL__toolbar-input-btn" color="grey-3" text-color="grey-8" icon="search" unelevated />
        </div>

        <q-space />

        <div v-if="authStore.isAuthenticated" class="q-gutter-sm row items-center no-wrap">

          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="authStore.isAuthenticated" v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2" :width="240">
      <MainLayoutMenuList />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>



<style lang="sass">
.YL
  &__toolbar-input-container
    min-width: 100px
    width: 55%
  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
