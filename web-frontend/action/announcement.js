import instance from './instance'

const create = (data) => instance.authwithFile.post('/announcement', data)
const index = (search, branch, status, limit, page) => instance.auth.get('/announcement?search=' + search + '&branch=' + branch + '&status=' + status + '&limit=' + limit + '&page=' + page)
const deleted = (id) => instance.auth.delete('/announcement/' + id)
const detail = (id) => instance.auth.get('/announcement/' + id)
const update = (id, data) => instance.authwithFile.post('/announcement/' + id + '?_method=PUT', data)
const updateStatus = (id) => instance.auth.put('/announcement/' + id + '/published')

const apiAnnouncement = {
  create,
  index,
  detail,
  update,
  deleted,
  updateStatus
}

export default apiAnnouncement