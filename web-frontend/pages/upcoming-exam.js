import Link from "next/link";
import Footer from "../components/footer/footer"
import Header from '../components/Navbar/header';
import { FaAngleRight } from 'react-icons/fa'
import CardExams from "../components/Cards/CardExams";
import { useState, useEffect } from 'react'
import apiLanding from "../action/landingPage";
import {useRouter} from 'next/router'

function UpcomingExam() {
  const Router = useRouter()
  const params = Router.asPath.split('?')[1]
  const [dataUpcoming, setDataUpcoming] = useState([])
  const [isEmpty, setIsEmpty] = useState(false)
  useEffect(() => {
    const getUpcoming = async () => {
      const parameter = params !== undefined ? params : ''
      await apiLanding.paramExamsUpcoming(parameter)
        .then((res) => {
          setDataUpcoming(res.data.data)
          if (res.data.data.length === 0) {
            setIsEmpty(true)
          }
        })
        .catch((err) => {
          // console.log(err)
        })
    }
    getUpcoming()
  }, [])
  return (
    <>
      <Header />
      <div className=" bg-black-8 pt-20 px-4" >
        <div className="pt-4 md:mx-32">
          <div className='flex gap-1'>
            <Link href="/landing">
              <a className='mb-2 text-black-5'>Home</a>
            </Link>
            <FaAngleRight className='mt-1' /> <span className='text-blue-1'>Upcoming Exam</span>
          </div>
          <div className="">
            <div className="flex gap-4 align-text-bottom">
              <h1 className="text-2xl">Upcoming Exams</h1>
            </div>
            <div className=" flex mx-auto flex-wrap my-2">
              {dataUpcoming.map((item, index) => (
                <CardExams key={index} data={item} url={`${item.has_unfinished === 1 ? '/student/exams/' + item.slug + '?id=' + item.result_id : '/student/exams/' + item.slug}`} />
              ))}
            </div>
            {isEmpty && (
              <div>Nothing Upcoming Exams</div>
            )}
          </div>
        </div>
      </div >
      <div className=" -m-4 py-8 bg-black-8"/>
      <Footer />
    </>
  )
}

export default UpcomingExam