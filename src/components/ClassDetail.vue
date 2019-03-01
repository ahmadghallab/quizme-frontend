<template>
  <div class="wrapper">
    <Loader v-if="getClassLoader" />
    <div class="default-card animateThis" v-if="!getClassLoader">
      <h4 class="mb-0 font-weight-bold">{{ classTitle }}</h4>
      <p class="mt-3 text-muted">{{ classDescription ? classDescription : 'No description' }}</p>
      <div class="mt-4" v-if="userId != id">
        <a href="javascript:void(0)" class="btn primary-color">Join</a>
      </div>
    </div>
    <Modal width="600px" v-if="createQuizModal">
      <div slot="header">
        <div class="card-header primary-color">
          <div class="row justify-content-between">
            <div class="col-auto align-self-center">
              <h5 class="mb-0 font-weight-bold">Create a new quiz</h5>
            </div>
            <div class="col-auto align-self-center">
              <a href="javascript:void(0)"
                class="tag-style default-highlight-light"
                @click="createQuizModal = false">Dismiss</a>
            </div>
          </div>
        </div>
      </div>
      <div slot="body">
        <div class="card-body">
          <form v-on:submit.prevent="postQuiz()">
            <div class="form-row align-items-center">
              <div class="form-group col-sm-6">
                <label for="quizName">Quiz Name</label>
                <input type="text"
                  v-model="quizName"
                  class="form-control" id="quizName"
                  autocomplete="off">
              </div>
              <div class="form-group col-sm-6">
                <label for="dueDate">Due Date</label>
                <input type="date" class="form-control" v-model="dueDate" id="dueDate">
              </div>
              <div class="form-group col-sm-6">
                <label for="questionOrder">Questions Order</label>
                <select class="form-control" v-model="questionOrder" id="questionOrder">
                  <option value=""></option>
                  <option value="order">Question Order</option>
                  <option value="type">Question Type</option>
                  <option value="?">Random</option>
                </select>
              </div>
              <div class="form-group col-sm-6">
                <label for="defaultMark">Default Mark</label>
                <input type="number" class="form-control" v-model="defaultMark" id="defaultMark">
              </div>
              <div class="form-group col-12">
                <button class="btn primary-color" :disabled="newQuizValidator">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
    <Modal width="600px" v-if="editClassModal">
      <div slot="header">
        <div class="card-header primary-color">
          <div class="row justify-content-between">
            <div class="col-auto align-self-center">
              <h5 class="mb-0 font-weight-bold">Edit Class</h5>
            </div>
            <div class="col-auto align-self-center">
              <a href="javascript:void(0)"
                class="tag-style default-highlight-light"
                @click="editClassModal = false">Dismiss</a>
            </div>
          </div>
        </div>
      </div>
      <div slot="body">
        <div class="card-body">
          <form v-on:submit.prevent="updateClass()">
            <div class="form-group">
              <label for="classTitleUpdate">Class Title</label>
              <input type="text"
                v-model="classTitle"
                class="form-control"
                id="classTitleUpdate"
                autocomplete="off" placeholder="Class Title">
            </div>
            <div class="form-group">
              <label for="classTitle">Description</label>
              <textarea rows="2" class="form-control"
              v-model="classDescription" placeholder="Type class description here"></textarea>
            </div>
            <div class="form-group">
              <button class="btn primary-color" :disabled="editClassValidator">Save</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
    <Loader v-if="getQuizzesLoader" />
    <div v-if="!getQuizzesLoader" class="animateThis">
      <div class="card-header primary-color">
        <div class="row justify-content-between">
          <div class="col-auto align-self-center">
            <h5 class="mb-0 font-weight-bold">{{ classTitle }} Quizzes</h5>
          </div>
          <div class="col-auto align-self-center">
            <a href="javascript:void(0)" @click="createQuizModal = true" class="tag-style default-highlight-light">New</a>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="!quizzes.length">
          <p class="small-text text-center">No quizzes have been added yet</p>
        </div>
        <div class="list" v-for="(quiz, index) in quizzes" v-bind:key="index">
          <Modal width="600px" v-if="selectedQuiz == quiz.id && editQuizModal">
            <div slot="header">
              <div class="card-header primary-color">
                <div class="row justify-content-between">
                  <div class="col-auto align-self-center">
                    <h5 class="mb-0 font-weight-bold">Edit Quiz</h5>
                  </div>
                  <div class="col-auto align-self-center">
                    <a href="javascript:void(0)"
                      class="tag-style default-highlight-light"
                      @click="editQuizModal = false">Dismiss</a>
                  </div>
                </div>
              </div>
            </div>
            <div slot="body">
              <div class="card-body">
                <form v-on:submit.prevent="updateQuiz(index)">
                  <div class="form-row align-items-center">
                    <div class="form-group col-sm-6">
                      <label for="selectedQuizName">Quiz Name</label>
                      <input type="text"
                        v-model="selectedQuizName"
                        class="form-control" id="selectedQuizName"
                        autocomplete="off" placeholder="Quiz Name">
                    </div>
                    <div class="form-group col-sm-6">
                      <label for="selectedQuizDueDate">Due Date</label>
                      <input type="date" class="form-control" v-model="selectedQuizDueDate" id="selectedQuizDueDate">
                    </div>
                    <div class="form-group col-sm-6">
                      <label for="selectedQuizQuestionOrder">Questions Order</label>
                      <select class="form-control"
                        id="selectedQuizQuestionOrder">
                        <option :value="selectedQuizQuestionOrder">{{ getQuestionOrder(selectedQuizQuestionOrder) }}</option>
                        <option value="order" v-if="selectedQuizQuestionOrder != 'order'">Question Order</option>
                        <option value="type" v-if="selectedQuizQuestionOrder != 'type'">Question Type</option>
                        <option value="?" v-if="selectedQuizQuestionOrder != 'rand'">Random</option>
                      </select>
                    </div>
                    <div class="form-group col-sm-6">
                      <label for="selectedQuizDefaultMark">Default Mark</label>
                      <input type="number" class="form-control" v-model="selectedQuizDefaultMark" id="selectedQuizDefaultMark" placeholder="Default Mark">
                    </div>
                    <div class="form-group col-12">
                      <button class="btn primary-color" :disabled="editQuizValidator">Save</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
          <div class="row justify-content-between">
            <div class="col-auto align-self-center">
              <h6 class="mb-2 font-weight-bold">
                <router-link :to="{name: 'QuizDetail', params: { id: quiz.id }}">{{ quiz.title }}</router-link>
              </h6>
              <span class="small-text">{{ quiz.total_questions }} questions</span>
              <span class="small-text ml-3">Due Date {{ quiz.due_date }}</span>
            </div>
            <div class="col-auto align-self-center">
              <div class="btn-group dropleft"
                v-bind:class="{show: quizDropDownId == quiz.id}">
                <a href="javascript:void(0)"
                class="circle"
                @click="showQuizDropDown(quiz.id)">
                  <svg viewBox="0 0 512 512" style="fill:#fff;width:15px" xml:space="preserve">
                    <g>
                      <circle cx="256" cy="256" r="64"/>
                      <circle cx="256" cy="448" r="64"/>
                      <circle cx="256" cy="64" r="64"/>
                    </g>
                  </svg>
                </a>
                <div class="dropdown-menu"
                  v-bind:class="{show: quizDropDownId == quiz.id}"
                  style="left:auto;right:0;">
                  <router-link :to="{ name: 'result', params: { quiz: quiz.id } }" class="dropdown-item small-text">Result</router-link>
                  <a href="javascript:void(0)" class="dropdown-item small-text" @click="editQuiz(quiz.id, quiz.title, quiz.question_order, quiz.due_date, quiz.default_mark)">Edit</a>
                  <div class="dropdown-divider"></div>
                  <a href="javascript:void(0)" class="dropdown-item small-text danger-highlight"
                    v-on:click="quizDeleteConfirm(quiz.id, quiz.title)">Remove
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Modal width="500px" v-if="selectedQuiz == quiz.id && deleteQuizModal">
            <div slot="header">
              <div class="card-header orange">
                <div class="row justify-content-between">
                  <div class="col-auto align-self-center">
                    <h5 class="mb-0 font-weight-bold">Delete this quiz?</h5>
                  </div>
                  <div class="col-auto align-self-center">
                    <a href="javascript:void(0)"
                      class="default-highlight-light"
                      @click="deleteQuizModal = false">
                      <svg style="width:12px;fill:#fff;" viewBox="0 0 12 12">
                        <g>
                          <path d="M8.2,6l3.3-3.3c0.6-0.6,0.6-1.6,0-2.2s-1.6-0.6-2.2,0L6,3.8L2.7,0.5c-0.6-0.6-1.6-0.6-2.2,0s-0.6,1.6,0,2.2L3.8,6L0.5,9.3   c-0.6,0.6-0.6,1.6,0,2.2c0.6,0.6,1.6,0.6,2.2,0L6,8.2l3.3,3.3c0.6,0.6,1.6,0.6,2.2,0c0.6-0.6,0.6-1.6,0-2.2L8.2,6z"></path>
                        </g>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div slot="body">
              <div class="card-body">
                <h4 class="font-weight-bold">{{ selectedQuizName }}</h4>
                <p class="text-muted">
                  You are about to delete this quiz. No one will be able to access this quiz ever again.
                </p>
                <p class="font-weight-bold">Are you absolutely positive? There's no undo.</p>
                <button @click="deleteQuiz(quiz.id, index)"
                  class="btn red mr-1">Yes, delete</button>
                <button @click="deleteQuizModal = false"
                  class="btn secondary-color">Cancel</button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import Modal from '@/components/Modal.vue'
import appService from '../app.service.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Loader,
    Modal
  },
  data () {
    return {
      id: this.$route.params.id,
      getClassLoader: true,
      getQuizzesLoader: true,
      dueDate: null,
      questionOrder: '',
      defaultMark: null,
      quizName: null,
      classTitle: null,
      classDescription: null,
      quizzes: [],
      selectedQuiz: null,
      selectedQuizName: null,
      selectedQuizDueDate: null,
      selectedQuizQuestionOrder: null,
      selectedQuizDefaultMark: null,
      createQuizModal: false,
      editClassModal: false,
      editQuizModal: false,
      deleteQuizModal: false,
      quizDropDownId: null
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    newQuizValidator () {
      return (this.quizName && this.dueDate && this.questionOrder && this.defaultMark) ? false : true
    },
    editQuizValidator () {
      return (this.selectedQuizName && this.selectedQuizDueDate && this.selectedQuizQuestionOrder && this.selectedQuizDefaultMark) ? false : true
    }
  },
  methods: {
    showQuizDropDown(quizId) {
      if (this.quizDropDownId == quizId) {
        this.quizDropDownId = null
      } else {
        this.quizDropDownId = quizId
      }
    },
    getQuestionOrder (order) {
      if (order == 'order') return 'Question Order'
      if (order == 'type') return 'Question Type'
      if (order == 'rand') return 'Random'
    },
    editQuiz(quizId, quizName, quizQuestionOrder, quizDueDate, quizDefaultMark) {
      this.selectedQuiz = quizId
      this.selectedQuizName = quizName
      this.selectedQuizQuestionOrder = quizQuestionOrder
      this.selectedQuizDueDate = quizDueDate
      this.selectedQuizDefaultMark = quizDefaultMark
      this.editQuizModal = true
    },
    updateQuiz(quizIndex) {
      appService.updateQuiz({
        id: this.selectedQuiz,
        title: this.selectedQuizName,
        question_order: this.selectedQuizQuestionOrder,
        default_mark: this.selectedQuizDefaultMark,
        due_date: this.selectedQuizDueDate
      })
        .then(() => {
          this.quizzes[quizIndex].title = this.selectedQuizName,
          this.quizzes[quizIndex].question_order = this.selectedQuizQuestionOrder,
          this.quizzes[quizIndex].default_mark = this.selectedQuizDefaultMark,
          this.quizzes[quizIndex].due_date = this.selectedQuizDueDate
          this.editQuizModal = false
        })
    },
    quizDeleteConfirm(quizId, quizName) {
      this.selectedQuiz = quizId
      this.selectedQuizName = quizName
      this.deleteQuizModal = true
    },
    getClassQuizzes () {
      appService.getClassQuizzes(this.id).then(data => {
        this.quizzes = data.results
        this.getQuizzesLoader = false
      })
    },
    postQuiz() {
      appService.postQuiz({
        title: this.quizName,
        class_group: this.id,
        due_date: this.dueDate,
        default_mark: this.defaultMark,
        question_order: this.questionOrder
      })
        .then((data) => {
          this.quizName = null
          this.dueDate = null
          this.quizzes.push(data)
          this.createQuizModal = false
        })
    },
    deleteQuiz(quizId, index) {
      appService.deleteQuiz(quizId)
      .then(() => {
        this.quizzes.splice(index, 1)
      })
    },
    getClass () {
      appService.getClass(this.id).then(data => {
        this.classTitle = data.title
        this.classDescription = data.description
        this.getClassLoader = false
      })
    },
  },
  created () {
    this.getClass()
    this.getClassQuizzes()
  }
}
</script>
