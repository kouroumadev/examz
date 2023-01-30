import Layout from "../../../Layout/Layout"
import apiStudentPage from "../../../action/student_page"
import { useState, useEffect } from "react";
import MainSlider from "../../../components/Slider/MainSlider"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select
} from '@chakra-ui/react'
import Button from "../../../components/Button/button";
import Image from "next/image";
import apiExamCategoryType from '../../../action/ExamCategoryType'

export default function Index() {
  const [dataPreferred, setDataPreferred] = useState([])
  const [liveExam, setLiveExam] = useState([])
  const [quiz, setQuiz] = useState([])
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [listPreferred, setListPreferred] = useState([])
  const [allCategory, setAllCategory] = useState([])
  const [renderListPreferred, setRenderListPreferred] = useState(false)

  useEffect(async () => {
    const getPreferred = async () => {
      await apiStudentPage.examsPreferred(8)
        .then((res) => {
          setDataPreferred(res.data.data)
        })
    }
    const getLiveExam = async () => {
      await apiStudentPage.examsLiveTake(8)
        .then((res) => {
          setLiveExam(res.data.data)
          // setIsLoading(false)
        })
    }
    const getQuiz = async () => {
      await apiStudentPage.QuizLiveAll(8, '')
        .then((res) => {
          setQuiz(res.data.data)
          // setIsLoading(false)
        })
    }
    const getNews = async () => {
      await apiStudentPage.examsLiveTake(8)
        .then((res) => {
          setNews(res.data.data)
          setIsLoading(false)
        })
    }
    getPreferred()
    getLiveExam()
    getQuiz()
    getNews()
  }, [renderListPreferred])

  useEffect(() => {
    const getAllCategory = async () => {
      await apiExamCategoryType.allCategory()
        .then((res) => {
          setAllCategory(res.data.data)
        })
    }
    getAllCategory()
  }, [])

  const getListPreferred = async () => {
    await apiStudentPage.preferred(8)
      .then((res) => {
        setListPreferred([...res.data.data])
      })
  }

  useEffect(() => {
    const getListPreferred = async () => {
      await apiStudentPage.preferred(8)
        .then((res) => {
          setListPreferred(res.data.data)
        })
    }
    getListPreferred()
  }, [renderListPreferred])

  const onSelectPreferred = (item) => {
    if (item === '') {
      return;
    }
    let select = []
    let arr = listPreferred
    allCategory.map((itemCategory) => {
      if (itemCategory.id.toString() === item) {
        if (select.length === 0) {
          select.push(itemCategory)
        } else {
          select.unshift(itemCategory)
        }
      }
    })
    if (listPreferred.length > 0) {
      const available = []
      listPreferred.map((itemPreferred) => {
        if (itemPreferred.name !== select[0]?.name) {
          available.push(select[0])
        }
      })
      if (available.length === listPreferred.length) {
        arr.push(select[0])
      }
    }
    if (listPreferred.length === 0) {
      arr.push(select[0])
    }
    setListPreferred([...arr])
  }

  const onRemovePreferred = async (id, index) => {
    let newArr = listPreferred
    newArr.splice(index, 1)
    setListPreferred([...newArr])
  }

  const onSave = async () => {
    const data = new FormData()
    if (listPreferred) {
      for (let i = 0; i < listPreferred.length; i++) {
        const field = `exam_categories[${i}]`
        data.append(`${field}`, listPreferred[i].id)
      }
    }
    await apiStudentPage.preferredExamStore(data)
      .then((res) => {
        getListPreferred()
        setRenderListPreferred(!renderListPreferred)
      })
  }

  return (
    <div className="mt-12 min-w-full overflow-x-hidden">
      <div className="flex flex-row-reverse">
        <button className={`flex text-blue-1 border border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl `} onClick={() => {
          setRenderListPreferred(!renderListPreferred)
          onOpen()
        }}>Edit Exam Preferrence</button>
      </div>
      {/* <input type="text" className="p-2 border text-sm rounded  md:ml-8 mb-4 md:w-1/2 w-full" placeholder="Search" /> */}
      {dataPreferred.length > 0 && (
        <div className="mb-8">
          <MainSlider title="Your Preferred Exams" data={dataPreferred} urlSeeAll="/student/exams/preferred" type="exams" />
        </div>
      )}
      {liveExam.length > 0 && (
        <div className="mb-8">
          <MainSlider title="Live Exams" isLive={true} data={liveExam} urlSeeAll="/student/exams/live" type="exams" />
        </div>
      )}
      {quiz.length > 0 && (
        <div className="mb-8">
          <MainSlider title="Live Quizzes" isLive={true} data={quiz} urlSeeAll="/student/quizzes" type="quiz" />
        </div>
      )}
      {!isLoading && (dataPreferred.length === 0 && liveExam.length === 0 && quiz.length === 0 && news.length === 0) && (
        <div className="text-center">Goals is Empty</div>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="medium"><center>Preferred Exams</center> </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <div className="w-1/2 p-2">
                <Select size="sm" defaultValue="" variant='outline' onClick={(e) => onSelectPreferred(e.target.value)}>
                  <option value="" >Choose Exam type</option>
                  {allCategory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {/* <img className="w-8 h-8 my-auto" src="/asset/icon/table/ic_preferred.svg" /> */}
                      {item?.name}

                    </option>
                  ))}
                </Select>
              </div>
              <div className="text-sm flex flex-wrap">
                {listPreferred.map((item, index) => (
                  <div key={index} className={`flex flex-wrap my-2 w-1/2 gap-4 p-2 text-sm cursor-pointer`} >
                    <div className={` bg-blue-6 flex  border rounded  w-full p-2 gap-2 justify-between`}>
                      <div className="flex gap-2">
                        <img className="w-8 h-8 my-auto" src="/asset/icon/table/ic_preferred.svg" />
                        <h1 className="font-bold my-auto">{item?.name}</h1>
                      </div>
                      <button>
                        <Image src="/asset/icon/table/fi_trash-2.svg" width={16} height={16} alt="icon edit" onClick={() => {
                          onRemovePreferred(item.id, index)
                          onOpen()
                        }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          </ModalBody>
          <ModalFooter>
            <button className="flex text-blue-1 border-blue-1 py-2 px-4 cursor-pointer font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl mr-4" onClick={onClose}>
              Discard
            </button>
            <div onClick={() => {
              onSave()
              onClose()
            }}><Button title="Close and Save" /></div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}


Index.layout = Layout