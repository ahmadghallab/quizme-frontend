import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './views/Home.vue'
import User from './views/User.vue'
import QuizDetail from './views/QuizDetail.vue'
import ClassDetail from './views/ClassDetail.vue'
import Assessment from './views/Assessment.vue'
import AssessmentResult from './views/AssessmentResult.vue'
import Result from './views/Result.vue'
import store from './store';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User
    },
    {
      path: '/quiz/:id',
      name: 'QuizDetail',
      component: QuizDetail
    },
    {
      path: '/class/:id',
      name: 'ClassDetail',
      component: ClassDetail
    },
    {
      path: '/quiz/:quiz/assessment',
      name: 'assessment',
      component: Assessment
    },
    {
      path: '/quiz/:quiz/assessment/result',
      name: 'assessmentResult',
      component: AssessmentResult
    },
    {
      path: '/quiz/:quiz/result',
      name: 'result',
      component: Result
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(!store.state.isAuthenticated && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
