import Vue from 'vue'
import Vuex from 'vuex'
import appService from '@/app.service.js'

Vue.use(Vuex)

const store =  new Vuex.Store({
  state: {
    isAuthenticated: false,
    isStaff: false,
    userId: null,
  },
  getters: {
    isAuthenticated: (state) => {
      return state.isAuthenticated
    },
    isStaff: (state) => {
      return state.isStaff
    },
    userId: (state) => {
      return parseInt(state.userId)
    }
  },
  mutations: {
    logout (state) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', null)
        window.localStorage.setItem('isStaff', null)
        window.localStorage.setItem('userId', null)
      }
      state.isAuthenticated = false
      state.isStaff = false
      state.userId = ''
    },
    login (state, token) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', token.token)
        window.localStorage.setItem('isStaff', token.is_staff)
        window.localStorage.setItem('userId', token.user_id)
      }
      state.isAuthenticated = true
      state.isStaff = token.is_staff
      state.userId = token.user_id
    }
  },
  actions: {
    logout (context) {
      return new Promise((resolve) => {
        context.commit('logout')
        resolve()
      })
    },
    login (context, credentials) {
      return new Promise((resolve, reject) => {
        appService.login(credentials)
          .then(data => {
            context.commit('login', data)
            resolve()
          })
          .catch(error => {
          reject(error.data)
        })
      })
    }
  }
})

if (typeof window !== 'undefined') {
  let token = window.localStorage.getItem('token')
  if (token !== null) {
    store.state.isAuthenticated = true
    store.state.isStaff = JSON.parse(window.localStorage.getItem('isStaff'))
    store.state.userId = window.localStorage.getItem('userId')
  }
}

export default store
