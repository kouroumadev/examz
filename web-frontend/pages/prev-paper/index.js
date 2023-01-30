import Link from 'next/link';
import Header from '../../components/Navbar/header';
import Footer from "../../components/footer/footer";
import { FaAngleRight } from 'react-icons/fa';
import MainSlider from '../../components/Slider/MainSlider';
import apiLanding from '../../action/landingPage'
import { useEffect, useState } from 'react';
import apiExamCategoryType from '../../action/ExamCategoryType';
import { useRouter } from 'next/router'
import CardPaper from '../../components/Cards/CardPaper'

function PrevPaper() {
  const Router = useRouter()
  const [isEmpty, setIsEmpty] = useState()
  const [listExams, setListExams] = useState([])
  const [params, setParams] = useState()
  const [isHaveParams, setIsHaveParams] = useState(Router.asPath.split('?').length > 1 ? true : false)
  const [listExamsByCategory, setListExamByCategory] = useState([])
 
  useEffect(() => {
    const getDataByParams = async () => { 
      const url = Router.asPath
      const splitParams = url.split('?')
      if (splitParams.length > 1) {
        setParams(splitParams[1])
      await apiLanding.paramExamsPrevious(splitParams[1])
        .then((res) => {
          if (res.data.data.length > 0) {
            setIsEmpty(false)
            setListExams([])
            setListExamByCategory(res.data.data)
          }
        })
      }
    }
    isHaveParams && getDataByParams()
  }, [params])


  const getDataExams = async (item) => {
    await apiLanding.examsPrev(8, item.id, '')
      .then((res) => {
        if (res.data.data.length > 0) {
          setIsEmpty(false)
          const dataExams = {
            list: res.data.data,
            name: item.name,
            url: '/exam-prev?category=' + item.id
          }
          !isHaveParams ? setListExams([...listExams, dataExams]) : setListExams([])
        }
      })
  }

  useEffect(() => {
    const getCategory = () => {
      apiExamCategoryType.allCategory()
        .then((res) => {
          res.data.data.map((item) => {
            getDataExams(item)
          })
        })
    }
    getCategory()
  }, [])

  return (
    <>
      <Header />
      <div className=" bg-black-8 pb-4 pt-20 px-4" >
        <div className="pt-4 md:mx-32">
          <div className='flex gap-1'>
            <Link href="/landing">
              <a className=' text-black-5'>Home</a>
            </Link>
            <FaAngleRight className='mt-1' /> <span className='text-blue-1'>Prev Paper</span>
          </div>
        </div>
        <div className='py-2 md:mx-32'>
          {listExamsByCategory.length > 0 && (
            <div className=' flex mx-auto flex-wrap gap-4 my-4'>
              {listExamsByCategory.map((item, index) => (
                <CardPaper key={index} data={item} />
                // <div>hello</div>
              ))}
            </div>
          )}
          {listExams.map((item, index) => (
            <>
              <MainSlider key={index} title={item.name} data={item.list} urlSeeAll={item.url} type="paper" />
              <div className='my-4' />
            </>
          ))}
        </div>
        {listExams.length === 0 && listExamsByCategory.length === 0 && (
          <div className="text-center">Nothing Prev Paper</div>
        )}
      </div >
      <Footer />
    </>
  )
}

export async function getServerSideProps(context) {
  return { props: {} }
}

export default PrevPaper