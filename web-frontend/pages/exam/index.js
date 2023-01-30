import Link from 'next/link';
import Header from '../../components/Navbar/header';
import Footer from "../../components/footer/footer";
import { FaAngleRight } from 'react-icons/fa';
import apiLanding from '../../action/landingPage';
import { useState, useEffect } from 'react'
import MainSlider from '../../components/Slider/MainSlider';
import apiExamCategoryType from '../../action/ExamCategoryType';
import { useRouter } from 'next/router'
import CardExams from '../../components/Cards/CardExams'

function Exam() {
  const { asPath } = useRouter()
  const [dataLive, setDataLive] = useState([])
  const [isEmpty, setIsEmpty] = useState(false)
  const [category, setCategory] = useState('')
  const [listCategory, setListCategory] = useState([])
  const [isHaveParams, setIsHaveParams] = useState(asPath.split('?').length > 1 ? true : false)
  const [listExams, setListExams] = useState([])
  const [allDataExams, setAllDataExams] = useState([])
  const [categoryName, setCategoryName] = useState()

  const getLive = async (idCategory, type) => {
    await apiLanding.ExamsLive('', idCategory, type)
      .then((res) => {
        console.log(res.data.data)
        setDataLive(res.data.data)
        if (res.data.data.length === 0) {
          setIsEmpty(true)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getDataExamsbyParams = async (idCategory, idType) => {
    await apiLanding.examsAll('', idCategory, idType)
      .then((res) => {
        console.log(res.data.data)
        setCategoryName(res.data.data[0].exam_category.name)
        setAllDataExams(res.data.data)
        if (res.data.data.length === 0) {
          setIsEmpty(true)
        }
      })
  }

  useEffect(async () => {
    let idCategory = []
    const splitUrl = asPath.split('=')
    console.log(splitUrl.length)
    if (splitUrl.length === 1) {
      getLive('', '')
    }
    if (splitUrl.length === 2) {
      setCategory(splitUrl[1])
      getLive(splitUrl[1], '')
      getDataExamsbyParams(splitUrl[1], '')
      idCategory.push(splitUrl[1])
    }
    if (splitUrl.length === 3) {
      const newSplitCategory = asPath.split('=')[1].split('&')[0]
      const splitType = asPath.split('type=')[1]
      setCategory(newSplitCategory)
      getLive(newSplitCategory, splitType)
      getDataExamsbyParams(newSplitCategory, splitType)
      idCategory.push(newSplitCategory)
    }

  }, [])



  const getDataExams = async (item) => {
    await apiLanding.examsAll(8, item.id, '')
      .then((res) => {
        console.log("hello world")
        console.log(res.data.data)
        if (res.data.data.length > 0) {
          const dataExams = {
            list: res.data.data,
            name: item.name,
            url: '/exam?category=' + item.id
          }
          !isHaveParams ? setListExams([...listExams, dataExams]) : setListExams([])
        }
        console.log(listExams)
      })
  }


  useEffect(() => {
    const getCategory = () => {
      apiExamCategoryType.allCategory()
        .then((res) => {
          res.data.data.map((item) => {
            console.log(item)
            getDataExams(item)
          })
        })
    }
    getCategory()
  }, [])

  return (
    <>
      <Header />
      <div className=" bg-black-8 pt-20 px-4" >
        <div className="py-4 md:mx-32">
          <div className='flex gap-1'>
            <Link href="/landing">
              <a className='mb-8  text-black-5'>Home</a>
            </Link>
            <FaAngleRight className='mt-1' /> <span className='text-blue-1'>Exam</span>
          </div>
          <div className="flex">
            <img src="/asset/icon/ic_live_transparent.png" alt="icon live" className='w-8 h-8 mr-2' />
            <span className="text-2xl mr-2">Live Exams</span>
          </div>
          <div className=" flex mx-auto flex-wrap my-2 ">
            {dataLive.map((item, index) => (
              <CardExams key={index} data={item} url={`${item.has_unfinished === 1 ? '/student/exams/' + item.slug + '?id=' + item.result_id : '/student/exams/' + item.slug}`} />
            ))}
          </div>

          {listExams.map((item, index) => (
            <>
              <MainSlider key={index} title={item.name} data={item.list} urlSeeAll={item.url} type="exams" />
              <div className='my-4' />
            </>
          ))}


          {allDataExams.length > 0 && (
            <>
              <div className='flex justify-between mt-4'>
                <div className="flex">
                  <span className="text-2xl mr-2">{categoryName}</span>
                </div>
              </div>
              <div className=' flex mx-auto flex-wrap gap-2'>
                {allDataExams.map((item, index) => (
                  <CardExams key={index} data={item} url={`${item.has_unfinished === 1 ? '/student/exams/' + item.slug + '?id=' + item.result_id : '/student/exams/' + item.slug}`} />
                ))}
              </div>
            </>
          )}

        </div>
        {isEmpty && (
          <div className='text-center py-4'>Nothing Live Exams</div>
        )}
      </div >
      <Footer />
    </>
  )
}

export default Exam