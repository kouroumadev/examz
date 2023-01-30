import axios from 'axios'
import {store} from '../redux/store'
import { reSetCurrentUser } from "./auth/authAction";
import config from '../config'

const api = config.baseUrl + '/api'
const pathImg = config.baseUrl + '/storage/images/'

const noAuth = axios.create({ baseURL: api, withCredentials: true});

const auth = axios.create({
  baseURL: api,
  headers: {
    'Content_Type': 'application/json',
    authorization: 'Bearer ' + store.getState().auth.user.access_token
  }
})

const authwithFile = axios.create({
  baseURL: api,
  headers: {
    'Content_Type': 'multipart/form-data',
    authorization: 'Bearer ' + store.getState().auth.user.access_token
  }
})


auth.interceptors.response.use(function (res) {
  return res;
}, function (error) {
  if(error.response.status === 401)
    store.dispatch(reSetCurrentUser())
    
  return Promise.reject(error);
});

const instance ={
  noAuth,
  auth,
  authwithFile,
  pathImg
}

export default instance