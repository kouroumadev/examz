import instance from './instance'

const loginGoogle = () => instance.get('/auth/social/google')
const callbackGoogle = (path) => instance.get('/auth/social/google/callback' + path)
const loginFacebook = () => instance.get('/auth/social/facebook')
const callbackFacebook = (path) => instance.get('/auth/social/facebook/callback' + path)

const register = (data) => instance.post('/auth/register', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})

const login = (data) => instance.post('/auth/login', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})

const forgotPassword = (email) => instance.post('/auth/forgot-password', email,  {
  headers: {
    'Content-Type': 'application/json'
  }
})

const resetPassword = (data) => instance.post('/auth/reset-password', data, {
  headers: {
    'Content-Type': 'application/json'
  }
})

const apiAuth = {
  loginGoogle,
  callbackGoogle,
  loginFacebook,
  callbackFacebook,
  register,
  login,
  forgotPassword,
  resetPassword
}

export default apiAuth