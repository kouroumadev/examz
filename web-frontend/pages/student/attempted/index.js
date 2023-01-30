import CardAttempted from "../../../components/Cards/CardAttempted"
import { TitleButton } from "../../../components/Slider/TitleButton"
import Layout from "../../../Layout/Layout"
import Slider from '../../../components/Slider/Slider'
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";

export default function Index() {
  const [dataExamsAttempted, setDataExamsAttempted] = useState([])
  const [dataQuizAttempted, setDataQuizAttempted] = useState([])
  const [dataPractice, setDataPractice] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(async () => {
    const getDataExams = async () => {
      await apiStudentPage.examsAttemptedTake(8)
        .then((res) => {
          setDataExamsAttempted(res.data.data)
          console.log('mm')
          console.log(res.data.data)
        })
    }
    const getDataPractice = async () => {
      await apiStudentPage.practiceAttemptedTake(8)
        .then((res) => {
          setDataPractice(res.data.data)
        })
    }
    const getQuiz = async () => {
      await apiStudentPage.QuizAttemptedAll(8)
        .then((res) => {
          setDataQuizAttempted(res.data.data)
          setIsLoading(false)
        })
    }
    getDataExams()
    getDataPractice()
    getQuiz()
  }, [])
  return (
    <div className="mt-12 min-w-full overflow-x-hidden">
      {/* <input type="text" className="p-2 border text-sm rounded  md:ml-8 mb-4 md:w-1/2 w-full" placeholder="Search" /> */}
      {dataExamsAttempted.length > 0 && (
        <div className="mb-8">
          <TitleButton title="Attempted Exam" url="/student/attempted/exams" count={dataExamsAttempted.length} />
          <Slider ArrowColor="blue" count={dataExamsAttempted.length} >
            {dataExamsAttempted.map((item, index) => (
              <CardAttempted type="exam" key={index} data={item.exam} url={`/student/exams/${item.exam.slug}`} score={`/student/exams/${item.exam.slug}/${item.id}`} status={item.status} isStart={item.start_exam} />
            ))}
          </Slider>
        </div>
      )}
      {dataPractice.length > 0 && (
        <div className="mb-8">
          <TitleButton title="Attempted Practice" url="/student/attempted/practice" count={dataPractice.length} />
          <Slider ArrowColor="blue" count={dataPractice.length} >
            {dataPractice.map((item, index) => (
              <CardAttempted type="practice" key={index} data={item.practice} url={`/student/practice/${item.practice.slug}`} score={`/student/practice/${item.practice.slug}/${item.id}`} status={item.status} />
            ))}
          </Slider>
        </div>
      )}
      {dataQuizAttempted.length > 0 && (
        <div >
          <TitleButton title="Attempted Quizzes" url="/student/attempted/quizzes"  count={dataQuizAttempted.length}/>
          <Slider ArrowColor="blue"  count={dataQuizAttempted.length}>
            {dataQuizAttempted.map((item, index) => (
              <CardAttempted type="quiz" key={index} data={item.quiz}  url={`/student/quizzes/${item.quiz.slug}`} score={`/student/quizzes/${item.quiz.slug}/${item.id}`} isStart={item.start_quiz} status={item.status}/>
            ))}
          </Slider>
        </div>
      )}
      {!isLoading && dataExamsAttempted.length === 0 && dataQuizAttempted.length === 0 && dataPractice.length === 0 && (
        <div className="text-center">You not yet take test</div>
      )}
    </div>
  )
}


Index.layout = Layout