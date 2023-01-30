import CardPractice from "../../../components/Cards/CardPractice"
import Layout from "../../../Layout/Layout"
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";
import CardExams from "../../../components/Cards/CardExams";

export default function Index() {
  const [data, setData] = useState([])
  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.examsRecomendedAll()
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
          <p className="text-xl">Recomended </p>
          <div className="flex flex-wrap justify-around">
            {data.map((item, index) => (
              <CardExams key={index} data={item} url={`/student/exams/${item.slug}`}/>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


Index.layout = Layout