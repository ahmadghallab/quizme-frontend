<template>
  <div class="wrapper">
    <Loader v-if="getResultLoader" />
    <div v-if="!getResultLoader">
      <div class="default-card animateThis">
        <p class="mb-1 text-muted">{{ results.quiz.course__title }}</p>
        <h5 class="mb-0 font-weight-bold">{{ results.quiz.name }}</h5>
      </div>
      <!-- <div class="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle fill="#FDCA47" cx="32" cy="32" r="30"></circle><path fill="#F9B700" d="M51.654 9.346A29.867 29.867 0 0 1 59 29c0 16.568-13.432 30-30 30a29.869 29.869 0 0 1-19.654-7.346C14.846 57.989 22.952 62 32 62c16.569 0 30-13.432 30-30 0-9.048-4.012-17.153-10.346-22.654z"></path><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFE8BB" d="M6.418 20.5C5.302 24.241 13 11 25 6.084c5.833-2.391-13.832-1.5-18.582 14.416z"></path><circle fill="#F18D84" cx="51.811" cy="36" r="6"></circle><circle fill="#F18D84" cx="12.189" cy="36" r="6"></circle><path fill="#302C3B" d="M44.584 41.279c-8.109 5.656-17.106 5.623-25.168 0-.971-.677-1.846.495-1.188 1.578 2.457 4.047 7.418 7.65 13.771 7.65 6.354 0 11.315-3.604 13.772-7.65.659-1.083-.216-2.254-1.187-1.578zM28.525 26.854c-1.859-5.111-4.66-7.669-7.46-7.669s-5.602 2.558-7.46 7.669c-.184.515.774 1.443 1.254.938 1.802-1.901 3.957-2.658 6.206-2.658 2.25 0 4.405.757 6.207 2.658.478.506 1.436-.423 1.253-.938zm21.87 0c-1.859-5.111-4.66-7.669-7.461-7.669s-5.602 2.558-7.461 7.669c-.184.515.775 1.443 1.254.938 1.803-1.901 3.957-2.658 6.207-2.658s4.404.757 6.207 2.658c.478.506 1.437-.423 1.254-.938z"></path></svg>
      </div> -->
      <!-- <h3 class="my-4 text-center font-weight-bold">Nice work! you got this</h3> -->
      <div class="row justify-content-md-center">
        <div class="col-3">
          <div class="default-card text-center">
            <h3 class="font-weight-bold success-highlight">{{ results.result.correct_answers }}</h3>
            <h4 class="font-weight-bold success-highlight result-percent">{{ correctPercent }}%</h4>
            <span class="small-text">correct</span>
          </div>
        </div>
        <div class="col-3">
          <div class="default-card text-center">
            <h3 class="font-weight-bold danger-highlight">{{ results.result.incorrect_answers }}</h3>
            <h4 class="font-weight-bold danger-highlight result-percent">{{ inCorrectPercent }}%</h4>
            <span class="small-text">incorrect</span>
          </div>
        </div>
        <div class="col-3">
          <div class="default-card text-center">
            <h3 class="font-weight-bold danger-highlight">{{ results.result.do_not_know }}</h3>
            <h4 class="font-weight-bold danger-highlight result-percent">{{ doNotKnow }}%</h4>
            <span class="small-text">don't know</span>
          </div>
        </div>
        <div class="col-3">
          <div class="default-card text-center">
            <h3 class="font-weight-bold success-highlight">{{ finalResult }}/{{ results.quiz.total_mark }}</h3>
            <h4 class="font-weight-bold success-highlight result-percent">{{ finalResultPercent }}%</h4>
            <span class="small-text">final result</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import GoBack from '@/components/GoBack.vue'
import appService from '../app.service.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    GoBack,
    Loader
  },
  data () {
    return {
      quiz: this.$route.params.quiz,
      getResultLoader: true,
      results: []
    }
  },
  computed: {
    ...mapGetters(['userId']),
    totalResultCount: function () {
      return this.results.result.correct_answers + this.results.result.incorrect_answers + this.results.result.do_not_know
    },
    correctPercent: function () {
      return (this.results.result.correct_answers/this.totalResultCount*100).toFixed(0)
    },
    inCorrectPercent: function () {
      return (this.results.result.incorrect_answers/this.totalResultCount*100).toFixed(0)
    },
    doNotKnow: function () {
      return (this.results.result.do_not_know/this.totalResultCount*100).toFixed(0)
    },
    finalResult: function () {
      return this.results.result.student_mark.toFixed(1)
    },
    finalResultPercent: function () {
      return (this.results.result.student_mark/this.results.quiz.total_mark*100).toFixed(0)
    }
  },
  methods: {
    getResults () {
      appService.getAssessmentResults({'quiz':this.quiz, 'student': this.userId}).then(data => {
        this.results = data
        this.getResultLoader = false
      })
    }
  },
  created () {
    this.getResults()
  }
}
</script>
