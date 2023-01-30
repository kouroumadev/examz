import instance from './instance'

const create = (data) => instance.auth.post('/institute/admin', data)
const all = (search, limit, page) => instance.auth.get('/institute/admin?search=' + search + '&limit=' + limit + '&page=' + page)
const deleted = (id) => instance.auth.delete('/institute/admin/' + id)
const detail = (id) => instance.auth.get('/institute/admin/' + id)
const update = (id, data) => instance.auth.post('/institute/admin/' + id + '?_method=PUT', data)

const apiAdmin = {
  create,
  all,
  detail,
  update,
  deleted
}

export default apiAdmin