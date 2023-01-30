import instance from './instance'

const indexNews = (take) => instance.noAuth.get('/landing/news?take=' + take)
const showNews = (slug) => instance.noAuth.get('/landing/news/' + slug)
const quizLive = (take) => instance.noAuth.get('/landing/quizzes-live?take=' + take)
const quizPrevious = (take) => instance.noAuth.get('/landing/quizzes-previous?take=' + take)
const showPrevious = (slug, take) => instance.noAuth.get('/landing/quizzes-previous/' + slug + '?take=' + take)
const ExamsLive = (take, category, type) => instance.noAuth.get('/landing/exams-live?category=' + category + '&take=' + take + '&type=' + type)
const ExamsUpcoming = (take, category, type) => instance.noAuth.get('/landing/exams-upcoming?category=' + category + '&take=' + take + '&type=' + type)
const ExamsByType = (take, category) => instance.noAuth.get('/landing/exams-type?category=' + category + '&take=' + take)
const examsPrev = (take, category, type) => instance.noAuth.get('/landing/exams-previous?take=' + take + '&category=' + category + '&type=' + type)
const showPrev = (slug) => instance.noAuth.get('/landing/exams-previous/' + slug)
const examsAll = (take, category, type) => instance.noAuth.get('/landing/exams-category/' + category + '&take=' + take + '&type=' + type)

const paramExamsPrevious = (params) => instance.noAuth.get('/landing/exams-previous?' + params)
const paramExamsUpcoming = (params) => instance.noAuth.get('/landing/exams-upcoming?' + params)

const apiLanding = {
  indexNews,
  showNews,
  quizLive,
  quizPrevious,
  showPrevious,
  ExamsLive,
  ExamsUpcoming,
  ExamsByType,
  examsPrev,
  showPrev,
  examsAll,
  paramExamsPrevious,
  paramExamsUpcoming
}

export default apiLanding