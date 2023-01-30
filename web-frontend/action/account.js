import instance from './instance'

const detail = () => instance.auth('/auth/profile')
const updateProfile = (data) => instance.authwithFile.post('/update-profile?_method=PUT', data)
const changepassword = (data) => instance.auth.put('/update-password', data)
const verify = (data) => instance.noAuth.get('/auth/email/verify/' + data)
const checkToken = () => instance.auth.get('check-token') 

const apiAccount = {
  detail,
  updateProfile,
  changepassword,
  verify,
  checkToken
}

export default apiAccount