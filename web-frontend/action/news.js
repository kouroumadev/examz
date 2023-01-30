import instance from './instance'

const create = (data) => instance.authwithFile.post('/news', data)
const all = (search, limit, page) => instance.auth.get('/news?search=' + search + '&limit=' + limit + '&page=' + page)
const deleted = (id) => instance.auth.delete('/news/' + id)
const detail = (id) => instance.auth.get('/news/'+id)
const update = (id, data) => instance.authwithFile.post('/news/' + id + '?_method=PUT', data)
const imgUpload = (data) => instance.authwithFile.post('/image-upload', data)
const publish = (id, data) => instance.auth.post('/news/'+id+'/status?_method=PUT', data)

const apiNews = {
  create,
  all,
  detail,
  update,
  deleted,
  publish,
  imgUpload
}

export default apiNews