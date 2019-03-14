<template>
  <div class="wrapper">
    <Loader v-if="getQuestionsloader" />
    <div class="animateThis" v-if="!getQuestionsloader">
      <div class="card-header" v-bind:class="quizColor">
        <div class="row justify-content-between">
          <div class="col-auto align-self-center">
            <p class="mb-0 text-muted-light">Question {{ questionNo }} of {{ totalQuestions }}</p>
          </div>
          <div class="col align-self-center">
            <div class="questionsProgress">
              <div class="questionsProgressChild"
                v-bind:style="{ width: questionsBar + '%' }"></div>
            </div>
          </div>
          <div class="col-auto align-self-center">
            <p class="mb-0 text-muted-light">{{ questionTypeAb(question.type) }}</p>
          </div>
        </div>
      </div>
      <div class="card-body card-reset">
        <p class="mb-2 text-muted">{{ quizTitle }}</p>
        <h3 class="mb-0" v-html="newTitle(question.title)">{{ newTitle(question.title) }}</h3>
      </div>
      <div class="card-body py-3 card-reset action-card">
        <div class="row justify-content-between">
          <div class="col-auto align-self-center">
            <div class="tag-style success-highlight" v-if="answerTextCorrect.length">{{ answerTextCorrect.length }} Well Done</div>
            <div class="tag-style danger-highlight" v-if="answerTextInCorrect.length">{{ answerTextInCorrect.length }} Wrong</div>
            <div class="row" v-if="correctAnswer">
              <div class="col-auto pr-0 align-self-center">
                <span class="circle green mr-3">
                  <svg viewBox="0 -49 512.00075 512"
                    class="icon"><path d="m190.476562 413.828125c-20.628906 0-40.503906-8.0625-55.347656-22.652344l-129.148437-126.910156c-7.878907-7.742187-7.988281-20.40625-.246094-28.28125 7.742187-7.878906 20.40625-7.992187 28.285156-.25l129.144531 126.910156c8.105469 7.964844 19.246094 11.992188 30.570313 11.050781 11.324219-.945312 21.648437-6.757812 28.324219-15.953124l253.757812-349.492188c6.488282-8.9375 18.996094-10.921875 27.933594-4.433594 8.9375 6.492188 10.921875 19 4.433594 27.9375l-253.757813 349.488282c-13.523437 18.625-34.433593 30.402343-57.371093 32.3125-2.195313.183593-4.394532.273437-6.578126.273437zm0 0"/>
                  </svg>
                </span>
              </div>
              <div class="col-auto pl-0 align-self-center">
                <span class="text-muted">Well Done. That's the right answer</span>
              </div>
            </div>
            <div class="row" v-if="correctAnswer != null && !correctAnswer">
              <div class="col-auto pr-0 align-self-center">
                <span class="circle red mr-3">
                  <svg class="icon" viewBox="0 0 64 64">
                    <g>
                      <path d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"/>
                    </g>
                  </svg>
                </span>
              </div>
              <div class="col-auto pl-0 align-self-center">
                <span class="text-muted">Unfortunately. That answer is incorrect</span>
              </div>
            </div>
            <div class="row" v-if="doNotKnow">
              <div class="col-auto align-self-center pr-0">
                <span class="circle orange mr-3">
                  <svg class="icon" viewBox="0 0 42.666 42.666" xml:space="preserve">
                  	<g>
                  		<path d="M16.899,38.233c0,2.448,1.984,4.433,4.434,4.433s4.434-1.984,4.434-4.433c0-2.451-1.984-4.435-4.434-4.435
                  			S16.899,35.782,16.899,38.233z"/>
                  		<path d="M23.635,25V2c0-1.104-0.896-2-2-2s-2,0.896-2,2v23c0,1.104,0.896,2,2,2S23.635,26.104,23.635,25z"/>
                  	</g>
                  </svg>
                </span>
              </div>
              <div class="col-auto align-self-center pl-0">
                <span class="text-muted">You have not answered this question.</span>
              </div>
            </div>
            <div class="text-muted" v-if="!completed">Fill in blanks below. The order does not matter</div>
          </div>
          <div class="col-auto align-self-center">
            <button
            class="btn light-outline"
            v-if="toggleCheckNext && !toggleFinish"
            @click="checkAnswerThenSaveResult(doNotKnow=true)">Don't Know</button>
            <button @click="checkAnswerThenSaveResult()" class="btn ml-2"
              v-bind:class="quizColor"
              id="checkAnswer" v-if="toggleCheckNext && !toggleFinish"
              :disabled="answerNotSelected">Check Answer</button>
            <button @click="showAnswerModal = true"
              class="btn light-outline ml-2"
              id="next" v-if="!toggleCheckNext || toggleFinish">Show Answers</button>
            <button @click="nextQuestion()"
              class="btn ml-2" v-bind:class="quizColor"
              id="next" v-if="!toggleCheckNext && !toggleFinish">Next Question
            </button>
            <router-link class="btn ml-2" v-bind:class="quizColor" :to="{ name: 'assessmentResult', params: { quiz: quiz } }" v-if="toggleFinish">Quiz Result
            </router-link>
          </div>
        </div>
      </div>
      <Modal v-if="showAnswerModal">
        <div slot="body">
          <div class="card-header" v-bind:class="quizColor">
            <h4 class="mb-0" v-html="newTitle(question.title)">{{ newTitle(question.title) }}</h4>
          </div>
          <div class="card-body card-reset py-0 px-0">
            <div v-for="(answer, index) in question.answers"
              v-bind:key="index">
              <h5 class="mb-0 list answer-list text-muted" v-if="answer.correct == null || answer.correct">
                <span v-if="question.type == 'fb' || question.type == 'enu'">
                  {{ answer.title.split(',')[0] }}
                </span>
                <span v-else>
                  {{ answer.title }}
                </span>
              </h5>
            </div>
          </div>
          <div class="card-body text-right">
            <button type="button"
              class="btn" v-bind:class="quizColor"
              @click="showAnswerModal = false">Got it</button>
          </div>
        </div>
      </Modal>
      <div v-bind:class="{ inactive: completed }">
        <div v-if="question.type == 'fb' || question.type == 'enu'">
          <div class="list answer-list list-lc" v-for="(answer, index) in question.answers"
            v-bind:key="index">
            <div class="row">
              <div class="col-auto align-self-center">
                <span class="circle light">{{ abc[index] }}</span>
              </div>
              <div class="col">
                <!-- <label class="custom-label">Your Answer</label> -->
                <input type="text" class="form-control"
                name="answerText[]"
                v-model="answerText[index]"
                @input="validate()" autocomplete="off"
                :disabled="completed" placeholder="your answer">
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
                <span class="circle light-outline"
                  v-bind:class="{'orange': multipleAnswerCheck(answer.id)}">{{ abc[index] }}</span>
              </div>
              <div class="col align-self-center">
                <h5 class="mb-0">{{ answer.title }}</h5>
              </div>
            </div>
          </div>
        </div>
        <div v-if="question.type == 'mc' || question.type == 'tf'">
          <div class="list answer-list text-muted"
            v-for="(answer, index) in question.answers"
            v-bind:key="index"
            v-bind:class="{'selectedAnswer': checkedAnswerId == answer.id || selectedAnswerId == answer.id
            }"
            @click="selectAnswer(answer.id)">
            <div class="row">
              <!-- <div class="col-auto">
                <span class="circle light"
                  v-bind:class="{
                    'purple': checkedAnswerId == answer.id || selectedAnswerId == answer.id
                    }">{{ abc[index] }}</span>
              </div> -->
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
      quizTitle: null,
      quizColor: null,
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
      return questionTitle.replace(/%(\d+)/g, (_, n) => "<span class='circle light'>" + this.abc[+n-1] + "</span>")
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
    getQuiz() {
      appService.getQuiz(this.quiz).then(data => {
        this.quizTitle = data.title
        this.quizColor = data.color
      })
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
        if (this.question.results.length) {
          this.completed = true
          if (this.question.results[0].do_not_know) {
            this.doNotKnow = true
          } else if (this.question.type == 'fb' || this.question.type == 'enu') {
            for (let result of this.question.results) {
              this.answerText.push(result.answer_text)
              if (result.correct) {
                this.answerTextCorrect.push(result.correct)
              } else {
                this.answerTextInCorrect.push(result.correct)
              }
            }
          } else if (this.question.type == 'ma') {
            this.checkedAnswersIds = this.question.results[0].answer_text.split(",").map(Number)
            this.correctAnswer = this.question.results[0].correct
          } else {
            this.checkedAnswerId = this.question.results[0].answer
            this.correctAnswer = this.question.results[0].correct
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
    this.getQuiz()
    this.getQuestionAndAnswers()
  }
}
</script>
