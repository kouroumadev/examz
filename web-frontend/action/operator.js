import instance from './instance'

const create = (data) => instance.authwithFile.post('/operator', data)
const index = (search, limit, page) => instance.auth.get('/operator?search=' + search + '&limit=' + limit + '&page=' + page)
const deleted = (id) => instance.auth.delete('/operator/' + id)
const detail = (id) => instance.auth.get('/operator/' + id)
const update = (id, data) => instance.authwithFile.post('/operator/' + id + '?_method=PUT', data)

const apiOperator = {
  create,
  index,
  detail,
  update,
  deleted
}

export default apiOperator