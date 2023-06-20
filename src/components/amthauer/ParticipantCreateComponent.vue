<script setup lang="ts">
import {AmthauerStrings} from 'components/amthauer/constants/AmthauerStrings';
import {IParticipant} from 'components/amthauer/interfaces/IParticipant';
import {ref, watchEffect} from 'vue';
import {Gender} from 'components/amthauer/constants/GenderStrings';
import {CommonStrings} from 'src/constants/CommonStrings';
import {useAmthauerStore} from 'stores/amthauer-store';
import { useRouter } from 'vue-router';
import {RoutePaths} from 'src/constants/routes';
import {Notify} from "quasar";
// import {useAuthStore} from "stores/auth-store";

const router = useRouter()
const amthauerStore = useAmthauerStore();
// const authStore = useAuthStore();

const participant = ref<IParticipant>({
  first_name: '',
  last_name: '',
  gender: null,
  date_of_birth: null,
  email: null,
  phone_number: null,
});

const genderOptions = [
  {label: 'Мужской', value: Gender.male},
  {label: 'Женский', value: Gender.female},
  {label: 'Другое', value: Gender.other},
];

const selectedDate = ref<string>('');

watchEffect(() => {
  // Update selectedDate whenever participant.date_of_birth changes
  selectedDate.value = participant.value.date_of_birth || AmthauerStrings.dateOfBirth;
});

const onSubmit = async () => {
  console.log('participant', participant)
  participant.value.gender = participant.value.gender?.value ?? null;
  if (!participant.value.gender || !participant.value.date_of_birth) {
    Notify.create({
      color: 'negative',
      message: 'Заполните все поля'
    });
  } else {
    await amthauerStore.createParticipant(participant.value)
    await router.push(RoutePaths.testing);
  }
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

          <q-form
            @submit="onSubmit"
            class="q-gutter-md "
          >
            <q-input
              v-model="participant.first_name"
              label="Имя"
              required
              dense
              outlined
            />
            <q-input
              v-model="participant.last_name"
              label="Фамилия"
              dense
              outlined
            />
            <q-select
              v-model="participant.gender"
              label="Пол"
              :options="genderOptions"
              required
              dense
              outlined
            />

            <q-btn
              v-model="participant.date_of_birth"
              :label="selectedDate" icon="event"
            >
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
              label="Номер телефона"
              :clearable="true"
              required
              dense
              outlined
            />

            <div>
              <q-btn :label="CommonStrings.submit" type="submit" color="primary"/>
            </div>


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
