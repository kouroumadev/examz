import instance from './instance'

const create = (data) => instance.authwithFile.post('/staff', data)
const index = (search, limit, page) => instance.auth.get('/staff?search=' + search + '&limit=' + limit + '&page=' + page)
const deleted = (id) => instance.auth.delete('/staff/' + id)
const detail = (id) => instance.auth.get('/staff/' + id)
const update = (id, data) => instance.authwithFile.post('/staff/' + id + '?_method=PUT', data)

const apiStaff = {
  create,
  index,
  detail,
  update,
  deleted
}

export default apiStaff