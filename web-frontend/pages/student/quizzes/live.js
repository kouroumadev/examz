import CardPractice from "../../../components/Cards/CardPractice"
import Layout from "../../../Layout/Layout"
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";
import CardQuizzes from "../../../components/Cards/CardQuizzes";

export default function Index() {
  const [data, setData] = useState([])
  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.QuizLiveAll('','')
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
          <p className="font-bold text-xl">Quizzes Live </p>
          <div className="flex flex-wrap">
            {data.map((item, index) => (
              <CardQuizzes key={index} data={item}  url={`${item.has_unfinished === 1 ? '/student/quizzes/' + item.slug + '?id=' + item.result_id : '/student/quizzes/' + item.slug}`}   />
            ))}
          </div>
        </>
      )}
    </div>
  )
}


Index.layout = Layout