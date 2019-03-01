<template>
  <div class="wrapper">
    <div class="default-card">
      <div class="row justify-content-between">
        <div class="col-auto align-self-center">
          <p class="mb-0 small-text">Question {{ questionNo }} of {{ totalQuestions }}</p>
        </div>
        <div class="col align-self-center">
          <div class="questionsProgress">
            <div class="questionsProgressChild"
              v-bind:style="{ width: questionsBar + '%' }"></div>
          </div>
        </div>
        <div class="col-auto align-self-center">
          <p class="mb-0 small-text">{{ questionTypeAb(question.type) }}</p>
        </div>
      </div>
    </div>
    <Loader v-if="getQuestionsloader" />
    <div class="animateThis" v-if="!getQuestionsloader">
      <div class="default-card">
        <div class="row">
          <div class="col align-self-center">
            <h2 class="mb-0" v-html="newTitle(question.title)">{{ newTitle(question.title) }}</h2>
          </div>
          <div class="col-6" v-if="question.file">
            <img :src="question.file" class="img-fluid rounded" alt="Question related file">
          </div>
        </div>
      </div>
      <div class="default-card py-4">
        <div class="row justify-content-between">
          <div class="col-auto align-self-center">
            <div class="tag-style success-highlight" v-if="answerTextCorrect.length">{{ answerTextCorrect.length }} Well Done</div>
            <div class="tag-style danger-highlight" v-if="answerTextInCorrect.length">{{ answerTextInCorrect.length }} Wrong</div>
            <div class="tag-style success-highlight" v-if="correctAnswer">Well Done</div>
            <div class="row" v-if="correctAnswer != null && !correctAnswer">
              <div class="col-auto align-self-center pr-0">
                <span class="dot red"></span>
              </div>
              <div class="col-auto align-self-center">
                <p class="mb-0 text-muted">Unfortunately, that answer is incorrect.</p>
              </div>
            </div>
            <div class="row" v-if="doNotKnow">
              <div class="col-auto align-self-center pr-0">
                <span class="dot orange"></span>
              </div>
              <div class="col-auto align-self-center">
                <p class="mb-0 text-muted">You have not answered this question.</p>
              </div>
            </div>
            <div class="text-muted" v-if="!completed">Fill in blanks below. The order does not matter</div>
          </div>
          <div class="col-auto align-self-center">
            <button
            class="btn orange"
            v-if="toggleCheckNext && !toggleFinish"
            @click="checkAnswerThenSaveResult(doNotKnow=true)">Don't Know</button>
            <button @click="checkAnswerThenSaveResult()" class="btn blue ml-1"
              id="checkAnswer" v-if="toggleCheckNext && !toggleFinish"
              :disabled="answerNotSelected">Check Answer</button>
            <button @click="showAnswerModal = true"
              class="btn orange ml-1"
              id="next" v-if="!toggleCheckNext || toggleFinish">Show Answers</button>
            <button @click="nextQuestion()"
              class="btn blue ml-1"
              id="next" v-if="!toggleCheckNext && !toggleFinish">Next Question</button>
            <router-link class="btn blue ml-1" :to="{ name: 'assessmentResult', params: { quiz: quiz } }" v-if="toggleFinish">Quiz Result
            </router-link>
          </div>
        </div>
      </div>
      <Modal v-if="showAnswerModal">
        <div slot="body">
          <div class="card-header">
            <div class="mb-4">
              <div class="row">
                <div class="col align-self-center">
                  <h4 v-html="newTitle(question.title)">{{ newTitle(question.title) }}</h4>
                </div>
                <div class="col-6" v-if="question.file">
                  <img :src="question.file" class="img-fluid rounded" alt="Question related file">
                </div>
              </div>
            </div>
            <div class="row list " v-for="(answer, index) in question.answers"
              v-bind:key="index" v-if="answer.correct == null || answer.correct">
              <div class="col-auto">
                <span class="circle">{{ abc[index] }}</span>
              </div>
              <div class="col align-self-center">
                <h5 class="mb-0">
                  <span v-if="question.type == 'fb' || question.type == 'enu'">
                    {{ answer.title.split(',')[0] }}
                  </span>
                  <span v-else>
                    {{ answer.title }}
                  </span>
                </h5>
              </div>
            </div>
          </div>
          <div class="card-body light py-3">
            <div class="row justify-content-end">
              <div class="col-auto align-self-center">
                <a href="javascript:void(0)"
                  class="btn blue"
                  @click="showAnswerModal = false">Got it</a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <div class="default-card" v-bind:class="{ inactive: completed }">
        <div v-if="question.type == 'fb' || question.type == 'enu'">
          <div class="list clickable" v-for="(answer, index) in question.answers"
            v-bind:key="index">
            <div class="row">
              <div class="col-auto align-self-center">
                <span class="circle">{{ abc[index] }}</span>
              </div>
              <div class="col">
                <label class="custom-label">Your Answer</label>
                <input type="text" class="form-control"
                name="answerText[]"
                v-model="answerText[index]"
                @input="validate()"
                :id="answerText[index]" autocomplete="off"
                :disabled="completed" placeholder="Type your answer here">
              </div>
            </div>
          </div>
        </div>
        <div v-if="question.type == 'ma'">
          <div class="list"
            v-for="(answer, index) in question.answers"
            v-bind:key="index"
            @click="selectMultipleAnswer(answer.id, index)">
            <div class="row">
              <div class="col-auto">
                <span class="circle"
                  v-bind:class="{'orange': multipleAnswerCheck(answer.id)}">{{ abc[index] }}</span>
              </div>
              <div class="col align-self-center">
                <h5 class="mb-0">{{ answer.title }}</h5>
              </div>
            </div>
          </div>
        </div>
        <div v-if="question.type == 'mc' || question.type == 'tf'">
          <div class="list"
            v-for="(answer, index) in question.answers"
            v-bind:key="index"
            @click="selectAnswer(answer.id)">
            <div class="row">
              <div class="col-auto">
                <span class="circle"
                  v-bind:class="{
                    'orange': checkedAnswerId == answer.id || selectedAnswerId == answer.id
                    }">{{ abc[index] }}</span>
              </div>
              <div class="col align-self-center">
                <h5 class="mb-0">{{ answer.title }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import Modal from '@/components/Modal.vue'
import { mapGetters } from 'vuex'
import appService from '../app.service.js'

export default {
  components: {
    Loader,
    Modal
  },
  data () {
    return {
      quiz: parseInt(this.$route.params.quiz),
      page: 1,
      questionNo: 1,
      getQuestionsloader: true,
      toggleCheckNext: true,
      toggleFinish: false,
      correctAnswer: null,
      answerNotSelected: true,
      selectedAnswerId: null,
      checkedAnswerId: null,
      selectedAnswersIds: [],
      checkedAnswersIds: [],
      completed: false,
      doNotKnow: false,
      answerText: [],
      answerTextCorrect: [],
      answerTextInCorrect: [],
      totalQuestions: null,
      question: {},
      abc: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      showAnswerModal: false,
    }
  },
  computed: {
    ...mapGetters(['userId']),
    questionsBar () {
      return (this.questionNo/this.totalQuestions) * 100
    }
  },
  methods: {
    newTitle (questionTitle) {
      return questionTitle.replace(/%(\d+)/g, (_, n) => "<span class='blank'>" + this.abc[+n-1] + "</span>")
    },
    questionTypeAb (qt) {
      if (qt == 'mc') return 'Multiple Choice'
      if (qt == 'ma') return 'Multiple Answer'
      if (qt == 'tf') return 'True or False'
      if (qt == 'fb') return 'Fill in Blank'
      if (qt == 'enu') return 'Enumerate'
    },
    multipleAnswerCheck (answerId) {
      return (this.checkedAnswersIds.includes(answerId)) ? true : false
    },
    multipleAnswerSelect (answerId) {
      (this.selectedAnswersIds.length) ?
        this.answerNotSelected = false :
        this.answerNotSelected = true
      if (this.selectedAnswersIds.includes(answerId)) return true
      return false
    },
    validate () {
      if (this.answerText.indexOf("") == -1 && this.answerText.length == this.question.answers.length) {
        this.answerNotSelected = false
      } else {
        this.answerNotSelected = true
      }
    },
    selectAnswer (answerId) {
      this.selectedAnswerId = answerId
      this.answerNotSelected = false
    },
    selectMultipleAnswer (answerId) {
      if (this.selectedAnswersIds.includes(answerId)) {
        let arrIndx = this.selectedAnswersIds.indexOf(answerId);
        this.selectedAnswersIds.splice(arrIndx, 1)
      } else {
        this.selectedAnswersIds.push(answerId)
      }
    },
    checkAnswerThenSaveResult (doNotKnow=false) {
      this.completed = true
      const questionType = this.question.type
      let paramData = {
        quiz: this.quiz,
        question: this.question.id,
        student: this.userId,
      }
      if (doNotKnow) {
        paramData.do_not_know = doNotKnow
        appService.doNotKnowResult(paramData).then(() => this.doNotKnow = true)
      } else if (questionType == 'fb') {
        paramData.answers = this.answerText
        appService.fillBlankResult(paramData).then(data => this.answerTextCorrect = data)
      } else if (questionType == 'enu') {
        paramData.answers = this.answerText
        appService.enumerateResult(paramData).then(data => this.answerTextCorrect = data)
      } else if (questionType == 'ma') {
        paramData.answers = this.selectedAnswersIds
        appService.multipleAnswerResult(paramData).then(() => {
          this.checkedAnswersIds = this.selectedAnswersIds
        }).catch(error => error.data)
      } else {
        paramData.answer = this.selectedAnswerId
        appService.multipleChoiceResult(paramData)
          .then(data => {
            (data.correct) ? this.correctAnswer = true : this.correctAnswer = false
            this.checkedAnswerId = this.selectedAnswerId
          })
      }
      this.toggleCheckNext = false
      if (this.page == this.totalQuestions) this.toggleFinish = true
    },
    getQuestionAndAnswers () {
      appService.getQuestionAndAnswers({
        quiz_id: this.quiz,
        page: this.page,
        student: this.userId
      }).then(data => {
        this.question = data.results[0]
        this.totalQuestions = data.count
        this.getQuestionsloader = false
        this.answerText = []
        this.answerTextCorrect = []
        this.answerTextInCorrect = []
        this.toggleCheckNext = true
        this.doNotKnow = false
        this.checkedAnswerId = null
        this.correctAnswer = null
        if (this.question.question_results.length) {
          this.completed = true
          if (this.question.question_results[0].do_not_know) {
            this.doNotKnow = true
          } else if (this.question.type == 'fb' || this.question.type == 'enu') {
            for (let result of this.question.question_results) {
              this.answerText.push(result.answer_text)
              if (result.correct) {
                this.answerTextCorrect.push(result.correct)
              } else {
                this.answerTextInCorrect.push(result.correct)
              }
            }
          } else if (this.question.type == 'ma') {
            this.checkedAnswersIds = this.question.question_results[0].answer_text.split(",").map(Number)
            this.correctAnswer = this.question.question_results[0].correct
          } else {
            this.checkedAnswerId = this.question.question_results[0].answer
            this.correctAnswer = this.question.question_results[0].correct
          }
          if (this.page == this.totalQuestions) {
            this.toggleFinish = true
          } else {
            this.toggleCheckNext = false
          }
        }
      })
    },
    nextQuestion () {
      this.getQuestionsloader = true
      this.page = this.page + 1
      this.answerNotSelected = true
      this.completed = false
      this.getQuestionAndAnswers()
      this.questionNo = this.questionNo + 1
    }
  },
  created () {
    this.getQuestionAndAnswers()
  }
}
</script>
