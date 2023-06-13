<script setup lang="ts">
import {RouteNames, RoutePaths} from 'src/constants/routes';
import {ref} from 'vue';
import {useRoute} from 'vue-router'
import {AmthauerStrings} from 'src/components/amthauer/constants/AmthauerStrings';


const links = ref([
  { icon: 'dashboard', path: RoutePaths.dashboard, label: RouteNames.dashboard },
  { icon: 'o_psychology', path: RoutePaths.amthauerMain, label: AmthauerStrings.amthauerTest },
  { icon: 'logout', path: RoutePaths.logout, label: RouteNames.logout },
]);

const route = useRoute()

const buttons1 = [
  { text: 'About' },
  { text: 'Copyright' },
  { text: 'Contact us' },
]

const isActive = (itemRoute: string) => {

  return route.path === itemRoute
}


</script>

<template>
  <q-scroll-area class="fit">
    <q-list padding>
      <q-item
v-for="link in links" :key="link.path" :to="link.path" exact :class="{ active: isActive(link.path) }"
        :active-class="'bg-grey-4'">
        <q-item-section avatar>
          <q-icon color="grey" :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ link.label }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator class="q-my-md" />

      <div class="q-px-md text-grey-9">
        <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
          <a v-for="button in buttons1" :key="button.text" class="YL__drawer-footer-link" href="javascript:void(0)">
            {{ button.text }}
          </a>
        </div>
      </div>

    </q-list>
  </q-scroll-area>
</template>
