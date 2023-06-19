<script setup lang="ts">
import {AmthauerStrings} from 'src/components/amthauer/constants/AmthauerStrings';
import {onBeforeMount, ref} from 'vue';
import {useAmthauerStore} from 'stores/amthauer-store';
import {RoutePaths} from 'src/constants/routes';

const amthauerStore = useAmthauerStore();

onBeforeMount(async () => {
  console.log('******************************************')
  await amthauerStore.fetchAmthauerTest();
  await amthauerStore.fetchParticipants();
  console.log(amthauerStore.components)
  console.log('******************************************')
});


const participants = ref([]); // Place your JSON data here

const columns = [
  {
    name: 'first_name',
    required: true,
    label: 'Имя',
    align: 'left',
    field: 'first_name',
    sortable: true
  },
  {
    name: 'last_name',
    required: true,
    label: 'Фамилия',
    align: 'left',
    field: 'last_name',
    sortable: true
  },
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'left',
    field: 'email',
    sortable: true
  },
  {
    name: 'date_of_birth',
    required: true,
    label: 'Дата рождения',
    align: 'left',
    field: 'date_of_birth',
    sortable: true
  },
  {
    name: 'test_date',
    required: true,
    label: 'Дата тестирования',
    align: 'left',
    field: 'test_date',
    sortable: true
  },
  {
    name: 'raw_score',
    required: true,
    label: 'Баллы',
    align: 'left',
    field: 'raw_score',
    sortable: true
  },
  {
    name: 'time_taken_seconds',
    required: true,
    label: 'Потраченое время',
    align: 'left',
    field: 'time_taken_seconds',
    sortable: true
  }
];

// const participants = amthauerStore.participants;

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

      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-table
            :rows="amthauerStore.getParticipantTableData"
            :columns="columns"
            row-key="id"
          ></q-table>


        </div>
      </div>

    </q-card-section>

  </q-card>
</template>

<style scoped>

</style>
