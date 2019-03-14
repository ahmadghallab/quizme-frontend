<template>
  <div class="wrapper animateThis">
    <form v-on:submit.prevent="login()">
      <div class="row justify-content-center">
        <div class="col-sm-6">
          <div class="default-card">
            <h4 class="mb-4 font-weight-bold">Have an account? login</h4>
            <div class="secondary-card red" v-if="failedLogin">
              Your credintials are incorrect
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="text"
                v-model="email"
                class="form-control"
                id="email"
                placeholder="email"
                autocomplete="off">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password"
                class="form-control"
                v-model="password"
                placeholder="password"
                id="password">
            </div>
            <div class="form-group">
              <button type="submit" class="btn black" :disabled="loginValidator">Login</button>
            </div>
          </div>
        </div>
        <!-- <div class="col-sm-6">
          <div class="default-card">
            <h4 class="mb-4 font-weight-bold">New user? Sign Up</h4>
            <div class="form-row">
              <div class="form-group col-sm-6">
                <label for="firstName">First Name</label>
                <input type="text"
                  v-model="firstName"
                  class="form-control"
                  id="firstName"
                  placeholder="first name"
                  autocomplete="off">
              </div>
              <div class="form-group col-sm-6">
                <label for="firstName">Last Name</label>
                <input type="text"
                  v-model="lastName"
                  class="form-control"
                  id="lastName"
                  placeholder="last name"
                  autocomplete="off">
              </div>
              <div class="form-group col-12">
                <label for="newEmail">Email Address</label>
                <input type="text"
                  v-model="newEmail"
                  class="form-control"
                  id="newEmail"
                  placeholder="email"
                  autocomplete="off">
              </div>
              <div class="form-group col-12">
                <label for="newPassword">Password</label>
                <input type="password"
                  class="form-control"
                  v-model="newPassword"
                  placeholder="password"
                  id="newPassword">
              </div>
              <div class="form-group col-12">
                <label for="passwordConfirm">Password Confirm</label>
                <input type="password"
                  class="form-control"
                  v-model="passwordConfirm"
                  placeholder="password again"
                  id="passwordConfirm">
              </div>
              <div class="form-group col-12">
                <button type="submit" class="btn black" :disabled="signupValidator">Create</button>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </form>
  </div>
</template>

<script>
import appService from '../app.service.js'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      email: null,
      password: null,
      failedLogin: false,
      firstName: null,
      lastName: null,
      newEmail: null,
      newPassword: null,
      passwordConfirm: null,
    }
  },
  computed: {
    ...mapGetters(['userId']),
    loginValidator () {
      return (this.email && this.password) ? false : true
    },
    signupValidator () {
      return (this.firstName && this.lastName && this.newEmail && this.newPassword && this.passwordConfirm && this.newPassword == this.passwordConfirm) ? false : true
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', {
        username: this.email,
        password: this.password
      })
      .then(() => {
        const redirect = `user/${this.userId}`
        this.$router.push(redirect)
      })
      .catch((error) => {
        this.failedLogin = true
        console.log(error)
      })
    }
  }
}
</script>
