<template>
  <div class="wrapper">
    <Loader v-if="getUserLoader" />
    <div class="secondary-card animateThis" v-if="!getUserLoader">
      <div class="row justify-content-between">
        <div class="col align-self-center">
          <h2 class="mb-2 font-weight-bold">{{ user.first_name }} {{ user.last_name }}</h2>
          <p class="mb-4 text-muted">{{ classCount ? classCount + ' classes' : 'No classes' }}</p>
          <div>
            <a href="javascript:void(0)"
              class="circle black mr-2" @click="createClassModal = true">
              <svg viewBox="0 0 512 512" style="fill:#fff;width:16px" xml:space="preserve">
              	<g>
              		<g>
              			<path d="M492,236H276V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v216H20c-11.046,0-20,8.954-20,20s8.954,20,20,20h216
              				v216c0,11.046,8.954,20,20,20s20-8.954,20-20V276h216c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z"/>
              		</g>
              	</g>
              </svg>
            </a>
            <div class="btn-group align-top"
              v-bind:class="{show: profileDropDown}">
              <a href="javascript:void(0)"
                class="circle black"
                @click="profileDropDown = !profileDropDown">
                <svg viewBox="0 0 60 60" style="fill:#fff;width:16px" xml:space="preserve">
                	<g>
                		<path d="M8,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S12.411,22,8,22z"/>
                		<path d="M52,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S56.411,22,52,22z"/>
                		<path d="M30,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S34.411,22,30,22z"/>
                	</g>
                </svg>
              </a>
              <div class="dropdown-menu"
              v-bind:class="{show: profileDropDown}">
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
    </div>
    <Loader v-if="getUserClassesLoader" />
    <div class="animateThis" v-if="!getUserClassesLoader">
      <p class="text-center text-muted" v-if="!classes.length">No classes have been created yet
      </p>
      <div class="row">
        <div class="col-md-4" v-for="(classgroup, index) in classes" v-bind:key="index">
          <router-link :to="{name: 'ClassDetail', params: { id: classgroup.id }}">
            <div class="card-header text-center" v-bind:class="classgroup.color">
              <h5 class="my-2 font-weight-bold">{{ classgroup.title }}</h5>
            </div>
          </router-link>
          <div class="card-body">
            <div class="row justify-content-between">
              <div class="col">
                <p class="mb-0 text-muted">{{ classgroup.total_quizzes ? classgroup.total_quizzes + ' quizzes' : 'no quizzes'}}</p>
              </div>
              <div class="col-auto">
                <div class="btn-group dropleft"
                  v-bind:class="{show: classDropDownId == classgroup.id}">
                  <a href="javascript:void(0)"
                    @click="showClassDropDown(classgroup.id)">
                    <svg viewBox="0 0 512 512" style="fill:#6c757d; width:15px" xml:space="preserve">
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
                      @click="classEditModal(classgroup.id, classgroup.color)"
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
          </div>
          <Modal width="500px" v-if="selectedClass == classgroup.id && deleteClassModal">
            <div slot="header">
              <div class="card-header black">
                <div class="row justify-content-between">
                  <div class="col-auto align-self-center">
                    <h5 class="mb-0 font-weight-bold">Delete this class?</h5>
                  </div>
                  <div class="col-auto align-self-center">
                    <a href="javascript:void(0)"
                      class="light-highlight"
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
          <Modal v-if="selectedClass == classgroup.id && editClassModal">
            <div slot="header">
              <div class="card-header black">
                <div class="row justify-content-between">
                  <div class="col-auto align-self-center">
                    <h4 class="mb-0 font-weight-bold">Edit Class</h4>
                  </div>
                  <div class="col-auto align-self-center">
                    <a href="javascript:void(0)"
                      class="light-highlight"
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
                    <input type="hidden" v-model="classgroup.color">
                    <a href="javascript:void(0)" class="circle blue colorPanelBorder"
                      v-bind:class="{'selectedColor': classgroup.color == 'blue'}"
                      @click="updateColor('blue', index)"></a>
                    <a href="javascript:void(0)" class="circle green colorPanelBorder"
                      v-bind:class="{'selectedColor': classgroup.color == 'green'}"
                      @click="updateColor('green', index)"></a>
                    <a href="javascript:void(0)" class="circle orange colorPanelBorder"
                      v-bind:class="{'selectedColor': classgroup.color == 'orange'}"
                      @click="updateColor('orange', index)"></a>
                    <a href="javascript:void(0)" class="circle purple colorPanelBorder"
                      v-bind:class="{'selectedColor': classgroup.color == 'purple'}"
                      @click="updateColor('purple', index)"></a>
                    <a href="javascript:void(0)" class="circle red colorPanelBorder"
                      v-bind:class="{'selectedColor': classgroup.color == 'red'}"
                      @click="updateColor('red', index)"></a>
                  </div>
                  <div class="form-group">
                    <button class="btn blue" :disabled="editClassValidator(index)">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
      <!-- <TodayQuizzes /> -->
    <Modal v-if="createClassModal">
      <div slot="header">
        <div class="card-header black">
          <div class="row justify-content-between">
            <div class="col-auto align-self-center">
              <h4 class="mb-0 font-weight-bold">Create a new class</h4>
            </div>
            <div class="col-auto align-self-center">
              <a href="javascript:void(0)"
              class="light-highlight"
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
              <input type="hidden" v-model="classColor">
              <a href="javascript:void(0)" class="circle blue colorPanelBorder"
                v-bind:class="{'selectedColor': classColor == 'blue'}"
                @click="chooseColor('blue')"></a>
              <a href="javascript:void(0)" class="circle green colorPanelBorder"
                v-bind:class="{'selectedColor': classColor == 'green'}"
                @click="chooseColor('green')"></a>
              <a href="javascript:void(0)" class="circle orange colorPanelBorder"
                v-bind:class="{'selectedColor': classColor == 'orange'}"
                @click="chooseColor('orange')"></a>
              <a href="javascript:void(0)" class="circle purple colorPanelBorder"
                v-bind:class="{'selectedColor': classColor == 'purple'}"
                @click="chooseColor('purple')"></a>
              <a href="javascript:void(0)" class="circle red colorPanelBorder"
                v-bind:class="{'selectedColor': classColor == 'red'}"
                @click="chooseColor('red')"></a>
            </div>
            <div class="form-group">
              <button class="btn green" :disabled="newClassValidator">Create</button>
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
      classColor: null,
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
      return (this.classTitle && this.classColor) ? false : true
    },
    editClassValidator () {
      return index => (this.classes[index].title) ? false : true
    }
  },
  methods: {
    ...mapActions({
      logout: 'logout'
    }),
    logout () { this.$store.dispatch('logout').then(() => { this.$router.push('/login')})},
    chooseColor(color) {
      this.classColor = color
    },
    updateColor(color, classIndex) {
      this.classes[classIndex].color = color
    },
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
    classEditModal(classId, classColor) {
      this.selectedClass = classId
      this.editClassModal = true
      this.classColorUpdate = classColor
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
        description: this.classes[classIndex].description,
        color: this.classes[classIndex].color
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
        description: this.classDescription,
        color: this.classColor
      })
        .then((data) => {
          this.classTitle = null
          this.classDescription = null
          this.classColor = null
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
