import CardPractice from "../../../components/Cards/CardPractice"
import Layout from "../../../Layout/Layout"
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";

export default function Index() {
  const [practiceData, setPracticeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.practiceAll()
        .then((res) => {
          setPracticeData(res.data.data)
          setIsLoading(false)
        })
    }
    getData()
  }, [])

  return (
    <div className="mt-12">
      {practiceData.length > 0 && (
        <div className="">
          <p className="text-2xl">Practice Test </p>
          <div className="flex mx-auto justify-around md:justify-start">
            <div className="flex  flex-wrap">
              {practiceData.map((item, index) => (
                <CardPractice key={index} data={item} url={`${item.has_unfinished === 1 ? '/student/practice/' + item.slug + '?id=' + item.result_id : '/student/practice/' + item.slug}`} />
              ))}
            </div>
          </div>
        </div>
      )}
      {!isLoading && practiceData.length === 0 && (
        <div className="text-center">
          Nothing Practice Test
        </div>
      )}
    </div>
  )
}


Index.layout = Layout