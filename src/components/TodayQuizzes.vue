<template>
  <div>
    <div class="row">
      <div class="col-auto small-text align-self-center pr-0">Today Quizzes</div>
      <div class="col align-self-center"><div class="hrline"></div></div>
    </div>
    <Loader v-if="getQuizzesLoader" />
    <div v-if="!getQuizzesLoader">
      <p class="mt-3 text-center small-text" v-if="!quizzes.length">No quizzes are available now.
      </p>
      <div v-for="quiz in quizzes" v-bind:key="quiz.pk">
        <div class="default-card">
          <p class="mb-0 text-muted">{{ quiz.course__title }}</p>
          <h5 class="my-1 font-weight-bold">{{ quiz.name }}</h5>
          <p class="small-text">{{ quiz.total_questions }} questions</p>
          <div class="mt-4">
            <router-link :to="{ name: 'assessment', params: { quiz: quiz.pk } }" class="btn color5-bg">{{ quizStatus(quiz.total_questions, quiz.total_questions_answered) }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import appService from '../app.service.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Loader
  },
  data() {
    return {
      getQuizzesLoader: true,
      quizzes: [],
    }
  },
  computed: {
    ...mapGetters(['userId']),
  },
  methods: {
    quizStatus (totalQuestions, totalQuestionsAnswered) {
      const totalDiff = totalQuestions - totalQuestionsAnswered
      if (totalDiff == 0) return 'Review'
      if (totalDiff == totalQuestions) return 'Start'
      if (totalDiff > 0) return 'Continue'
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
