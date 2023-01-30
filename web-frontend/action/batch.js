import instance from './instance'

const index = (search, limit, page) => instance.auth.get('/batch?search=' + search + '&limit=' + limit + '&page=' + page)
const all = () => instance.auth.get('/batch/all')
const create = (data) => instance.auth.post('/batch', data)
const detail = (id) => instance.auth.get('/batch/' + id)
const update = (id, data) => instance.auth.post('/batch/' + id + "?_method=PUT", data)
const deleted = (id) => instance.auth.delete('/batch/' + id)

const apiBatch = {
  index,
  all,
  create,
  detail,
  update,
  deleted
}

export default apiBatch