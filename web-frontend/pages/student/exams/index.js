import Layout from "../../../Layout/Layout"
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";
import MainSlider from '../../../components/Slider/MainSlider'

export default function Index() {
  const [live, setLive] = useState([])
  const [recommended, setRecomended] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.examsLiveTake(8)
        .then((res) => {
          setLive(res.data.data)
        })
    }
    const getRecomended = async () => {
      await apiStudentPage.examsRecomendedTake(8)
        .then((res) => {
          setRecomended(res.data.data)
          setIsLoading(false)
        })
    }
    getData()
    getRecomended()
  }, [])

  return (
    <div className="mt-12 min-w-full overflow-x-hidden">
      {(live.length > 0 || recommended.length > 0) && (
        <>
          {/* <input type="text" className="p-2 border text-sm rounded  md:ml-8 mb-4 md:w-1/2 w-full" placeholder="Search" /> */}
          {live.length > 0 && (
            <>
              <MainSlider title="Live Exams" isLive={true} data={live} urlSeeAll="/student/exams/live" type="exams" />
              <div className="my-4" />
            </>
          )}
          {recommended.length > 0 && (
            <>
              <MainSlider title="Recommended Exams" data={recommended} urlSeeAll="/student/exams/recommended" type="exams" />
            </>
          )}
        </>
      )}
      {isLoading === false && (live.length === 0 && recommended.length === 0) && (
        <div className="text-center">Nothing Exams</div>
      )}
    </div>
  )
}

Index.layout = Layout