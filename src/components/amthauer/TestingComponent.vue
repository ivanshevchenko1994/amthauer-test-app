<script setup lang="ts">
import {AmthauerStrings} from 'src/components/amthauer/constants/AmthauerStrings';
import {useAmthauerStore} from 'stores/amthauer-store';
import {computed, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {RoutePaths} from 'src/constants/routes';
import {Notify} from 'quasar';
import {IParticipantAnswer} from 'components/amthauer/interfaces/IParticipantAnswer';
import {ISessionFinish} from 'components/amthauer/interfaces/ISession';

const amthauerStore = useAmthauerStore();

// onBeforeMount(async() => {
//   await amthauerStore.fetchAmthauerTest();
//   console.log('--------------')
//   console.log(amthauerStore.getComponentLength)
//   console.log('--------------')
//
// });
const router = useRouter()
const components = amthauerStore.components;
if (amthauerStore.getComponentLength === 0) {
  router.push(RoutePaths.amthauerMain)
}
const isLoading = computed(() => amthauerStore.getComponentLength === 0);

const currentComponentIndex = ref(0);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);

const cancelComponent = () => {
  router.push(RoutePaths.amthauerMain)
}

const nextQuestion = async () => {
  console.log(selectedAnswer.value)

  if (selectedAnswer.value === null) {
    Notify.create({
      color: 'negative',
      message: 'Введите ответ и нажмите кнопку "Следующий"'
    });
  }

  if (selectedAnswer.value !== null) {
    console.log('---------------000000000000------------')
    console.log(currentQuestionIndex.value)
    console.log(currentComponentIndex.value)
    console.log('---------------000000000000------------')

    const currentComponent = components[currentComponentIndex.value];
    const currentQuestion = currentComponent.questions[currentQuestionIndex.value];
    console.log('---------------000000000000------------')
    // Send selected answer to backend using Axios
    console.log('------------AXIOS-----------')
    console.log(`quesion id: ${currentQuestion.id}; answer_id: ${selectedAnswer.value}`)
    console.log(amthauerStore.participant)
    if (amthauerStore.participant.session && amthauerStore.participant.session.id && currentQuestion.id) {
      console.log(`session_id: ${amthauerStore.participant.session.id}; component_id: ${currentComponent.id}`)

      const participantAnswer: IParticipantAnswer = {
        session_id: amthauerStore.participant.session.id,
        component_id: currentComponent.id,
        question_id: currentQuestion.id,
        answer_id: selectedAnswer.value,
        time_taken_answer_seconds: 0
      }
      await amthauerStore.createParticipantAnswer(participantAnswer)
    }


    console.log('============AXIOS===========')

    // Move to the next question or component
    if (currentQuestionIndex.value + 1 < currentComponent.questions.length) {
      // Move to the next question in the current component
      currentQuestionIndex.value++;
    } else if (currentComponentIndex.value + 1 < components.length) {
      // Move to the next component and reset the question index
      currentComponentIndex.value++;
      currentQuestionIndex.value = 0;
    } else {
      // All components and questions are finished
      currentComponentIndex.value = components.length;
      currentQuestionIndex.value = 0;
    }

    // Reset selected answer
    selectedAnswer.value = null;
  }

};

const isFinished = ref(false);

watch(currentComponentIndex, async (newIndex) => {
  if (newIndex === amthauerStore.getComponentLength && amthauerStore.session.id) {
    console.log('""""""""""""""""""""""""');
    console.log(newIndex);
    console.log(components.length);
    const sessionFinish: ISessionFinish = {
      end_time: amthauerStore.getCurrentDateTime(),
    };

    console.log('amthauerStore.session.id', amthauerStore.session.id);
    await amthauerStore.updateSession(amthauerStore.session.id, sessionFinish);
    await amthauerStore.calculateScoreResult(amthauerStore.session.id);
    console.log('""""""""""""""""""""""""');
    isFinished.value = true;
  } else {
    isFinished.value = false;
  }
});

// const isFinished = computed( () => {
//   if (currentComponentIndex.value === amthauerStore.getComponentLength) {
//     console.log('""""""""""""""""""""""""')
//     console.log(currentComponentIndex.value)
//     console.log(components.length)
//     const sessionFinish: ISessionFinish = {
//       end_time: amthauerStore.getCurrentDateTime()
//     }
//
//
//     if (amthauerStore.session.id ) {
//       console.log('amthauerStore.session.id', amthauerStore.session.id)
//       updateSession(amthauerStore.session.id, sessionFinish);
//     }
//     console.log('""""""""""""""""""""""""')
//     return true
//   }
//   return false
// });


</script>

<template>
  <q-card class="amthauer__card_style">
    <q-card-section>
      <div class="text-h6">{{ AmthauerStrings.amthauerTest }}</div>
    </q-card-section>
    <q-separator/>

    <q-card-section>
      <div class="row q-col-gutter-md">

        <q-spinner v-if="isLoading" size="50px" color="primary"/>
        <div v-else>
          <div v-for="(component, componentIndex) in amthauerStore.components" :key="componentIndex">

            <div v-for="(question, questionIndex) in component.questions" :key="questionIndex"
                 v-show="currentComponentIndex === componentIndex && currentQuestionIndex === questionIndex">
              <p class="text-h5">{{ component.component_title }}</p>

              <div>
                <div v-html="component.component_description"></div>
              </div>

              <q-separator/>

              <p class="q-mt-sm text-h6">{{ question.question_text }}</p>

              <div class="q-pa-md">
                <div v-for="answer in question.answers" :key="answer.id">
                  <q-radio
                    v-model="selectedAnswer"
                    :val="answer.id"
                    :label="answer.answer_text"
                    color="secondary"
                  />

                </div>
              </div>


<!--                <div v-for="answer in question.answers" :key="answer.id">-->
<!--                  <label>-->
<!--                    <input-->
<!--                      type="radio"-->
<!--                      :name="`question_${question.id}`"-->
<!--                      :value="answer.id"-->
<!--                      v-model="selectedAnswer"-->
<!--                    />-->
<!--                    {{ answer.answer_text }}-->
<!--                  </label>-->
<!--                </div>-->

              <div class="q-mt-md q-gutter-sm">
                <q-btn color="secondary" @click="nextQuestion">Следующий</q-btn>
                <q-btn color="negative" @click="cancelComponent" class="negative">Отмена</q-btn>
              </div>
            </div>
          </div>


        </div>

      </div>

      <div class="mt_between_elements"/>
        <div v-if="isFinished" class="row">
          <div class="col-12 text-center">
            <p class="text-h4">Поздравляем! Вы прошли весь тест</p>
          </div>
          <div class="mt_between_elements"/>
          <div class="col-12 ">
            <p class="text-h6">Ваши результаты:</p>
            <p class="text-h6">Баллы {{amthauerStore.scoreResult.raw_score}}</p>
            <p class="text-h6">Время прохождение {{amthauerStore.scoreResult.time_taken_seconds}} сек</p>
          </div>
      </div>
    </q-card-section>

  </q-card>
</template>

<style scoped lang="scss">

</style>
