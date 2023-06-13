<script setup lang="ts">
import {AmthauerStrings} from 'components/amthauer/constants/AmthauerStrings';
import {IParticipant} from 'components/amthauer/interfaces/IParticipant';
import {ref, watchEffect} from 'vue';
import {Gender} from 'components/amthauer/constants/GenderStrings';
import {CommonStrings} from "src/constants/CommonStrings";

const participant = ref<IParticipant>({
  first_name: '',
  last_name: '',
  gender: null,
  date_of_birth: null,
  email: null,
  phone_number: null,
});

const genderOptions = [
  {label: 'Male', value: Gender.male},
  {label: 'Female', value: Gender.female},
  {label: 'Other', value: Gender.other},
];

const selectedDate = ref<string>('');

watchEffect(() => {
  // Update selectedDate whenever participant.date_of_birth changes
  selectedDate.value = participant.value.date_of_birth || 'Date of birth';
});

const submitForm = () => {
  console.log('participant', participant)
};

</script>

<template>
  <q-card class="amthauer__card_style">
    <q-card-section>
      <div class="text-h6">{{ AmthauerStrings.amthauerTest }} - {{ AmthauerStrings.participantCreate }}</div>
    </q-card-section>
    <q-separator/>

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12">

          <q-form @submit="submitForm" class="q-col-gutter-y-md col-12 settings_fields">
            <q-input
              v-model="participant.first_name"
              label="First Name"
              required
              dense
              outlined
            />
            <q-input
              v-model="participant.last_name"
              label="Last Name"
              dense
              outlined
            />
            <q-select
              v-model="participant.gender"
              label="Gender"
              :options="genderOptions"
              required
              dense
              outlined
            />

            <q-btn
              v-model="participant.date_of_birth"
              :label="selectedDate" icon="event"
              style="width: 100%"
            class="mt_between_elements">
              <q-popup-proxy cover trasition-show="scale" trasition-hide="scale">
                <q-date v-model="participant.date_of_birth" mask="YYYY-MM-DD" >
                  <q-btn v-close-popup flat :label="CommonStrings.close" />
                </q-date>
              </q-popup-proxy>
            </q-btn>

            <q-input
              v-model="participant.email"
              label="Email"
              type="email"
              :clearable="true"
              required
              dense
              outlined
            />
            <q-input
              v-model="participant.phone_number"
              label="Phone Number"
              :clearable="true"
              required
              dense
              outlined
            />
            <div class="mt_between_elements"/>
            <q-btn type="submit" label="Submit"></q-btn>
          </q-form>

        </div>
      </div>
      <div class="mt_between_elements"/>

    </q-card-section>

  </q-card>
</template>

<style scoped lang="scss">
.settings_fields {
  max-width: 350px;
}
</style>
