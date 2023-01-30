import Layout from "../../../Layout/Layout"
import CardNews from "../../../components/Cards/CardNews"
import apiStudentPage from "../../../action/student_page"
import { useEffect, useState } from 'react'

export default function Index() {
  const [dataNews, setDataNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getData = async () => {
      await apiStudentPage.indexNews()
        .then((res) => {
          console.log(res.data.data)
          setDataNews(res.data.data)
          setIsLoading(false)
        })
        .catch((err) => {
          // console.log(err)
        })
    }
    getData()
  }, [])

  return (
    <div className="mt-12 ">
      {dataNews.length > 0 && (
        <>
          <h1 className="text-2xl pl-2">All News</h1>
          {dataNews.map((item) => (
            <CardNews key={item} dataNews={item} url={`/student/news/${item.slug}`} />
          ))}
        </>
      )}
      {(!isLoading && dataNews.length === 0) && (
        <div className="text-center">Nothing News</div>
      )}
    </div>
  )
}

Index.layout = Layout