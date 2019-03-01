<template>
  <div class="wrapper">
    <Loader v-if="getUserLoader" />
    <div class="blue-green-bg animateThis" v-if="!getUserLoader">
      <div class="row justify-content-between">
        <div class="col-auto align-self-center">
          <h6 class="mb-3 font-weight-bold">{{ user.first_name }} {{ user.last_name }}</h6>
          <p class="small-text mb-0">{{ classCount ? classCount + ' classes' : 'No classes' }}</p>
        </div>
        <div class="col-auto align-self-center" v-if="isAuthenticated">
          <div class="btn-group dropleft"
            v-bind:class="{show: profileDropDown}">
            <a href="javascript:void(0)"
              class="circle" style="background:#fff;"
              @click="profileDropDown = !profileDropDown">
              <svg viewBox="0 0 512 512" style="fill:#15c39a;width:15px" xml:space="preserve">
                <g>
                  <circle cx="256" cy="256" r="64"/>
                  <circle cx="256" cy="448" r="64"/>
                  <circle cx="256" cy="64" r="64"/>
                </g>
              </svg>
            </a>
            <div class="dropdown-menu"
            v-bind:class="{show: profileDropDown}"
            style="left:auto;right:0;">
              <a href="javascript:void(0)"
                class="dropdown-item small-text">Edit
              </a>
              <div class="dropdown-divider"></div>
              <a href="javascript:void(0)"
                @click="profileDeleteConfirm = true"
                class="dropdown-item small-text danger-highlight">Delete Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loader v-if="getUserClassesLoader" />
    <div v-if="!getUserClassesLoader" class="animateThis">
      <div>
        <p class="mb-0 text-center small-text" v-if="!classes.length">No classes have been created yet
        </p>
        <div class="secondary-card" v-for="(classgroup, index) in classes" v-bind:key="index">
          <div class="row justify-content-between">
            <div class="col-auto align-self-center">
              <router-link :to="{name: 'ClassDetail', params: { id: classgroup.id }}">
                <h6 class="mb-2 font-weight-bold">{{ classgroup.title }}</h6>
              </router-link>
              <p class="small-text text-muted mb-0">{{ classgroup.total_quizzes ? classgroup.total_quizzes + ' Quiz' : 'No Quizzes'}}</p>
            </div>
            <div class="col-auto align-self-center">
              <div class="btn-group dropleft"
                v-bind:class="{show: classDropDownId == classgroup.id}">
                <a href="javascript:void(0)"
                  class="circle"
                  @click="showClassDropDown(classgroup.id)">
                  <svg viewBox="0 0 512 512" style="fill:#97a0bf;width:15px" xml:space="preserve">
                    <g>
                      <circle cx="256" cy="256" r="64"/>
                      <circle cx="256" cy="448" r="64"/>
                      <circle cx="256" cy="64" r="64"/>
                    </g>
                  </svg>
                </a>
                <div class="dropdown-menu"
                v-bind:class="{show: classDropDownId == classgroup.id}"
                style="left:auto;right:0;">
                  <a href="javascript:void(0)"
                    @click="classEditConfirm(classgroup.id)"
                    class="dropdown-item small-text">Edit
                  </a>
                  <div class="dropdown-divider"></div>
                  <a href="javascript:void(0)"
                    @click="classDeleteConfirm(classgroup.id)"
                    class="dropdown-item small-text danger-highlight">Remove
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Modal width="500px" v-if="selectedClass == classgroup.id && deleteClassModal">
            <div slot="header">
              <div class="card-header red">
                <div class="row justify-content-between">
                  <div class="col-auto align-self-center">
                    <h5 class="mb-0 font-weight-bold">Delete this class?</h5>
                  </div>
                  <div class="col-auto align-self-center">
                    <a href="javascript:void(0)"
                      class="tag-style default-highlight-light"
                      @click="deleteClassModal = false">Dismiss</a>
                  </div>
                </div>
              </div>
            </div>
            <div slot="body">
              <div class="card-body">
                <h4 class="font-weight-bold">{{ classgroup.title }}</h4>
                <p class="text-muted">
                  You are about to delete this class. No one will be able to access this class ever again.
                </p>
                <p class="font-weight-bold">Are you absolutely positive? There's no undo.</p>
                <button @click="deleteClass(classgroup.id, index)"
                  class="btn red mr-3">Yes, delete</button>
              </div>
            </div>
          </Modal>
          <Modal width="600px" v-if="selectedClass == classgroup.id && editClassModal">
            <div slot="header">
              <div class="card-header green">
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
                <form v-on:submit.prevent="updateClass(index)">
                  <div class="form-group">
                    <label for="classTitleUpdate">Class Title</label>
                    <input type="text"
                      v-model="classgroup.title"
                      class="form-control"
                      id="classTitleUpdate"
                      autocomplete="off" placeholder="Class Title">
                  </div>
                  <div class="form-group">
                    <label for="classTitle">Description</label>
                    <textarea rows="3" class="form-control"
                    v-model="classgroup.description" placeholder="Type class description here"></textarea>
                  </div>
                  <div class="form-group">
                    <button class="btn green" :disabled="editClassValidator(index)">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
      <!-- <TodayQuizzes /> -->
    <Modal width="600px" v-if="createClassModal">
      <div slot="header">
        <div class="card-header blue">
          <div class="row justify-content-between">
            <div class="col-auto align-self-center">
              <h5 class="mb-0 font-weight-bold">Create a new class</h5>
            </div>
            <div class="col-auto align-self-center">
              <a href="javascript:void(0)"
              class="tag-style default-highlight-light"
              @click="createClassModal = false">Dismiss</a>
            </div>
          </div>
        </div>
      </div>
      <div slot="body">
        <div class="card-body">
          <form v-on:submit.prevent="createClass()">
            <div class="form-group">
              <label for="classTitle">Title</label>
              <input type="text" class="form-control"
              v-model="classTitle" placeholder="Type class title here">
            </div>
            <div class="form-group">
              <label for="classTitle">Description</label>
              <textarea rows="2" class="form-control"
              v-model="classDescription" placeholder="Type class description here"></textarea>
            </div>
            <div class="form-group">
              <button class="btn blue" :disabled="newClassValidator">Create</button>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Loader,
    Modal
  },
  data() {
    return {
      getUserLoader: true,
      createClassModal: false,
      classTitle: null,
      classDescription: null,
      user: {},
      id: this.$route.params.id,
      getUserClassesLoader: true,
      classes: [],
      classCount: null,
      classDropDownId: null,
      deleteClassModal: false,
      selectedClass: null,
      profileDropDown: false,
      profileDeleteConfirm: false,
      editClassModal: false,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'userId']),
    newClassValidator () {
      return this.classTitle ? false : true
    },
    editClassValidator () {
      return index => (this.classes[index].title) ? false : true
    }
  },
  methods: {
    ...mapActions({
      logout: 'logout'
    }),
    // logout () { this.$store.dispatch('logout').then(() => { this.$router.push('/login')})}
    showClassDropDown(classId) {
      if (this.classDropDownId == classId) {
        this.classDropDownId = null
      } else {
        this.classDropDownId = classId
      }
    },
    classDeleteConfirm(classId) {
      this.selectedClass = classId
      this.deleteClassModal = true
    },
    classEditConfirm(classId) {
      this.selectedClass = classId
      this.editClassModal = true
    },
    deleteClass(classId, classIndex) {
      appService.deleteClass(classId)
      .then(() => {
        this.deleteClassModal = false
        this.classes.splice(classIndex, 1)
      })
    },
    updateClass (classIndex) {
      appService.updateClass(this.selectedClass, {
        title: this.classes[classIndex].title,
        description: this.classes[classIndex].description
      })
        .then(() => {
          this.editClassModal = false
        })
    },
    getUser () {
      appService.getUser(this.userId).then(data => {
        this.user = data
        this.getUserLoader = false
      }).catch()
    },
    getUserClasses () {
      appService.getUserClasses(this.id).then(data => {
        this.classes = data.results
        this.classCount = data.count
        this.getUserClassesLoader = false
      })
    },
    createClass() {
      appService.createUserClasses({
        user: this.id,
        title: this.classTitle,
        description: this.classDescription
      })
        .then((data) => {
          this.classTitle = null
          this.classDescription = null
          this.classes.push(data)
          this.createClassModal = false
        })
    },
  },
  created() {
    this.getUser()
    this.getUserClasses()
  }
}
</script>
