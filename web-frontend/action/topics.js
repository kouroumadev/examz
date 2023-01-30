import instance from './instance'

const create = (topic) => instance.auth.post('/topic', topic)
const all = (search, limit, page) => instance.auth.get('/topic?search=' + search + '&limit=' + limit + '&page=' + page)
const update = (id, data) => instance.auth.post('/topic/' + id + "?_method=PUT", data)
const deleted = (id) => instance.auth.delete('/topic/' + id)
const allTopic = () => instance.auth.get('/topic/all')

const apiTopic = {
  create,
  all,
  update,
  deleted,
  allTopic
}

export default apiTopic