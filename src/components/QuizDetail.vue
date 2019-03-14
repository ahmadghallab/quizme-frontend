<template>
  <div class="wrapper">
    <Loader v-if="getQuestionsloader" />
    <div v-if="!getQuestionsloader" class="animateThis">
      <div class="card-header py-4" v-bind:class="quizColor">
        <div class="row justify-content-between">
          <div class="col align-self-center text-center">
            <h4 class="font-weight-bold mb-2">{{ quizTitle }}</h4>
            <p class="text-muted-light">{{ questions.length ? questions.length + ' questions' : 'No questions yet' }}</p>
            <div class="mt-4">
              <router-link :to="{ name: 'assessment', params: {quiz: id } }" class="circle white">
                <svg viewBox="0 0 49.464 49.464" class="icon" xml:space="preserve">
                	<g>
                		<path d="M5.265,6.651v36.182c0,3.152,3.079,6.301,6.185,6.605c0.179,0.018,0.482,0.026,0.66,0.026
                			c2.336,0,4.395-1.435,5.997-2.587c0.28-0.2,0.579-0.394,0.835-0.566c2.257-1.526,4.499-3.154,6.652-4.729
                			c1.86-1.359,3.791-2.766,5.706-4.085c1.777-1.225,3.543-2.475,5.303-3.724l1.908-1.352c3.051-2.08,5.688-3.877,5.688-7.682
                			c0-3.947-3.188-6.031-5.688-7.663c-0.375-0.266-0.759-0.53-1.143-0.794c-0.448-0.308-0.897-0.616-1.333-0.929
                			c-3.844-2.763-7.61-5.46-11.436-8.085c-0.53-0.364-1.064-0.735-1.601-1.108c-1.399-0.973-2.847-1.979-4.288-2.904
                			c-0.339-0.218-0.7-0.496-1.083-0.788C16.185,1.368,14.39,0,12.215,0c-0.871,0-1.958,0.225-2.735,0.666
                			C7.651,1.706,5.265,3.897,5.265,6.651z M9.265,6.651c0-0.787,1.103-1.887,2.191-2.505c0.175-0.1,0.457-0.145,0.635-0.145
                			c0.824,0,2.086,0.914,3.05,1.649c0.463,0.353,0.931,0.686,1.377,0.972c1.38,0.887,2.812,1.871,4.183,2.824
                			c0.543,0.377,1.09,0.752,1.627,1.121c3.794,2.603,7.545,5.286,11.37,8.035c0.458,0.329,0.933,0.654,1.404,0.978
                			c0.368,0.254,0.737,0.506,1.158,0.803c2.724,1.78,3.938,2.832,3.938,4.357c0,1.491-0.791,2.23-3.967,4.396l-1.94,1.375
                			c-1.744,1.237-3.49,2.478-5.253,3.691c-1.961,1.352-3.907,2.773-5.789,4.149c-2.125,1.553-4.322,3.159-6.519,4.646
                			c-0.284,0.192-0.584,0.407-0.896,0.631c-1.137,0.817-2.553,1.835-3.601,1.835c-0.048,0-0.345-0.002-0.394-0.007
                			c-1.065-0.104-2.576-1.527-2.576-2.625V6.651H9.265z"/>
                	</g>
                </svg>
              </router-link>
            </div>
            <div class="mt-4">
              <button type="button" class="btn mx-1 white"
                @click="postQuestion('mc')">Multiple Choice</button>
              <button type="button" class="btn mx-1 white"
                @click="postQuestion('ma')">Multiple Answers</button>
              <button type="button" class="btn mx-1 white"
                @click="postQuestion('fb')">Fill Blanks</button>
              <button type="button" class="btn mx-1 white"
                @click="postQuestion('enu')">Enumerate</button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body py-0 px-0">
        <div class="py-4" v-if="!questions.length">
          <h6 class="mb-2 text-center">No questions yet</h6>
          <p class="mb-0 text-muted text-center">Click Add Question to create a new question.</p>
        </div>
        <div class="list list-lc" v-for="(question, questionIndex) in questions" v-bind:key="questionIndex">
          <div class="row justify-content-between">
            <div class="col">
              <p class="mb-2 text-muted">{{ questionTypeAb(question.type) }}</p>
              <h4 v-html="newTitle(question.title)">{{ newTitle(question.title) }}</h4>
              <div class="mt-4">
                <a v-if="questionIndex != 0" href="javascript:void(0)" class="circle mr-2" v-bind:class="quizColor">
                  <svg viewBox="-66 1 511 511.99987" class="icon"><path d="m191.480469 512c-11.046875 0-20-8.953125-20-20v-256.015625h-120.90625c-20.273438 0-38.410157-12.167969-46.207031-31-7.820313-18.898437-3.570313-40.402344 10.828124-54.78125l132.824219-132.664063c23.414063-23.386718 61.507813-23.382812 84.917969 0l132.828125 132.664063c14.398437 14.378906 18.648437 35.882813 10.824219 54.78125-7.792969 18.832031-25.929688 31-46.203125 31h-43.03125c-11.046875 0-20-8.957031-20-20 0-11.046875 8.953125-20.003906 20-20.003906h43.03125c5.992187 0 8.460937-4.402344 9.242187-6.292969.796875-1.925781 2.1875-6.871094-2.132812-11.183594l-132.824219-132.664062c-7.824219-7.816406-20.558594-7.816406-28.382813 0l-132.824218 132.664062c-4.320313 4.3125-2.929688 9.257813-2.136719 11.179688.785156 1.894531 3.253906 6.296875 9.246094 6.296875h120.90625c22.054687 0 40 17.945312 40 40.003906v256.011719c0 11.050781-8.953125 20.003906-20 20.003906zm0 0"/></svg>
                </a>
                <a v-if="questionIndex+1 != questions.length" href="javascript:void(0)" class="circle mr-2" v-bind:class="quizColor">
                  <svg viewBox="-66 0 512 512" class="icon"><path d="m189.980469 512c-15.375 0-30.753907-5.847656-42.460938-17.539062l-132.824219-132.664063c-14.398437-14.378906-18.648437-35.882813-10.828124-54.78125 7.796874-18.832031 25.933593-31 46.207031-31h120.90625v-256.015625c0-11.046875 8.953125-20 20-20s20 8.953125 20 20v256.015625c0 22.058594-17.945313 40.003906-40 40.003906h-120.90625c-5.992188 0-8.460938 4.402344-9.246094 6.292969-.796875 1.925781-2.183594 6.871094 2.136719 11.183594l132.824218 132.664062c7.824219 7.8125 20.558594 7.8125 28.382813 0l132.824219-132.664062c4.320312-4.3125 2.929687-9.257813 2.132812-11.183594-.78125-1.890625-3.25-6.292969-9.242187-6.292969h-43.03125c-11.046875 0-20-8.957031-20-20.003906s8.953125-20 20-20h43.03125c20.273437 0 38.410156 12.167969 46.203125 31 7.824218 18.898437 3.574218 40.402344-10.824219 54.78125l-132.824219 132.664063c-11.707031 11.691406-27.082031 17.539062-42.460937 17.539062zm0 0"/></svg>
                </a>
                <a href="javascript:void(0)"
                  @click="getQuestionAnswers(question.id, question.mark, question.type)"
                  class="circle mr-2" v-bind:class="quizColor">
                  <svg viewBox="0 0 512 512" class="icon" xml:space="preserve">
                		<g>
                			<path d="M352.459,220c0-11.046-8.954-20-20-20h-206c-11.046,0-20,8.954-20,20s8.954,20,20,20h206
                				C343.505,240,352.459,231.046,352.459,220z"/>
                			<path d="M126.459,280c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20H251.57c11.046,0,20-8.954,20-20c0-11.046-8.954-20-20-20
                				H126.459z"/>
                			<path d="M173.459,472H106.57c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40h245.889c22.056,0,40,17.944,40,40v123
                				c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112,0-80,35.888-80,80v352
                				c0,44.112,35.888,80,80,80h66.889c11.046,0,20-8.954,20-20C193.459,480.954,184.505,472,173.459,472z"/>
                			<path d="M467.884,289.572c-23.394-23.394-61.458-23.395-84.837-0.016l-109.803,109.56c-2.332,2.327-4.052,5.193-5.01,8.345
                				l-23.913,78.725c-2.12,6.98-0.273,14.559,4.821,19.78c3.816,3.911,9,6.034,14.317,6.034c1.779,0,3.575-0.238,5.338-0.727
                				l80.725-22.361c3.322-0.92,6.35-2.683,8.79-5.119l109.573-109.367C491.279,351.032,491.279,312.968,467.884,289.572z
                				 M333.776,451.768l-40.612,11.25l11.885-39.129l74.089-73.925l28.29,28.29L333.776,451.768z M439.615,346.13l-3.875,3.867
                				l-28.285-28.285l3.862-3.854c7.798-7.798,20.486-7.798,28.284,0C447.399,325.656,447.399,338.344,439.615,346.13z"/>
                			<path d="M332.459,120h-206c-11.046,0-20,8.954-20,20s8.954,20,20,20h206c11.046,0,20-8.954,20-20S343.505,120,332.459,120z"/>
                		</g>
                  </svg>
                </a>
                <a href="javascript:void(0)"
                  @click="questionDeleteConfirm(question.id)"
                  class="circle" v-bind:class="quizColor">
                  <svg viewBox="-40 0 512 512"  class="icon">
                    <path d="m396.980469 159.292969c3.78125 4.019531 5.734375 9.417969 5.398437 14.921875l-10.105468 166c-.667969 11.027344-10.152344 19.417968-21.175782 18.75-11.027344-.671875-19.417968-10.152344-18.75-21.179688l8.8125-144.785156h-290.320312l14.695312 241.429688c1.28125 21.066406 18.820313 37.570312 39.925782 37.570312h181.078124c21.109376 0 38.644532-16.503906 39.929688-37.570312.667969-11.023438 10.152344-19.414063 21.175781-18.746094 11.027344.667968 19.417969 10.152344 18.75 21.175781-2.566406 42.136719-37.640625 75.140625-79.855469 75.140625h-181.078124c-42.214844 0-77.289063-33.003906-79.855469-75.140625l-15.984375-262.644531c-.335938-5.503906 1.617187-10.902344 5.398437-14.921875 3.78125-4.015625 9.050781-6.292969 14.566407-6.292969h332.828124c5.515626 0 10.785157 2.277344 14.566407 6.292969zm35.019531-66.359375c0 11.046875-8.953125 20-20 20h-392c-11.046875 0-20-8.953125-20-20s8.953125-20 20-20h106.328125c3.59375-40.8125 37.941406-72.933594 79.671875-72.933594h20c41.730469 0 76.078125 32.121094 79.671875 72.933594h106.328125c11.046875 0 20 8.953125 20 20zm-265.363281-20h98.726562c-3.347656-18.695313-19.71875-32.933594-39.363281-32.933594h-20c-19.644531 0-36.015625 14.238281-39.363281 32.933594zm29.363281 180.066406v160c0 11.046875 8.953125 20 20 20s20-8.953125 20-20v-160c0-11.046875-8.953125-20-20-20s-20 8.953125-20 20zm-60.800781 10.015625c-11.035157.441406-19.625 9.746094-19.183594 20.785156l4 100c.429687 10.761719 9.292969 19.199219 19.96875 19.199219.273437 0 .542969-.003906.816406-.015625 11.035157-.441406 19.625-9.75 19.183594-20.785156l-4-100c-.441406-11.035157-9.757813-19.652344-20.785156-19.183594zm140.816406 19.183594-4 100c-.441406 11.039062 8.148437 20.34375 19.183594 20.785156.273437.011719.542969.015625.816406.015625 10.675781 0 19.539063-8.4375 19.96875-19.199219l4-100c.441406-11.039062-8.148437-20.34375-19.183594-20.785156-11.035156-.46875-20.34375 8.148437-20.785156 19.183594zm0 0"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <Modal width="500px" v-if="selectedQuestionId == question.id && deleteQuestionModal">
            <div slot="body">
              <div class="secondary-card">
                <h4 class="font-weight-bold mb-3">{{ question.title }}</h4>
                <p class="text-muted">
                  You are about to delete this question. No one will be able to access this quiz ever again.
                </p>
                <p class="font-weight-bold">Are you absolutely positive? There's no undo.</p>
                <div class="mt-3">
                  <button @click="deleteQuestion(question.id, questionIndex)"
                    class="btn red mr-1">Yes, delete</button>
                  <button @click="deleteQuestionModal = false"
                    class="btn transparent">Cancel</button>
                </div>
              </div>
            </div>
          </Modal>
          <Modal v-if="showAnswersModal && !getAnswersloader && selectedQuestionId == question.id" @close="showAnswersModal = false">
            <div slot="header">
              <div class="card-header" v-bind:class="quizColor">
                <div class="row">
                  <div class="col">
                    <h6 class="mb-0 font-weight-bold">{{ questionTypeAb(question.type) }} Question</h6>
                  </div>
                </div>
              </div>
            </div>
            <div slot="body">
              <div class="card-body">
                <div class="form-row">
                  <!-- <div class="form-group col-sm-2">
                    <label for="questionOrderUpdate">Order</label>
                    <input type="text" v-model="question.order" class="form-control" id="questionOrderUpdate" autocomplete="off" placeholder="Order"
                    @input="updateQuestion('order', $event)">
                  </div>
                  <div class="form-group col-sm-2">
                    <label for="questionMarkUpdate">Mark</label>
                    <input type="text" v-model="question.mark" class="form-control" id="questionMarkUpdate" autocomplete="off" placeholder="Mark"
                    @input="updateQuestion('mark', $event)">
                  </div> -->
                  <div class="form-group col-12">
                    <!-- <label for="questionTitleUpdate" class="float-left">Question Title</label> -->
                    <textarea v-model="question.title" class="form-control" id="questionTitleUpdate" placeholder="Title of your question"
                    @input="updateQuestion('title', $event)"></textarea>
                  </div>
                </div>
                <div v-if="answers.length">
                  <div v-for="(answer, answerIndex) in answers"
                      v-bind:key="answerIndex">
                    <div class="form-row">
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
                        v-bind:class="[
                          quizColor,
                          answer.correct ? '' : 'not-correct',
                          answer.correct && question.type == 'mc' ? 'inactive' : ''
                        ]"
                        v-on:click="updateCorrectAnswer(question.type, answer.id, question.id, answer.correct, answerIndex)">
                          <svg viewBox="0 -49 512.00075 512"
                            class="icon"><path d="m190.476562 413.828125c-20.628906 0-40.503906-8.0625-55.347656-22.652344l-129.148437-126.910156c-7.878907-7.742187-7.988281-20.40625-.246094-28.28125 7.742187-7.878906 20.40625-7.992187 28.285156-.25l129.144531 126.910156c8.105469 7.964844 19.246094 11.992188 30.570313 11.050781 11.324219-.945312 21.648437-6.757812 28.324219-15.953124l253.757812-349.492188c6.488282-8.9375 18.996094-10.921875 27.933594-4.433594 8.9375 6.492188 10.921875 19 4.433594 27.9375l-253.757813 349.488282c-13.523437 18.625-34.433593 30.402343-57.371093 32.3125-2.195313.183593-4.394532.273437-6.578126.273437zm0 0"/>
                          </svg>
                        </a>
                      </div>
                      <div class="col-auto form-group align-self-center">
                        <a href="javascript:void(0)"
                          v-on:click="deleteAnswer(answer.id, answerIndex)"
                          class="circle" v-bind:class="quizColor">
                          <svg viewBox="-40 0 512 512"  class="icon">
                            <path d="m396.980469 159.292969c3.78125 4.019531 5.734375 9.417969 5.398437 14.921875l-10.105468 166c-.667969 11.027344-10.152344 19.417968-21.175782 18.75-11.027344-.671875-19.417968-10.152344-18.75-21.179688l8.8125-144.785156h-290.320312l14.695312 241.429688c1.28125 21.066406 18.820313 37.570312 39.925782 37.570312h181.078124c21.109376 0 38.644532-16.503906 39.929688-37.570312.667969-11.023438 10.152344-19.414063 21.175781-18.746094 11.027344.667968 19.417969 10.152344 18.75 21.175781-2.566406 42.136719-37.640625 75.140625-79.855469 75.140625h-181.078124c-42.214844 0-77.289063-33.003906-79.855469-75.140625l-15.984375-262.644531c-.335938-5.503906 1.617187-10.902344 5.398437-14.921875 3.78125-4.015625 9.050781-6.292969 14.566407-6.292969h332.828124c5.515626 0 10.785157 2.277344 14.566407 6.292969zm35.019531-66.359375c0 11.046875-8.953125 20-20 20h-392c-11.046875 0-20-8.953125-20-20s8.953125-20 20-20h106.328125c3.59375-40.8125 37.941406-72.933594 79.671875-72.933594h20c41.730469 0 76.078125 32.121094 79.671875 72.933594h106.328125c11.046875 0 20 8.953125 20 20zm-265.363281-20h98.726562c-3.347656-18.695313-19.71875-32.933594-39.363281-32.933594h-20c-19.644531 0-36.015625 14.238281-39.363281 32.933594zm29.363281 180.066406v160c0 11.046875 8.953125 20 20 20s20-8.953125 20-20v-160c0-11.046875-8.953125-20-20-20s-20 8.953125-20 20zm-60.800781 10.015625c-11.035157.441406-19.625 9.746094-19.183594 20.785156l4 100c.429687 10.761719 9.292969 19.199219 19.96875 19.199219.273437 0 .542969-.003906.816406-.015625 11.035157-.441406 19.625-9.75 19.183594-20.785156l-4-100c-.441406-11.035157-9.757813-19.652344-20.785156-19.183594zm140.816406 19.183594-4 100c-.441406 11.039062 8.148437 20.34375 19.183594 20.785156.273437.011719.542969.015625.816406.015625 10.675781 0 19.539063-8.4375 19.96875-19.199219l4-100c.441406-11.039062-8.148437-20.34375-19.183594-20.785156-11.035156-.46875-20.34375 8.148437-20.785156 19.183594zm0 0"/>
                          </svg>
                        </a>
                      </div>
                  </div>
                </div>
              </div>
              <div class="form-row">
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
              <div class="mt-4 text-right">
                <button type="button"
                class="btn" v-bind:class="quizColor"
                @click="showAnswersModal = false" v-if="question.title">
                  Close
                </button>
                <button type="button"
                class="btn" v-bind:class="quizColor"
                @click="deleteQuestion(question.id, questionIndex, 'modal')" v-else>
                Discard</button>
              </div>
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
      quizColor: null,
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
        if (from) this.showAnswerModal = false
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
    updateCorrectAnswer(questionType, answerId, questionId, correct=true, answerIndex=null)
    {
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
        this.quizColor = data.color
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
    postQuestion(type) {
      appService.postQuestion({
        quiz: this.id,
        title: null,
        file: null,
        order: this.questions.length + 1,
        mark: this.defaultMark,
        type: type
      })
      .then((data) => {
        this.questions.push(data)
        this.answers = []
        this.selectedQuestionId = data.id
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
