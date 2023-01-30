import { TitleButton } from "../../../components/Slider/TitleButton"
import Layout from "../../../Layout/Layout"
import Slider from '../../../components/Slider/Slider'
import CardQuizzes from '../../../components/Cards/CardQuizzes'
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";
import MainSlider from "../../../components/Slider/MainSlider"

export default function Index() {
  const [liveQuiz, setLiveQuiz] = useState([])
  const [QuizAll, setQuizAll] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(async () => {
    const getLive = async () => {
      await apiStudentPage.QuizLiveAll(8, '')
        .then((res) => {
          setLiveQuiz(res.data.data)
        })
    }
    const getAll = async () => {
      await apiStudentPage.QuizAll(8, '')
        .then((res) => {
          setQuizAll(res.data.data)
          setIsLoading(false)
        })
    }
    getLive()
    getAll()
  }, [])
  return (
    <div className="mt-12 min-w-full overflow-x-hidden">
      {/* <input type="text" className="p-2 border text-sm rounded  md:ml-8 mb-4 md:w-1/2 w-full" placeholder="Search" /> */}
      {liveQuiz.length > 0 && (
        <div div className="mb-8">
          <MainSlider title="Live Quizzes" isLive={true} data={liveQuiz} urlSeeAll="/student/quizzes/live" type="quiz" />              <div className="my-4" />
        </div>
      )}
      {QuizAll.length > 0 && (
        <>
          <p className="text-2xl md:pl-3">All Quiz</p>
          <div className="flex flex-wrap md:pl-3 justify-center md:justify-start">
            {QuizAll.map((item, index) => (
              <CardQuizzes key={index} data={item} url={`/student/quizzes/${item.slug}`} />
            ))}
          </div>
        </>
      )}
      {!isLoading && liveQuiz.length === 0 && QuizAll.length === 0 && (
        <div className="text-center">Nothing Quizzes</div>
      )}
    </div>
  )
}


Index.layout = Layout