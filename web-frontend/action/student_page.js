import instance from './instance'

const notification = (limit, page) => instance.auth.get('/students/notifications?limit=' + limit + '&page=' + page)
const notificationRead = () => instance.auth.get('/students/notifications/read/all')
const indexNews = () => instance.auth.get('/students/news')
const showNews = (id) => instance.auth.get('/students/news/' + id)
const showExams = (slug) => instance.auth.get('/students/exams/' + slug)
const showExamsTemp = (slug, result_id) => instance.auth.get('/students/exams/' + slug + '/result-temp/' + result_id)
const examsLiveAll = () => instance.auth.get('/students/exams-live')
const examsLiveTake = (total) => instance.auth.get('/students/exams-live?take=' + total)
const examsRecomendedAll = () => instance.auth.get('/students/exams-recommended')
const examsRecomendedTake = (total) => instance.auth.get('/students/exams-recommended?take=' + total)
const examsUpcomingAll = () => instance.auth.get('/students/exams-upcoming')
const examsUpcomingTake = (total) => instance.auth.get('/students/exams-upcoming?take=' + total)
const examsAttemptedAll = () => instance.auth.get('/students/exams-attempted')
const examsAttemptedTake = (total) => instance.auth.get('/students/exams-attempted?take=' + total)
const examsPrevious = () => instance.auth.get('/students/exams-previous')
const examsPreferred = (take) => instance.auth.get('/students/exams-preferred?take=' + take)
const examsGraph = () => instance.auth.get('/students/exams-graph')
const examsGraphFilterDate = (date) => instance.auth.get('/students/exams-graph?date=' + date)
const storeExams = (slug, data) => instance.auth.post('/students/exams/' + slug, data)
const storeExamsQuestion = (slug, data) => instance.auth.post('/students/exams-question/' + slug, data)
const showExamsResult = (slug, id) => instance.auth.get('/students/exams/' + slug + '/result/' + id)
const showExamsResultAnalysis = (slug, id) => instance.auth.get('/students/exams/' + slug + '/result/' + id + '/analysis')
// added
const showExamsResultDetails = (slug, id) => instance.auth.get('/students/exams/' + slug + '/result/' + id + '/details')
// end added

const storePractice = (slug, data) => instance.auth.post('/students/practices/' + slug, data)
const storePracticeQuestion = (slug, data) => instance.auth.post('/students/practices-question/' + slug, data)
const showPractice = (slug) => instance.auth.get('/students/practices/' + slug)
const showPracticeTemp = (slug, result_id) => instance.auth.get('/students/practices/' + slug + '/result-temp/' + result_id)
const practiceAll = () => instance.auth.get('/students/practices')
const practiceTake = (total) => instance.auth.get('/students/practices?take=' + total)
const practiceAttemptedAll = () => instance.auth.get('/students/practices-attempted')
const practiceAttemptedTake = (total) => instance.auth.get('/students/practices-attempted?take=' + total)
const showPracticeResult = (slug, id) => instance.auth.get('/students/practices/' + slug + '/result/' + id)
const showPracticeResultAnalysis = (slug, id) => instance.auth.get('/students/practices/' + slug + '/result/' + id + '/analysis')

const storeQuiz = (slug, data) => instance.auth.post('/students/quizzes/' + slug, data)
const storeQuizQuestion = (slug, data) => instance.auth.post('/students/quizzes-question/' + slug, data)
const showQuiz = (slug) => instance.auth.get('/students/quizzes/' + slug)
const showQuizTemp = (slug, result_id) => instance.auth.get('/students/quizzes/' + slug + '/result-temp/' + result_id)
const QuizAll = (take, topic) => instance.auth.get('/students/quizzes?take=' + take + '&topic=' + topic)
const QuizLiveAll = (take, topic) => instance.auth.get('/students/quizzes-live?take=' + take + '&topic=' + topic)
const QuizAttemptedAll = (take) => instance.auth.get('/students/quizzes-attempted?take=' + take)
const showQuizResult = (slug, id) => instance.auth.get('/students/quizzes/' + slug + '/result/' + id)
const showQuizResultRank = (slug, id) => instance.auth.get('/students/quizzes/' + slug + '/result/' + id + '/rank')

const instituteExams = (take) => instance.auth.get('/students/institutes/exams?take=' + take)
const instituteExamsPast = (take) => instance.auth.get('/students/institutes/exams-past?take=' + take)
const listInstitute = (search, city) => instance.auth.get('/students/institutes?search=' + search + '&city=' + city)
const listInstituteBatch = (idInstitute, idBranch) => instance.auth.get('/students/institutes/' + idInstitute + '/branches/' + idBranch + '/batches')
const listProposalInstitute = (take) => instance.auth.get('/students/institutes/proposal?take=' + take)
const joinInstitute = (data) => instance.auth.post('/students/institutes/join', data)

const preferred = (take) => instance.auth.get('/students/preferreds?take' + take)
const preferredExamStore = (data) => instance.auth.post('/students/preferreds', data)

const checkInstitute = () => instance.auth.get('/students/enrollment/check')

const apiStudentPage = {
  checkInstitute,
  preferred,
  preferredExamStore,
  instituteExams,
  instituteExamsPast,
  listInstitute,
  listInstituteBatch,
  listProposalInstitute,
  joinInstitute,
  notification,
  notificationRead,
  indexNews,
  showExams,
  showExamsTemp,
  showNews,
  examsLiveAll,
  examsLiveTake,
  storeExams,
  storeExamsQuestion,
  examsRecomendedAll,
  examsRecomendedTake,
  examsUpcomingAll,
  examsUpcomingTake,
  examsAttemptedAll,
  examsAttemptedTake,
  examsPrevious,
  examsPreferred,
  examsGraph,
  examsGraphFilterDate,
  showExamsResult,
  showExamsResultAnalysis,
  showExamsResultDetails,
  storePractice,
  showPractice,
  showPracticeTemp,
  practiceAll,
  practiceTake,
  practiceAttemptedAll,
  practiceAttemptedTake,
  showPracticeResult,
  showPracticeResultAnalysis,
  showQuizResultRank,
  storeQuiz,
  storeQuizQuestion,
  showQuiz,
  showQuizTemp,
  showQuizResult,
  QuizAttemptedAll,
  QuizAll,
  QuizLiveAll,
  storePracticeQuestion
}

export default apiStudentPage