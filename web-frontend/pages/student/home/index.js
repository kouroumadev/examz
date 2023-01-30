import { TitleButton } from "../../../components/Slider/TitleButton"
import Layout from "../../../Layout/Layout"
import Slider from '../../../components/Slider/Slider'
import MainSlider from "../../../components/Slider/MainSlider"
import CardNews from '../../../components/Cards/CardNews'
import Image from "next/image"
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useEffect, useState } from 'react'
import apiStudentPage from "../../../action/student_page"
import Link from "next/link"

export default function Index() {
  const [examPrevious, setExamPrevious] = useState({})
  const [recommended, setRecommended] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [quiz, setQuiz] = useState([])
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewGraph, setViewGraph] = useState(false)
  const [dataChart, setDataChart] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: []
      }
    },
    series: [{
      name: "series-1",
      data: []
    }]
  })

  useEffect(() => {
    const getExamPrevious = async () => {
      await apiStudentPage.examsPrevious()
        .then((res) => {
          setExamPrevious(res.data.data)
        })

    }
    const getDataGraph = async () => {
      await apiStudentPage.examsGraph()
        .then((res) => {
          if (res.data.data.length > 0) {
            setViewGraph(true)
          }
          const date = []
          const score = []
          res.data.data.map((item) => {
            date.push(item.created_at)
            score.push(item.score)
          })
          const data = {
            options: {
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: date
              }
            },
            series: [
              {
                name: "series-1",
                data: score
              }
            ]
          }
          setDataChart(data)
        })
    }
    const getRecommended = async () => {
      await apiStudentPage.examsRecomendedAll(8)
        .then((res) => {
          setRecommended(res.data.data)
          // setIsLoading(false)
        })
        .catch((err) => {
          // console.log(err)
        })
    }
    const getUpcoming = async () => {
      await apiStudentPage.examsUpcomingTake(8)
        .then((res) => {
          setUpcoming(res.data.data)
          // setIsLoading(false)
        })
        .catch((err) => {
          // console.log(err)
        })
    }
    const getQuiz = async () => {
      await apiStudentPage.QuizLiveAll(8, '')
        .then((res) => {
          setQuiz(res.data.data)
          // setIsLoading(false)
        })
        .catch((err) => {
          // console.log(err)
        })
    }
    const getNews = async () => {
      await apiStudentPage.indexNews()
        .then((res) => {
          // setNews(res.data.data)
          setIsLoading(false)
        })
        .catch((err) => {
          // console.log(err)
        })
    }
    getExamPrevious()
    getDataGraph()
    getRecommended()
    getUpcoming()
    getQuiz()
    getNews()
  }, [])

  return (
    <div className="mt-12 min-w-full overflow-x-hidden">

      {viewGraph && (
        <div className="flex flex-wrap md:h-80 mb-8">
          <div className=" md:w-2/3 w-full  p-4">
            <h1 className="font-bold text-xl">Graph Performance</h1>
            <Chart
              options={dataChart?.options}
              series={dataChart?.series}
              type="bar"
              height={280}
            />
          </div>

          {examPrevious?.exam?.name && (
            <div className="md:w-1/3 w-full bg-white pb-4 rounded-lg md:h-72">
              <div className="bg-blue-1 text-white rounded-t-lg px-4 py-2">
                <h1 className="text-1xl">Previous Exam</h1>
                <h1 className="font-bold md:hidden text-lg">{examPrevious?.exam?.name}</h1>
                <h1 className="font-bold hidden md:flex text-lg">{examPrevious?.exam?.name.length > 20 ? examPrevious?.exam?.name.substring(0, 20) + "..." : examPrevious?.exam?.name}</h1>
              </div>
              <div className="px-4 mt-1 flex">
                <div className="flex w-full gap-4">
                  <Image src="/asset/icon/table/ic_duration.svg" height={28} width={28} alt="icon correct" />
                  <div>
                    <div className="text-black-4">Duration</div>
                    <div className="text-black-1">{examPrevious?.exam?.duration} mins</div>
                  </div>
                </div>
                <div className="flex w-full gap-4">
                  <Image src="/asset/icon/table/ic_total_section.svg" height={28} width={28} alt="icon correct" />
                  <div>
                    <div className="text-black-4">Total Section</div>
                    <div className="text-black-1">{examPrevious?.exam?.total_section} Section</div>
                  </div>
                </div>
              </div>
              <h1 className="px-4 font-bold">Result</h1>
              <div className="flex px-4 text-sm">
                <div className="w-full">
                  <div className="flex gap-4">
                    <Image src="/asset/icon/table/ic_correct.svg" height={28} width={28} alt="icon correct" />
                    <div>
                      <p className="text-black-4">Correct</p>
                      <p className="font-bold">{examPrevious?.correct}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Image src="/asset/icon/table/ic_incorrect.svg" height={28} width={28} alt="icon correct" />
                    <div>
                      <p className="text-black-4">Incorrect</p>
                      <p className="font-bold">{examPrevious?.incorrect}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex gap-4">
                    <Image src="/asset/icon/table/ic_score.svg" height={28} width={28} alt="icon correct" />
                    <div>
                      <p className="text-black-4">Score</p>
                      <p className="font-bold">{examPrevious?.score}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Image src="/asset/icon/table/ic_accuracy.svg" height={28} width={28} alt="icon correct" />
                    <div>
                      <p className="text-black-4">Accuracy</p>
                      <p className="font-bold">{examPrevious?.accuracy}</p>
                    </div>
                  </div>
                </div>
              </div>
            
              <Link href={`/student/exams/${examPrevious.exam.slug}/${examPrevious.id}`}  >
                <a className="flex px-4 w-full mt-4">
                  <button className={`bg-white w-full  text-blue-1 border border-blue-1  p-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`}>View Score</button>
                </a>
              </Link>
            </div>
          )}
        </div>
      )}
      {recommended.length > 0 && (
        <div className="mb-8">
          <MainSlider title="Recommended Exams" data={recommended} urlSeeAll="/student/exams/recommended" type="exams" />
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="mb-8">
          <MainSlider title="Upcoming Exams" data={upcoming} urlSeeAll="/student/exams/upcoming" type="exams" />
        </div>
      )}
      <div className="my-8" />
      {quiz.length > 0 && (
        <div className="mb-8">
          <MainSlider title="Live Quizzes" isLive={true} data={quiz} urlSeeAll="/student/quizzes/live" type="quiz" />
        </div>
      )}
      <div className="my-8" />
      {news.length > 0 && (
        <div className="mt-4">
          <TitleButton title="News" url="/student/news" />
          <Slider ArrowColor="blue" count={news.length} >
            {news.map((item, index) => {
              return (
                <CardNews key={index} dataNews={item} url={`/student/news/${item.slug}`} />
              )
            })}
          </Slider>
        </div>
      )}
      {!isLoading && (!viewGraph && recommended.length === 0 && upcoming.length === 0 && quiz.length === 0 && news.length === 0) && (
        <div className="text-center">
          Nothing Data
        </div>
      )}
    </div>
  )
}


Index.layout = Layout