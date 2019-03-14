<template>
  <div>
    <Loader v-if="getQuizzesLoader" />
    <div v-if="!getQuizzesLoader" class="wrapper animateThis">
      <div class="secondary-card">
        <div class="row justify-content-between" v-if="!getClassLoader">
          <div class="col align-self-center">
            <h2 class="mb-2 font-weight-bold">{{ classTitle }}</h2>
            <p class="mb-4 text-muted">{{ classDescription ? classDescription : 'No description' }}</p>
            <button type="button"
              class="btn black" v-bind:class="classColor">Join</button>
              <button type="button" class="btn transparent ml-1" @click="createQuizModal = true">
                Add Quiz</button>
          </div>
        </div>
      </div>
      <div class="row">
        <p v-if="!quizzes.length" class="text-muted mb-0 text-center">No Quizzes have been added yet</p>
        <div class="col-md-4" v-for="(quiz, index) in quizzes" v-bind:key="index">
          <router-link :to="{name: 'QuizDetail', params: { id: quiz.id }}">
            <div class="card-header text-center" v-bind:class="quiz.color">
              <h5 class="mt-2 mb-1 font-weight-bold">{{ quiz.title }}</h5>
              <p class="mb-2 text-muted-light">{{ quiz.total_questions }} questions</p>
            </div>
          </router-link>
          <div class="card-body">
            <div class="row justify-content-between">
              <div class="col">
                <p class="text-muted mb-0">Due Date {{ quiz.due_date }}</p>
              </div>
              <div class="col-auto align-self-center">
                <div class="btn-group dropleft"
                  v-bind:class="{show: quizDropDownId == quiz.id}">
                  <a href="javascript:void(0)"
                  @click="showQuizDropDown(quiz.id)">
                    <svg viewBox="0 0 512 512" style="fill:#ccc;width:15px" xml:space="preserve">
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
                    <a href="javascript:void(0)" class="dropdown-item small-text" @click="editQuiz(quiz.id)">Edit</a>
                    <div class="dropdown-divider"></div>
                    <a href="javascript:void(0)" class="dropdown-item small-text danger-highlight"
                      v-on:click="quizDeleteConfirm(quiz.id)">Remove
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal v-if="selectedQuiz == quiz.id && editQuizModal">
            <div slot="header">
              <div class="card-header" v-bind:class="quiz.color">
                <div class="row justify-content-between">
                  <div class="col-auto align-self-center">
                    <h5 class="mb-0 font-weight-bold">Edit Quiz</h5>
                  </div>
                  <div class="col-auto align-self-center">
                    <a href="javascript:void(0)"
                      class="light-highlight"
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
                        v-model="quiz.title"
                        class="form-control" id="selectedQuizName"
                        autocomplete="off" placeholder="Quiz Name">
                    </div>
                    <div class="form-group col-sm-6">
                      <label for="selectedQuizDueDate">Due Date</label>
                      <input type="date" class="form-control" v-model="quiz.due_date" id="selectedQuizDueDate">
                    </div>
                    <div class="form-group col-sm-6">
                      <label for="selectedQuizQuestionOrder">Questions Order</label>
                      <select class="form-control"
                        id="selectedQuizQuestionOrder">
                        <option :value="quiz.question_order">{{ getQuestionOrder(quiz.question_order) }}</option>
                        <option value="order" v-if="quiz.question_order != 'order'">Question Order</option>
                        <option value="type" v-if="quiz.question_order != 'type'">Question Type</option>
                        <option value="?" v-if="quiz.question_order != 'rand'">Random</option>
                      </select>
                    </div>
                    <div class="form-group col-sm-6">
                      <label for="selectedQuizDefaultMark">Default Mark</label>
                      <input type="number" class="form-control" v-model="quiz.default_mark" id="selectedQuizDefaultMark" placeholder="Default Mark">
                    </div>
                    <div class="form-group">
                      <input type="hidden" v-model="quiz.color">
                      <a href="javascript:void(0)" class="circle blue colorPanelBorder"
                        v-bind:class="{'selectedColor': quiz.color == 'blue'}"
                        @click="updateColor('blue', index)"></a>
                      <a href="javascript:void(0)" class="circle green colorPanelBorder"
                        v-bind:class="{'selectedColor': quiz.color == 'green'}"
                        @click="updateColor('green', index)"></a>
                      <a href="javascript:void(0)" class="circle orange colorPanelBorder"
                        v-bind:class="{'selectedColor': quiz.color == 'orange'}"
                        @click="updateColor('orange', index)"></a>
                      <a href="javascript:void(0)" class="circle purple colorPanelBorder"
                        v-bind:class="{'selectedColor': quiz.color == 'purple'}"
                        @click="updateColor('purple', index)"></a>
                      <a href="javascript:void(0)" class="circle red colorPanelBorder"
                        v-bind:class="{'selectedColor': quiz.color == 'red'}"
                        @click="updateColor('red', index)"></a>
                    </div>
                    <div class="form-group col-12">
                      <button class="btn" v-bind:class="quiz.color"   :disabled="editQuizValidator(index)">Save</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
          <Modal width="500px" v-if="selectedQuiz == quiz.id && deleteQuizModal">
            <div slot="body">
              <div class="secondary-card">
                <h4 class="font-weight-bold mb-3">{{ quiz.title }}</h4>
                <p class="text-muted">
                  You are about to delete this quiz. No one will be able to access this quiz ever again.
                </p>
                <p class="font-weight-bold">Are you absolutely positive? There's no undo.</p>
                <div class="mt-3">
                  <button @click="deleteQuiz(quiz.id, index)"
                    class="btn red mr-1">Yes, delete</button>
                  <button @click="deleteQuizModal = false"
                    class="btn transparent">Cancel</button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
    <Modal v-if="createQuizModal">
      <!-- <div slot="header">
        <div class="card-header black">
          <div class="row justify-content-between">
            <div class="col-auto align-self-center">
              <h4 class="mb-0 font-weight-bold">Create a new quiz</h4>
            </div>
          </div>
        </div>
      </div> -->
      <div slot="body">
        <div class="secondary-card">
          <form v-on:submit.prevent="postQuiz()">
            <div class="form-row">
              <div class="form-group col-sm-6">
                <label for="quizName">Quiz Name</label>
                <input type="text"
                  v-model="quizName" class="form-control" id="quizName"
                  placeholder="Quiz Title" autocomplete="off">
              </div>
              <div class="form-group col-sm-6">
                <label for="dueDate">Due Date</label>
                <input type="date" class="form-control" v-model="dueDate" id="dueDate">
              </div>
              <div class="form-group col-sm-6">
                <label for="questionOrder">Questions Order</label>
                <select class="form-control" v-model="questionOrder" id="questionOrder">
                  <option value="">Select One</option>
                  <option value="order">Question Order</option>
                  <option value="type">Question Type</option>
                  <option value="?">Random</option>
                </select>
              </div>
              <div class="form-group col-sm-6">
                <label for="defaultMark">Default Mark</label>
                <input type="number" class="form-control" v-model="defaultMark"
                  placeholder="Default Mark" id="defaultMark">
              </div>
              <div class="form-group col-12">
                <input type="hidden" v-model="quizColor">
                <a href="javascript:void(0)" class="circle blue colorPanelBorder"
                  v-bind:class="{'selectedColor': quizColor == 'blue'}"
                  @click="chooseColor('blue')"></a>
                <a href="javascript:void(0)" class="circle green colorPanelBorder"
                  v-bind:class="{'selectedColor': quizColor == 'green'}"
                  @click="chooseColor('green')"></a>
                <a href="javascript:void(0)" class="circle orange colorPanelBorder"
                  v-bind:class="{'selectedColor': quizColor == 'orange'}"
                  @click="chooseColor('orange')"></a>
                <a href="javascript:void(0)" class="circle purple colorPanelBorder"
                  v-bind:class="{'selectedColor': quizColor == 'purple'}"
                  @click="chooseColor('purple')"></a>
                <a href="javascript:void(0)" class="circle red colorPanelBorder"
                  v-bind:class="{'selectedColor': quizColor == 'red'}"
                  @click="chooseColor('red')"></a>
              </div>
              <div class="mt-4 text-right">
                <button type="button" class="btn black mr-1" :disabled="newQuizValidator">Save</button>
                <button type="button" class="btn transparent"
                  @click="createQuizModal = false">Close</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
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
      quizColor: null,
      classTitle: null,
      classColor: null,
      classDescription: null,
      quizzes: [],
      selectedQuiz: null,
      createQuizModal: false,
      editQuizModal: false,
      deleteQuizModal: false,
      quizDropDownId: null
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    newQuizValidator () {
      return (this.quizName && this.dueDate && this.questionOrder && this.defaultMark && this.quizColor) ? false : true
    },
    editQuizValidator () {
      return index => (this.quizzes[index].title && this.quizzes[index].due_date && this.quizzes[index].question_order && this.quizzes[index].default_mark) ? false : true
    }
  },
  methods: {
    chooseColor(color) {
      this.quizColor = color
    },
    updateColor(color, quizIndex) {
      this.quizzes[quizIndex].color = color
    },
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
    editQuiz(quizId) {
      this.selectedQuiz = quizId
      this.editQuizModal = true
    },
    updateQuiz(index) {
      appService.updateQuiz({
        id: this.selectedQuiz,
        title: this.quizzes[index].title,
        question_order: this.quizzes[index].question_order,
        default_mark: this.quizzes[index].default_mark,
        due_date: this.quizzes[index].due_date,
        color: this.quizzes[index].color
      })
        .then(() => {
          this.editQuizModal = false
        })
    },
    quizDeleteConfirm(quizId) {
      this.selectedQuiz = quizId
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
        question_order: this.questionOrder,
        color: this.quizColor,
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
        this.classColor = data.color
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
