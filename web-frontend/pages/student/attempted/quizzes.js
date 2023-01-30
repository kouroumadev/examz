import Layout from "../../../Layout/Layout"
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";
import CardAttempted from "../../../components/Cards/CardAttempted";

export default function Index() {
  const [data, setData] = useState([])
  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.QuizAttemptedAll('')
        .then((res) => {
          setData(res.data.data)
        })
    }
    getData()
  }, [])

  return (
    <div className="mt-12">
      {data.length > 0 && (
        <>
          <p className="ml-4 text-xl">Attempted Quiz </p>
          <div className="flex flex-wrap">
            {data.map((item, index) => (
              <CardAttempted type="quiz" key={index} data={item.quiz} isLive={true}  url={`/student/quizzes/${item.quiz.slug}`} score={`/student/quizzes/${item.quiz.slug}/${item.id}`} isStart={item.start_quiz}/>
              ))}
          </div>
        </>
      )}
    </div>
  )
}


Index.layout = Layout