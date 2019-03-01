<template>
  <div class="wrapper animateThis">
    <form v-on:submit.prevent="login()">
      <div class="row justify-content-md-center">
        <div class="col-sm-6">
          <div class="default-card">
            <h6 class="font-weight-bold mb-4">Have an account? login</h6>
            <div class="tag-style mb-4 danger-highlight" v-if="failedLogin">
              Your credintials are incorrect
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="text"
                v-model="email"
                class="form-control"
                id="email"
                autocomplete="off">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password"
                class="form-control"
                v-model="password"
                id="password">
            </div>
            <div>
              <button type="submit" class="btn primary-color" :disabled="loginValidator">Login</button>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="default-card">
            <h6 class="font-weight-bold mb-4">Don't have an account? Create One</h6>
            <div class="form-row">
              <div class="form-group col-sm-6">
                <label for="firstName">First Name</label>
                <input type="text"
                  v-model="firstName"
                  class="form-control"
                  id="firstName"
                  autocomplete="off">
              </div>
              <div class="form-group col-sm-6">
                <label for="firstName">Last Name</label>
                <input type="text"
                  v-model="lastName"
                  class="form-control"
                  id="lastName"
                  autocomplete="off">
              </div>
              <div class="form-group col-12">
                <label for="newEmail">Email Address</label>
                <input type="text"
                  v-model="newEmail"
                  class="form-control"
                  id="newEmail"
                  autocomplete="off">
              </div>
              <div class="form-group col-12">
                <label for="newPassword">Password</label>
                <input type="password"
                  class="form-control"
                  v-model="newPassword"
                  id="newPassword">
              </div>
              <div class="form-group col-12">
                <label for="passwordConfirm">Password Confirm</label>
                <input type="password"
                  class="form-control"
                  v-model="passwordConfirm"
                  id="passwordConfirm">
              </div>
              <div class="col-12">
                <button type="submit" class="btn primary-color" :disabled="signupValidator">Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import appService from '../app.service.js'

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
    loginValidator () {
      return (this.email && this.password) ? false : true
    },
    signupValidator () {
      return (this.firstName && this.lastName && this.newEmail && this.newPassword && this.passwordConfirm && this.newPassword == this.passwordConfirm) ? false : true
    }
  },
  methods: {
    login () {
      // this.$store.dispatch('login', {
      //   username: this.email,
      //   password: this.password
      // })
      appService.login({
        username: this.email,
        password: this.password
      })
      .then(() => {
        this.$router.push('/')
      })
      .catch((error) => {
        this.failedLogin = true
        console.log(error)
      })
    }
  }
}
</script>
