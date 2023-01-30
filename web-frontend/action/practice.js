import instance from './instance'

const create = (data) => instance.auth.post('/practice', data)
const index = (search, type, status, limit, page) => instance.auth.get('/practice?search=' + search + '&type=' + type +  '&status=' + status + '&limit=' + limit + '&page=' + page)
const deleted = (id) => instance.auth.delete('/practice/' + id)
const detail = (id) => instance.auth.get('/practice/' + id)
const update = (id, data) => instance.auth.post('/practice/' + id + '?_method=PUT', data)
const publish = (id) => instance.auth.put("/practice/" + id + "/publish")
const unpublish = (id) => instance.auth.put("/practice/" + id + "/unpublish")
const deleteQuestion = (id) => instance.auth.delete("/practice-question/" + id)
const detailQuestion = (id) => instance.auth.get('/practice-question/' + id)
const detailSection = (id) => instance.auth.get("/practice-section/" + id)
const createQuestion = (data) => instance.auth.post('/practice-question', data)
const updateQuestion = (id, data) => instance.auth.post('/practice-question/' + id + '?_method=PUT', data)
const detailsectionQuestion = (id) => instance.auth.get('/practice-section-question/' + id)

const apiPractice = {
  create,
  index,
  detail,
  update,
  deleted,
  publish,
  unpublish,
  deleteQuestion,
  detailQuestion,
  detailSection,
  createQuestion,
  updateQuestion,
  detailsectionQuestion
}

export default apiPractice