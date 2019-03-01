<template>
  <div>
    <Loader v-if="getQuizzesLoader" />
    <div class="wrapper" v-if="!getQuizzesLoader">
      <div class="text-center" v-if="!quizzes.length">
        <p class="font-weight-bold">No quizzes are available now.</p>
      </div>
      <div v-for="quiz in quizzes" v-bind:key="quiz.pk">
        <div class="row">
          <div class="col-auto small-text align-self-center pr-0">{{ status(quiz.total_questions, quiz.total_questions_answered) }}</div>
          <div class="col align-self-center"><div class="hrline"></div></div>
        </div>
        <div class="default-card">
          <p class="mb-0 text-muted">{{ quiz.course__title }}</p>
          <h5 class="my-1 font-weight-bold">{{ quiz.name }}</h5>
          <p class="mb-4 small-text">{{ quiz.total_questions }} questions</p>
          <router-link :to="{ name: 'assessment', params: { quiz: quiz.pk } }" class="btn color5-bg">
            Run
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import appService from '../app.service.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Loader
  },
  data() {
    return {
      getQuizzesLoader: true,
      quizzes: []
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'userId']),
  },
  methods: {
    status (totalQuestions, totalQuestionsAnswered) {
      const totalDiff = totalQuestions - totalQuestionsAnswered
      if (totalDiff == 0) return 'Completed'
      if (totalDiff == totalQuestions) return 'New'
      if (totalDiff > 0) return 'In progress'
    },
    getTodayQuizzes () {
      appService.getTodayQuizzes(this.userId).then(data => {
        this.quizzes = data
        this.getQuizzesLoader = false
      })
      .catch()
    }
  },
  created() {
    this.getTodayQuizzes()
  }
}
</script>
