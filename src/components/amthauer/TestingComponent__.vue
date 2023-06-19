<script setup lang="ts">
import {AmthauerStrings} from 'src/components/amthauer/constants/AmthauerStrings';
import {useAmthauerStore} from 'stores/amthauer-store';
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import {RoutePaths} from 'src/constants/routes';

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

const nextQuestion = () => {
  console.log(selectedAnswer.value)
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

const isFinished = computed(() => {
  if (currentComponentIndex.value === amthauerStore.getComponentLength) {
    console.log('""""""""""""""""""""""""')
    console.log(currentComponentIndex.value)
    console.log(components.length)
    console.log('""""""""""""""""""""""""')
    return true
  }
  return false
});

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
              <h4>{{ component.component_title }}</h4>

              <div>
                <div v-html="component.component_description"></div>
              </div>

              <h5>{{ question.question_text }}</h5>

              <ul>
                <li v-for="answer in question.answers" :key="answer.id">
                  <label>
                    <input
                      type="radio"
                      :name="`question_${question.id}`"
                      :value="answer.id"
                      v-model="selectedAnswer"
                    />
                    {{ answer.answer_text }}
                  </label>
                </li>
              </ul>
              <div class="q-pa-md q-gutter-sm">
                <q-btn color="secondary" @click="nextQuestion">Next</q-btn>
                <q-btn color="negative" @click="cancelComponent" class="negative">Cancel</q-btn>
              </div>
            </div>
          </div>
          <div v-if="isFinished">
            <h3>Congratulations! You have completed the questions.</h3>
          </div>
        </div>

      </div>
      <div class="mt_between_elements"/>

    </q-card-section>

  </q-card>
</template>

<style scoped lang="scss">

</style>
