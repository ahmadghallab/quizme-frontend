<template>
  <div>
    <div class="topNav">
      <div class="topSubNav">
        <div class="row" v-if="!getResultLoader">
          <GoBack arrowColor="#2c3e50" />
          <div class="col-xs-auto align-self-center">
            <p class="mb-1">{{ results.quiz.course__title }}</p>
            <h5 class="mb-0 font-weight-bold">{{ results.quiz.name }}</h5>
          </div>
        </div>
      </div>
    </div>
    <Loader v-if="getResultLoader" />
    <div class="wrapper" v-if="!getResultLoader">
      <div class="default-card">
        <table class="table">
          <thead>
            <tr>
              <th class="no-border-top pt-0">#</th>
              <th class="no-border-top pt-0">Student Name</th>
              <th class="no-border-top pt-0">Mark <span class="font-weight-normal font-italic">out of</span> {{ results.quiz.total_mark }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in results.result" v-bind:key="index">
              <td>{{ index + 1 }}</td>
              <td>
                {{ result.student__first_name }} {{ result.student__last_name }}
              </td>
              <td class="font-weight-bold">{{ result.mark }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import GoBack from '@/components/GoBack.vue'
import appService from '../app.service.js'

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
  methods: {
    getResults () {
      appService.getResults(this.quiz).then(data => {
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
