import Layout from "../../../Layout/Layout"
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";
import CardAttempted from "../../../components/Cards/CardAttempted";

export default function Index() {
  const [data, setData] = useState([])
  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.practiceAttemptedAll()
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
          <p className="ml-2 text-xl">Attempted Exams</p>
          <div className="flex flex-wrap">
            {data.map((item, index) => (
              <CardAttempted type="practice" key={index} data={item.practice}  url={`/student/practice/${item.practice.slug}`} score={`/student/practice/${item.practice.slug}/${item.id}`}  status={item.status} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}


Index.layout = Layout