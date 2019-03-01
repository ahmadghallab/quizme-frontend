<template>
  <div class="wrapper">
    <Loader v-if="getQuizloader" />
    <div class="default-card" v-if="!getQuizloader">
      <h5 class="mb-1 font-weight-bold">{{ quizTitle }}</h5>
      <span class="small-text">{{ questions.length }} questions</span>
    </div>
    <Loader v-if="getQuestionsloader" />
    <div v-if="!getQuestionsloader" class="animateThis">
      <div class="card-header secondary-color">
        <div class="row justify-content-between">
          <div class="col-auto align-self-center">
            <h5 class="mb-0 font-weight-bold">{{ quizTitle }} Questions</h5>
          </div>
          <div class="col-auto align-self-center">
            <a href="javascript:void(0)" @click="createQuestionModal = true" class="tag-style default-highlight-light">Create</a>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="!questions.length">
          <p class="small-text text-center">No questions have been added yet</p>
        </div>
        <div class="list" v-for="(question, questionIndex) in questions" v-bind:key="questionIndex">
          <div class="row justify-content-between">
            <div class="col-auto">
              <h5 class="mb-2" v-html="newTitle(question.title)">{{ newTitle(question.title) }}</h5>
              <span class="small-text d-inline mr-3"># {{ questionIndex + 1 }}</span>
              <span class="small-text d-inline">{{ questionTypeAb(question.type) }}</span>
            </div>
            <div class="col-auto align-self-center">
              <div class="btn-group dropleft"
                v-bind:class="{show: questionDropDownId == question.id}">
                <a href="javascript:void(0)"
                class="circle"
                @click="showQuestionDropDown(question.id)">
                  <svg viewBox="0 0 512 512" style="fill:#fff;width:15px" xml:space="preserve">
                    <g>
                      <circle cx="256" cy="256" r="64"/>
                      <circle cx="256" cy="448" r="64"/>
                      <circle cx="256" cy="64" r="64"/>
                    </g>
                  </svg>
                </a>
                <div class="dropdown-menu"
                v-bind:class="{show: questionDropDownId == question.id}"
                style="left:auto;right:0;">
                  <a href="javascript:void(0)"
                  @click="getQuestionAnswers(question.id, question.mark, question.type)"
                  class="dropdown-item small-text">Manage</a>
                  <div class="dropdown-divider"></div>
                  <a href="javascript:void(0)"
                    @click="questionDeleteConfirm(question.id)"
                    class="dropdown-item small-text danger-highlight">Remove
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Modal width="500px" v-if="selectedQuestionId == question.id && deleteQuestionModal">
            <div slot="header">
              <div class="card-header red">
                <div class="row justify-content-between">
                  <div class="col-auto align-self-center">
                    <h5 class="mb-0 font-weight-bold">Delete this question?</h5>
                  </div>
                  <div class="col-auto align-self-center">
                    <a href="javascript:void(0)"
                      class="tag-style default-highlight-light"
                      @click="deleteQuestionModal = false">Dismiss</a>
                  </div>
                </div>
              </div>
            </div>
            <div slot="body">
              <div class="card-body">
                <h4 class="font-weight-bold">{{ question.title }}</h4>
                <p class="text-muted">
                  You are about to delete this question. No one will be able to access this question ever again.
                </p>
                <p class="font-weight-bold">Are you absolutely positive? There's no undo.</p>
                <button @click="deleteQuestion(question.id, questionIndex)"
                class="btn red">Yes, delete</button>
              </div>
            </div>
          </Modal>
          <Modal v-if="showAnswersModal && !getAnswersloader && selectedQuestionId == question.id" @close="showAnswersModal = false">
            <div slot="header">
              <div class="card-header secondary-color">
                <div class="row justify-content-between">
                  <div class="col-auto align-self-center">
                    <h5 class="mb-0 font-weight-bold">{{ questionTypeAb(question.type) }} Question</h5>
                  </div>
                  <div class="col-auto align-self-center">
                    <a href="javascript:void(0)"
                    class="tag-style default-highlight-light"
                    @click="showAnswersModal = false" v-if="question.title">
                      Dismiss
                    </a>
                    <a href="javascript:void(0)"
                    @click="deleteQuestion(question.id, questionIndex, 'modal')"
                    class="tag-style default-highlight-light" v-else>
                    Discard</a>
                  </div>
                </div>
              </div>
            </div>
            <div slot="body">
              <div class="card-body">
                <div class="form-row">
                  <div class="form-group col-sm-2">
                    <label for="questionOrderUpdate">Order</label>
                    <input type="text" v-model="question.order" class="form-control" id="questionOrderUpdate" autocomplete="off" placeholder="Order"
                    @input="updateQuestion('order', $event)">
                  </div>
                  <div class="form-group col-sm-2">
                    <label for="questionMarkUpdate">Mark</label>
                    <input type="text" v-model="question.mark" class="form-control" id="questionMarkUpdate" autocomplete="off" placeholder="Mark"
                    @input="updateQuestion('mark', $event)">
                  </div>
                  <div class="form-group col-sm-2">
                    <label for="">File</label>
                    <div class="dropbox">
                      <input type="file" ref="file" :disabled="isSaving" @change="handleFile('upload', question.id, questionIndex)" class="input-file">
                    </div>
                  </div>
                  <div class="form-group col-sm-12">
                    <label for="questionTitleUpdate" class="float-left">Question Title</label>
                    <textarea rows="4" v-model="question.title" class="form-control" id="questionTitleUpdate" placeholder="Title of your question"
                    @input="updateQuestion('title', $event)"></textarea>
                  </div>
                </div>
                <div v-if="answers.length">
                  <div v-for="(answer, answerIndex) in answers" v-bind:key="answerIndex">
                    <div class="form-row">
                      <div class="col-auto align-self-start">
                        <div class="circle font-weight-bold" style="color:#fff;">
                          {{ abc[answerIndex] }}
                        </div>
                      </div>
                      <div class="form-group col">
                        <input type="text"
                        v-model="answer.title"
                        class="form-control"
                        v-bind:class="{'is-invalid':invalidAnswerUpdate == 'title-'+answer.id}"
                        id="answerTitleUpdate"
                        autocomplete="off" placeholder="Answer Title"
                        @input="updateAnswer('title', answer.id, question.id, answerIndex)">
                      </div>
                      <div class="form-group col-auto align-self-center" v-if="question.type == 'mc' || question.type == 'ma'">
                        <a href="javascript:void(0)" class="circle"
                        v-bind:class="{'secondary-color inactive':answer.correct}"
                        v-on:click="updateCorrectAnswer(question.type, answer.id, question.id, answer.correct, answerIndex)">
                          <svg viewBox="0 0 10 8" style="fill:#fff;width:15px" xml:space="preserve">
                            <g>
                              <path d="M9.8,1.6L5,7.6c0,0,0,0.1-0.1,0.1C4.7,7.9,4.6,7.9,4.4,8c0,0-0.1,0-0.1,0  C4.2,8,4.1,8,4.1,8C4,8,3.9,8,3.8,7.9c0,0,0,0,0,0c-0.1,0-0.2-0.1-0.3-0.1c0,0-0.1-0.1-0.1-0.1l-3.1-3c-0.4-0.4-0.4-1,0-1.4  s1-0.4,1.4,0l2.4,2.2l4.1-5.1c0.3-0.4,1-0.5,1.4-0.2C10,0.5,10.1,1.1,9.8,1.6z"></path>
                            </g>
                          </svg>
                        </a>
                      </div>
                      <div class="col-auto form-group align-self-center">
                        <div class="btn-group dropleft"
                        v-bind:class="{show: answerDropDownId == answer.id}">
                          <a href="javascript:void(0)"
                          class=""
                          @click="showAnswerDropDown(answer.id)">
                            <svg viewBox="0 0 512 512" style="fill:#c0cace;width:17px" xml:space="preserve">
                              <g>
                                <circle cx="256" cy="256" r="64"/>
                                <circle cx="256" cy="448" r="64"/>
                                <circle cx="256" cy="64" r="64"/>
                              </g>
                            </svg>
                          </a>
                          <div class="dropdown-menu"
                          v-bind:class="{show: answerDropDownId == answer.id}"
                          style="left:auto;right:0;">
                            <a href="javascript:void(0)"
                              v-on:click="deleteAnswer(answer.id, answerIndex)"
                              class="dropdown-item small-text danger-highlight">Remove
                            </a>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="col-auto align-self-start">
                  <div class="circle font-weight-bold" style="color:#fff;opacity:0.3;">
                    {{ abc[answerAbcIndex] }}
                  </div>
                </div>
                <div class="form-group col">
                  <input type="text"
                  v-model="answerTitle"
                  class="form-control"
                  v-bind:class="{'is-invalid':invalidAnswer}"
                  id="answerTitle"
                  autocomplete="off" placeholder="Type the answer here then press shift+enter to save"
                  v-on:keydown.enter="postAnswer(question.id)">
                </div>
              </div>
              <!-- <div class="row mt-4 justify-content-center">
                <div class="col-sm-6 align-self-center text-center">
                  <div v-if="question.file">
                    <img :src="question.file" class="img-fluid rounded" alt="Question related file">
                    <div>
                      <a href="javascript:void(0)"
                        v-on:click="handleFile('delete', question.id, questionIndex)"
                        class="tag-style danger-highlight">remove this file
                      </a>
                    </div>
                  </div>
                  <div v-else>
                    <div class="dropbox mb-1">
                      <input type="file" ref="file" :disabled="isSaving" @change="handleFile('upload', question.id, questionIndex)" class="input-file">
                    </div>
                    <p class="mb-0 text-muted" v-if="isInitial">
                      Drag you file here or click to browse
                    </p>
                    <p class="mb-0 text-muted" v-if="isSaving">
                      Your file is being uploaded
                    </p>
                    <p class="mb-0 text-muted" v-if="isFailed">
                      Something went wrong! Please try again
                    </p>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </Modal>
      </div>
      </div>
      <Modal v-if="createQuestionModal">
        <div slot="header">
          <div class="card-header secondary-color">
            <div class="row justify-content-between">
              <div class="col-auto align-self-center">
                <h5 class="mb-0 font-weight-bold">Post a new question</h5>
              </div>
              <div class="col-auto align-self-center">
                <a href="javascript:void(0)"
                class="tag-style default-highlight-light"
                @click="createQuestionModal = false">Dismiss</a>
              </div>
            </div>
          </div>
        </div>
        <div slot="body">
          <div class="card-body card-reset">
            <div class="form-row">
              <div class="form-group col-sm-4">
                <label for="questionType">Question Type</label>
                <select class="form-control" v-model="questionType" id="questionType">
                  <option value="">Question Type</option>
                  <option value="mc">Multiple Choice</option>
                  <option value="ma">Multiple Answer</option>
                  <option value="fb">Fill in blank</option>
                  <option value="enu">Enumerate</option>
                </select>
              </div>
            </div>
            <div>
              <button class="btn secondary-color"
              :disabled="newQuestionValidator"
              @click="postQuestion()">Create</button>
            </div>
          </div>
          <div class="card-body gray">
            <div class="row">
              <div class="col-auto align-self-center pr-0">
                <svg style="fill:#b2bbbd;width:24px;" viewBox="0 0 24 24">
                  <g>
                    <path d="M12,24C5.4,24,0,18.6,0,12S5.4,0,12,0s12,5.4,12,12S18.6,24,12,24z M12,2  C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,18c-0.6,0-1-0.4-1-1v-6c0-0.6,0.4-1,1-1s1,0.4,1,1v6  C13,17.6,12.6,18,12,18z M12,8c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S12.6,8,12,8z"></path>
                  </g>
                </svg>
              </div>
              <div class="col">
                <p class="small-text mb-1">keep in mind</p>
                <p class="mb-0 text-muted">Once question has been created the type can't be changed</p>
              </div>
            </div>
          </div>
        </div>
          <!-- <AccentBar styleClass="card-body color5-bg" targetElement="questionTitle" /> -->
        <!-- </div> -->
      </Modal>
    </div>
  </div>
</template>
<script>
import Loader from '@/components/Loader.vue'
import AccentBar from '@/components/AccentBar.vue'
import Modal from '@/components/Modal.vue'

import debounce from 'lodash/debounce';
import appService from '../app.service.js'

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_FAILED = 2

export default {
  components: {
    Loader,
    AccentBar,
    Modal,
  },
  data () {
    return {
      // Question state
      id: this.$route.params.id,
      getQuizloader: true,
      getQuestionsloader: true,
      getAnswersloader: false,
      quizTitle: null,
      defaultMark: null,
      invalidQuestion: false,
      questionTitle: null,
      questionOrder: null,
      questionMark: null,
      questionType: '',
      invalidQuestionId: null,
      invalidQuestionUpdate: null,
      questions: [],
      // Answer state
      selectedQuestionId: null,
      selectedQuestionMark: null,
      selectedQuestionType: null,
      answerTitle: null,
      invalidAnswer: false,
      invalidAnswerUpdate: false,
      answerDeleteId: null,
      answers: [],
      abc: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      questionAccentBar: false,
      showAnswersModal: false,
      createQuestionModal: false,
      deleteQuestionModal: false,
      answerDropDownId: null,
      questionDropDownId: false,
      fileCurrentStatus: null,
    }
  },
  computed: {
    newQuestionValidator () {
      return (this.questionType) ? false : true
    },
    answerAbcIndex () {
      return this.answers.length
    },
    isInitial() {
      return this.fileCurrentStatus === STATUS_INITIAL
    },
    isSaving() {
      return this.fileCurrentStatus === STATUS_SAVING
    },
    isFailed() {
      return this.fileCurrentStatus === STATUS_FAILED
    }
  },
  methods: {
    showQuestionDropDown(questionId) {
      if (this.questionDropDownId == questionId) {
        this.questionDropDownId = null
      } else {
        this.questionDropDownId = questionId
      }
    },
    showAnswerDropDown(answerId) {
      if (this.answerDropDownId == answerId) {
        this.answerDropDownId = null
      } else {
        this.answerDropDownId = answerId
      }
    },
    updateQuestion: debounce(function (fieldName, event) {
      let data = {
        [fieldName]: event.target.value
      }
      if (fieldName == 'mark' && (this.selectedQuestionType == 'enu' || this.selectedQuestionType == 'fb')) {
        let answersCount = (this.answers.length) ? this.answers.length : 1
        data.mark_divided = (data.mark / answersCount).toFixed(1)
      }
      appService.updateQuestion(this.selectedQuestionId, data)
      .then(() => {
        this.invalidQuestionUpdate = null
      })
      .catch(() => {
        this.invalidQuestionUpdate = fieldName
      })
    }, 1000),
    newTitle (questionTitle) {
      if (questionTitle) {
        return questionTitle.replace(/%(\d+)/g, (_, n) => "<span class='blank'>" + this.abc[+n-1] + "</span>")
      }
    },
    updateQuestionMark () {
      if (this.selectedQuestionType == 'enu' || this.selectedQuestionType == 'fb') {
        appService.updateQuestion(this.selectedQuestionId, {
          'mark_divided': (this.selectedQuestionMark / this.answers.length).toFixed(1)
        })
      }
    },
    questionTypeAb (qt) {
      if (qt == 'mc') return 'Multiple Choice'
      if (qt == 'ma') return 'Multiple Answer'
      if (qt == 'fb') return 'Fill in Blank'
      if (qt == 'enu') return 'Enumerate'
    },
    questionDeleteConfirm(questionId) {
      this.selectedQuestionId = questionId
      this.deleteQuestionModal = true
    },
    deleteQuestion(questionId, questionIndex, from=null) {
      appService.deleteQuestion(questionId)
      .then(() => {
        this.questions.splice(questionIndex, 1)
        if (from) this.createQuestionModal = false
      })
    },
    answerDeleteBtn(answerId) {
      if (this.answerDeleteId == answerId) return false
      return true
    },
    answerDeleteConfirm(answerId) {
      this.answerDeleteId = answerId
    },
    getQuestionAnswers(questionId, questionMark, questionType) {
      this.getAnswersloader = true
      this.selectedQuestionId = questionId
      this.selectedQuestionMark = questionMark
      this.selectedQuestionType = questionType
      this.fileCurrentStatus = STATUS_INITIAL
      appService.getQuestionAnswers(questionId).then(data => {
        this.answers = data.results
        this.getAnswersloader = false
        this.showAnswersModal = true
      })
    },
    updateAnswer: debounce(function (fieldName, answerId, questionId, answerIndex) {
      appService.updateAnswer(answerId, {
        question: questionId,
        question_type: null,
        [fieldName]: this.answers[answerIndex][fieldName]
      })
      .then(() => {
        this.invalidAnswerUpdate = ''
      })
      .catch(() => {
        this.invalidAnswerUpdate = `${fieldName}-${answerId}`
      })
    }, 1000),
    updateCorrectAnswer(questionType, answerId, questionId, correct=true, answerIndex=null) {
      if (questionType == 'mc') {
        for (let answer of this.answers) {
          answer.correct = false
          if (answer.id == answerId) answer.correct = true
        }
        appService.updateAnswer(answerId,
          { question_type:questionType, question: questionId, correct: true })
        } else {
          this.answers[answerIndex].correct = !correct
          appService.updateAnswer(answerId,
            { question_type:questionType, correct: !correct })
          }
        },
        postAnswer(questionId) {
          appService.postAnswer({
            question: questionId,
            title: this.answerTitle,
          })
          .then((data) => {
            this.answerTitle = ''
            this.answers.push(data)
            this.invalidAnswer = false
            this.updateQuestionMark()
          })
          .catch(() => {
            this.invalidAnswer = true
          })
        },
        deleteAnswer(answerId, answerIndex) {
          appService.deleteAnswer(answerId)
          .then(() => {
            this.answers.splice(answerIndex, 1)
            this.updateQuestionMark()
          })
        },
        getQuiz () {
          appService.getQuiz(this.id).then(data => {
            this.quizTitle = data.title
            this.defaultMark = data.default_mark
            this.getQuizloader = false
          })
        },
        getQuizQuestions () {
          appService.getQuizQuestions(this.id).then(data => {
            this.questions = data.results
            this.getQuestionsloader = false
          })
        },
        postQuestion() {
          appService.postQuestion({
            quiz: this.id,
            title: null,
            file: null,
            order: this.questions.length + 1,
            mark: this.defaultMark,
            type: this.questionType
          })
          .then((data) => {
            this.questions.push(data)
            this.answers = []
            this.questionType = ''
            this.selectedQuestionId = data.id
            this.createQuestionModal = false
            this.showAnswersModal = true
          })
        },
        handleFile (action, questionId, questionIndex) {
          let formData = new FormData();
          if (action == 'upload') {
            this.fileCurrentStatus = STATUS_SAVING
            formData.append('file', this.$refs.file[0].files[0])
            appService.updateQuestionFile(questionId, formData)
              .then((data) => {
                this.questions[questionIndex].file = data.file
              })
              .catch(() => this.fileCurrentStatus = STATUS_FAILED)
          } else if (action == 'delete') {
            formData.append('file', '')
            appService.updateQuestionFile(questionId, formData)
              .then(() => {
                this.questions[questionIndex].file = null
              })
          }
        }
      },
      created () {
        this.getQuiz()
        this.getQuizQuestions()
      }
    }
    </script>
