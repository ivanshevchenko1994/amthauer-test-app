<script setup lang="ts">
import {AmthauerStrings} from 'src/components/amthauer/constants/AmthauerStrings';
import {onBeforeMount} from 'vue';
import {useAmthauerStore} from 'stores/amthauer-store';
import {RoutePaths} from "src/constants/routes";

const amthauerStore = useAmthauerStore();


onBeforeMount(async () => {
  console.log('******************************************')
  await amthauerStore.fetchAmthauerTest();
  await amthauerStore.fetchParticipants();
  console.log(amthauerStore.components)
  console.log('******************************************')
});

</script>

<template>
  <q-card class="amthauer__card_style">
    <q-card-section>
      <div class="text-h6">{{ AmthauerStrings.amthauerTest }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 text-right">
          <q-btn color="primary" :to="RoutePaths.participantCreate" :label="AmthauerStrings.startTest" />
        </div>
      </div>
      <div class="mt_between_elements" />

    </q-card-section>

  </q-card>
</template>

<style scoped>

</style>
