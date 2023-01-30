import instance from './instance'

const index = () => instance.auth.get('/institute/all')
const create = (data) => instance.auth.post('/institute', data)
const all = (search, limit, page) => instance.auth.get('/institute?search=' + search + '&limit=' + limit + '&page=' + page)
const detail = (id) => instance.auth.get('/institute/' + id)
const update = (id, data) => instance.auth.post('/institute/' + id + "?_method=PUT", data)
const deleted = (id) => instance.auth.delete('/institute/' + id)
const searchBranch = (id, keyword) => instance.auth.get('/institute/' + id + '?search=' + keyword)

const apiInstitute = {
  index,
  create,
  all,
  detail,
  update,
  deleted,
  searchBranch
}

export default apiInstitute