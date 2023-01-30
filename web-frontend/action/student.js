import instance from './instance'

const create = (data) => instance.authwithFile.post('/student', data)
const index = (search, branch, batch, status, limit, page) => instance.auth.get('/student?search=' + search + '&branch=' + branch + '&batch=' + batch + '&status=' + status + '&limit=' + limit + '&page=' + page)
const deleted = (id) => instance.auth.delete('/student/' + id)
const detail = (id) => instance.auth.get('/student/' + id)
const update = (id, data) => instance.authwithFile.post('/student/' + id + '?_method=PUT', data)
const updateStatus = (id, data) => instance.auth.put('/student/' + id + '/status', data)
const graph = (id) => instance.auth.get('/student/' + id + '/graph')

const apiStudent = {
  create,
  index,
  detail,
  update,
  deleted,
  updateStatus,
  graph
}

export default apiStudent