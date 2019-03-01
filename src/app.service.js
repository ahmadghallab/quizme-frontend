import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1'

axios.interceptors.request.use(function (config) {
  const token = window.localStorage.getItem('token')
  if (token !== 'null') {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

const appService = {
  join (data) {
    return new Promise((resolve, reject) => {
      axios.post('/join/', data)
        .then(() => {
          resolve()
        }).catch(error => {
          reject(error.data)
        })
    })
  },
  leave (classId, userId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/leave/class/${classId}/student/${userId}/`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  // Quizzes
  postQuiz (data) {
    return new Promise((resolve, reject) => {
      axios.post(`/classes/${data.class_group}/quizzes/`, data)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  updateQuiz (data) {
    return new Promise((resolve, reject) => {
      axios.patch(`/quizzes/${data.id}/`, data)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  getTodayQuizzes (userId) {
    return new Promise((resolve) => {
      axios.get(`/users/${userId}/today/`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  getUserClasses (userId) {
    return new Promise((resolve) => {
      axios.get(`/users/${userId}/classes/`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  createUserClasses (data) {
    return new Promise((resolve) => {
      axios.post(`/users/${data.user}/classes/`, data)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  getClassQuizzes (classId) {
    return new Promise((resolve) => {
      axios.get(`/classes/${classId}/quizzes/`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  getQuiz (quizId) {
    return new Promise((resolve) => {
      axios.get(`/quizzes/${quizId}/`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  deleteQuiz (quizId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/quizzes/${quizId}/`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },

  getClass (classId) {
    return new Promise((resolve) => {
      axios.get(`/classes/${classId}/`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  postClass (data) {
    return new Promise((resolve, reject) => {
      axios.post('/classes/', data)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  updateClass (classId, data) {
    return new Promise((resolve, reject) => {
      axios.patch(`/classes/${classId}/`, data)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  deleteClass (classId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/classes/${classId}/`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  // Questions
  getQuizQuestions (quiz_id) {
    return new Promise((resolve) => {
      axios.get(`/quizzes/${quiz_id}/questions/`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  postQuestion (data) {
    return new Promise((resolve, reject) => {
      axios.post(`/quizzes/${data.quiz}/questions/`, data)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  getQuestion (question_id) {
    return new Promise((resolve) => {
      axios.get(`/questions/${question_id}/`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  updateQuestion (questionId, data) {
    return new Promise((resolve, reject) => {
      axios.patch(`/questions/${questionId}/`, data)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  updateQuestionFile (questionId, data) {
    return new Promise((resolve, reject) => {
      axios.patch(`/questions/${questionId}/file/`, data)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  deleteQuestion (questionId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/questions/${questionId}/`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  deleteClass (classId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/classes/${classId}/`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  // Answers
  updateAnswer (answerId, data) {
    return new Promise((resolve, reject) => {
      axios.patch(`/answers/${answerId}/`, data)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  getQuestionAnswers (questionId) {
    return new Promise((resolve) => {
      axios.get(`/questions/${questionId}/answers/`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  postAnswer (data) {
    return new Promise((resolve, reject) => {
      axios.post(`/questions/${data.question}/answers/`, data)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  deleteAnswer (answerId) {
    return new Promise((resolve, reject) => {
      axios.delete(`/answers/${answerId}/`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  getQuestionAndAnswers (data) {
    return new Promise((resolve, reject) => {
      axios.get(`/quizzes/${data.quiz_id}/assessment/?student=${data.student}&page=${data.page}`)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  getResults (quiz) {
    return new Promise((resolve, reject) => {
      axios.get(`/quizzes/${quiz}/results/`)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  getAssessmentResults (data) {
    return new Promise((resolve, reject) => {
      axios.get(`/quizzes/${data.quiz}/student/${data.student}/results/`)
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  },
  multipleChoiceResult (data) {
    return new Promise((resolve, reject) => {
      axios.post('/results/multiplechoice/', data)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  multipleAnswerResult (data) {
    return new Promise((resolve, reject) => {
      axios.post('/results/multipleanswer/', data)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  fillBlankResult (data) {
    return new Promise((resolve, reject) => {
      axios.post('/results/fillblank/', data)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  enumerateResult (data) {
    return new Promise((resolve, reject) => {
      axios.post('/results/enumerate/', data)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  doNotKnowResult (data) {
    return new Promise((resolve) => {
      axios.post('/results/donotknow/', data)
        .then(() => resolve())
    })
  },
  getUser (userId) {
    return new Promise((resolve, reject) => {
      axios.get(`/accounts/${userId}/`)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  login (credentials) {
    return new Promise((resolve, reject) => {
      axios.post(`/accounts/api-token-auth/`, credentials)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  upload (formData) {
    return new Promise((resolve, reject) => {
      axios.post(`/files/questions/${formData.question}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response)
        })
    })
  },
  getFiles (questionId) {
    return new Promise((resolve) => {
      axios.get(`/files/questions/${questionId}/`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
}

export default appService
