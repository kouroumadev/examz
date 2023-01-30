import instance from './instance'

const index = (search, status, limit, page) => instance.auth.get('/branch?search=' + search + '&status=' + status + '&limit=' + limit + '&page=' + page)
const all = () => instance.auth.get('/branch/all')
const create = (data) => instance.auth.post('/branch', data)
const detail = (id) => instance.auth.get('/branch/' + id)
const update = (id, data) => instance.auth.post('/branch/' + id + "?_method=PUT", data)
const deleted = (id) => instance.auth.delete('/branch/' + id)
const updateStatus = (id, data) => instance.auth.put('/branch/' + id + '/status', data)

const apiBranch = {
  index,
  all,
  create,
  detail,
  update,
  deleted,
  updateStatus
}

export default apiBranch