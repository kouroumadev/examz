import instance from './instance'

const AllCategory = () => instance.noAuth.get('/exam-category')
const allType = () => instance.noAuth.get('/exam-type')
const create = (data) => instance.auth.post('/exam', data)
const index = (search, type, status, limit, page) => instance.auth.get('/exam?search=' + search + '&type=' + type +  '&status=' + status + '&limit=' + limit + '&page=' + page)
const deleted = (id) => instance.auth.delete('/exam/' + id)
const detail = (id) => instance.auth.get('/exam/' + id)
const update = (id, data) => instance.auth.post('/exam/' + id + '?_method=PUT', data)
const publish = (id) => instance.auth.put("/exam/" + id + "/publish")
const unpublish = (id) => instance.auth.put("/exam/" + id + "/unpublish")
const deleteQuestion = (id) => instance.auth.delete("/exam-question/" + id)
const detailQuestion = (id) => instance.auth.get('/exam-question/' + id)
const detailSection = (id) => instance.auth.get("/exam-section/" + id)
const createQuestion = (data) => instance.auth.post('/exam-question', data)
const updateQuestion = (id, data) => instance.auth.post('/exam-question/' + id + '?_method=PUT', data)
const detailsectionQuestion = (id) => instance.auth.get('/exam-section-question/' + id)

const apiExam = {
  AllCategory,
  allType,
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

export default apiExam