import Layout from "../../../Layout/Layout"
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";
import CardAttempted from "../../../components/Cards/CardAttempted";

export default function Index() {
  const [data, setData] = useState([])
  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.examsAttemptedAll()
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
              <CardAttempted type="exam" key={index} data={item.exam}  url={`/student/exams/${item.exam.slug}`} score={`/student/exams/${item.exam.slug}/${item.id}`} status={item.status} isStart={item.start_exam} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}


Index.layout = Layout