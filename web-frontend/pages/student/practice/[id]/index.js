import LayoutTest from "../../../../Layout/LayoutTest"
import apiStudentPage from "../../../../action/student_page"
import { useState, useEffect, useLayoutEffect } from "react";
import Card from '../../../../components/Cards/Card'
import Image from "next/image"
import GeneralInstruction from "../../../../components/Section/generalInstruction"
import Button from "../../../../components/Button/button";
import Link from "next/link";
import { MyTimerPractice } from '../../../../components/Timer/MyTimer'
import { useRouter } from "next/router";
import { useDisclosure } from '@chakra-ui/react'
import { FaAngleLeft } from "react-icons/fa";
import AnswerCount from "../../../../components/Navbar/AnswerCount";
import NavigationQuestion from "../../../../components/Navbar/QuestionNavigation";
import { ModalSubmitTest } from "../../../../components/Modal/ModalSubmitTest";
import { ModalNextSection } from "../../../../components/Modal/ModalNextSection";

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}


export default function Index() {
  const Router = useRouter()
  const { id } = Router.query
  const [width, height] = useWindowSize();
  const [dataExams, setDataExams] = useState({
    sections: [{
      question_items: [{
        options: [{
          selected: 0
        }]
      }]
    }]
  })
  const [currentStep, setCurrentStep] = useState()
  const [activeSection, setActiveSection] = useState()
  const [activeSectionId, setActiveSectionId] = useState(0)
  const [activeQuestionId, setActiveQuestionId] = useState(0)
  const [sectionInstruction, setSectionInstruction] = useState(false)
  const [questionPaper, setQuestionPaper] = useState(false)
  const [duration, setDuration] = useState()
  const [reviewSubmit, setReviewSubmit] = useState([])
  const [renderCount, setRenderCount] = useState(false)
  const [remaining, setRemaining] = useState()
  const [firstInstruction, setFirstInstruction] = useState(false)
  const [pausePractice, setPausePractice] = useState(false)
  const [resultId, setResultId] = useState(Router.asPath.split("=")[1])
  const [durationTotal, setDurationTotal] = useState()
  const time = new Date();
  const totalTime = new Date()
  const [isSubmit, setIsSubmit] = useState(false)
  const [durationType, setDurationType] = useState()
  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()
  const {
    isOpen: isNextSectionModal,
    onOpen: onOpenNextSectionModal,
    onClose: onCloseNextSectionModal
  } = useDisclosure()

  useEffect(async () => {
    const getDataContinue = async (resultId) => {
      await apiStudentPage.showPracticeTemp(id, resultId)
        .then((res) => {
          setCurrentStep(2)
          setDataExams(res.data.data.practice)
          setActiveSectionId(res.data.data.current_section)
          setActiveQuestionId(res.data.data.current_item)
          setActiveSection(res.data.data.practice.sections[res.data.data.current_section].name)
          if (res.data.data.practice.duration !== null) {
            setDurationType('total')
            setDurationTotal(res.data.data.practice.duration)
          } else {
            console.log("section time ")
            setDurationType('section')
            setDuration(res.data.data.practice.sections[res.data.data.current_section].duration)
            // console.log(res.data.data.practice.sections[res.data.data.current_section].duration)
          }
          console.log(dataExams.sections)
          const Rsubmit = []
          res.data.data.practice.sections.map((item) => {
            const dataResult = {
              name: item.name,
              total: item.question_items.length,
              answered: 0,
              notAnswered: 0,
              marked: 0,
              markedSave: 0,
              answeredSave: 0,
              notVisited: item.question_items.length,
              markedAndAnswered: 0
            }
            Rsubmit.push(dataResult)
          })
          setReviewSubmit(Rsubmit)
          const temp = res.data.data.practice.sections
          temp.map((itemSection) => {
            itemSection.question_items.map((itemQ) => {
              itemQ.status = 'not_answered'
              itemQ.options.map((optionQ) => {
                if (optionQ.selected === 1) {
                  optionQ.selected = 1
                  itemQ.status = 'answered'
                }
              })
            })
          })
          const tempExam = dataExams
          tempExam.sections = temp
          setDataExams({ ...tempExam })
          setRenderCount(!renderCount)
        })
    }
    const getData = async () => {
      await apiStudentPage.showPractice(id)
        .then((res) => {
          if (res.data.message === 'Please continue the unfinished practice') {
            setResultId(res.data.data.resultId)
            getDataContinue(res.data.data.resultId)
          } else {
            setCurrentStep(1)
            setDataExams(res.data.data)
            setActiveSection(res.data.data.sections[0].name)
            if (res.data.data.duration !== null) {
              setDurationType('total')
            } else {
              setDurationType('section')
            }
            const Rsubmit = []
            res.data.data.sections.map((item) => {
              const dataResult = {
                name: item.name,
                total: item.question_items.length,
                answered: 0,
                notAnswered: 0,
                marked: 0,
                markedSave: 0,
                answeredSave: 0,
                notVisited: item.question_items.length,
                markedAndAnswered: 0
              }
              Rsubmit.push(dataResult)
            })
            setReviewSubmit(Rsubmit)

          }

        })
    }
    resultId !== undefined ? getDataContinue(resultId) : getData()
  }, [])

  useEffect(async () => {
    time.setSeconds(time.getSeconds() + dataExams.sections[activeSectionId].duration * 60);
  }, [duration])

  useEffect(async () => {
    totalTime.setSeconds(time.getSeconds() + durationTotal * 60);
  }, [durationTotal])

  const submitTest = async () => {
    const temp = dataExams
    dataExams.sections.map((itemSection) => {
      itemSection.question_items.map((item) => {
        if (item.answer_type === 'multiple') {
          if (item.status === 'answered' || item.status === 'marked_and_answered') {
            item.options.map((itemOption) => {
              itemOption.selected = itemOption.selected === 1 ? 1 : 0
            })
          }
        }
      })
    })
    const data = JSON.stringify(temp)
    const res = {
      data: data
    }
    console.log(res)
    await apiStudentPage.storePractice(id, res)
      .then((res) => {
        Router.push('/student/practice/' + id + "/" + res.data.data.id)
      })
  }

  useEffect(() => {
    const countReviewResult = () => {
      dataExams.sections.map((itemSection) => {
        let answerCount = []
        let marked = []
        // for remaining
        let answeredSave = []
        let notAnsweredSave = []
        let markedSave = []
        let markedAndAnswered = []
        itemSection.question_items.map((itemQuestion) => {
          if (itemQuestion.status === 'answered') {
            answerCount.push("answer")
            answeredSave.push("save answer")

          }
          if (itemQuestion.status === 'marked') {
            marked.push("marked")
            markedSave.push("markedSave")
          }
          if (itemQuestion.status === 'marked_and_answered') {
            markedAndAnswered.push("marked and answered")
            marked.push("marked")
            answerCount.push("answer")
          }
          if (itemQuestion.status === 'not_answered') {
            notAnsweredSave.push("not answered")
          }
        })
        if(answeredSave.length > 0){
          setIsSubmit(true)
        }
        let temp = reviewSubmit
        temp.map((item) => {
          if (item.name === itemSection.name) {
            item.name = item.name,
              item.total = item.total,
              item.answered = answerCount.length,
              item.notAnswered = item.total - answerCount.length,
              item.marked = marked.length
            // for remaining
            item.notVisited = item.total - answeredSave.length - notAnsweredSave.length - markedSave.length - markedAndAnswered.length
            item.answeredSave = answeredSave.length
            item.notAnswered = notAnsweredSave.length
            item.markedSave = markedSave.length
            item.markedAndAnswered = markedAndAnswered.length
          } else {
            item
          }
        })
        setReviewSubmit([...temp])
      })
    }
    countReviewResult()
  }, [renderCount])

  const onNextSection = async () => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        itemQ.status = 'not_answered'
        itemQ.options.map((optionQ) => {
          if (optionQ.selected === 1) {
            optionQ.selected = 1
            itemQ.status = 'answered'
          } else {
            optionQ.selected = 0
          }
        })
      } else {
        itemQ
      }
    })

    const dataQuestionItem = {
      remaining_minute: remaining,
      current_section: activeSectionId,
      current_item: activeQuestionId,
      ...temp[activeQuestionId]
    }
    const data = JSON.stringify(dataQuestionItem)
    const res = {
      data: data
    }
    await apiStudentPage.storePracticeQuestion(id, res)
    const tempExam = dataExams
    tempExam.sections.map((itemSection) => {
      if (itemSection.id === dataExams.sections[activeSectionId].id) {
        itemSection.question_items = temp
      }
    })
    setDataExams({ ...tempExam })
    setActiveSectionId(activeSectionId + 1)
    setActiveSection(dataExams.sections[activeSectionId + 1].name)
    setActiveQuestionId(0)
    setSectionInstruction(true)
    setRenderCount(!renderCount)
    if (durationType === 'section') {
      setFirstInstruction(true)
      setDuration('')
    }
  }

  const onSingleAnswer = (itemAnswer, indexAnswer) => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        itemQ.options.map((optionQ) => {
          if (optionQ.id === itemAnswer.id) {
            if (itemAnswer.selected === 1) {
              optionQ.selected = 0
            } else {
              optionQ.selected = 1
            }
          } else {
            for (let i = 0; i < itemQ.options.length; i++) {
              if (i !== indexAnswer) {
                optionQ.selected = 0
              }
            }
          }
        })
      } else {
        itemQ
      }
    })
    const tempExam = dataExams
    tempExam.sections.map((itemSection) => {
      if (itemSection.id === dataExams.sections[activeSectionId].id) {
        itemSection.question_items = temp
      }
    })
    setDataExams({ ...tempExam })
  }

  const onMultipleAnswer = (itemAnswer, indexAnswer) => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        itemQ.options.map((optionQ) => {
          if (optionQ.id === itemAnswer.id) {
            const tempCorrect = optionQ.selected
            optionQ.selected = tempCorrect === 1 ? 0 : 1
          }
        })
      } else {
        itemQ
      }
    })
    const tempExam = dataExams
    tempExam.sections.map((itemSection) => {
      if (itemSection.id === dataExams.sections[activeSectionId].id) {
        itemSection.question_items = temp
      }
    })
    setDataExams({ ...tempExam })
  }

  const onMarkAndNextQuestion = () => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        itemQ.status = 'marked'
        itemQ.options.map((optionQ) => {
          if (optionQ.selected === 1) {
            optionQ.selected = 1
            itemQ.status = 'marked_and_answered'
          }
        })
      } else {
        itemQ
      }
    })
    const tempExam = dataExams
    tempExam.sections.map((itemSection) => {
      if (itemSection.id === dataExams.sections[activeSectionId].id) {
        itemSection.question_items = temp
      }
    })
    setDataExams({ ...tempExam })
    if (dataExams.sections[activeSectionId].question_items.length !== activeQuestionId + 1) {
      setActiveQuestionId(activeQuestionId + 1)
    }
  }

  const onSaveAndNextQuestion = async () => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        itemQ.status = 'not_answered'
        itemQ.options.map((optionQ) => {
          if (optionQ.selected === 1) {
            optionQ.selected = 1
            itemQ.status = 'answered'
          } else {
            optionQ.selected = 0
          }
        })
      } else {
        itemQ
      }
    })

    const dataQuestionItem = {
      remaining_minute: remaining,
      current_section: activeSectionId,
      current_item: activeQuestionId,
      ...temp[activeQuestionId]
    }
    const data = JSON.stringify(dataQuestionItem)
    const res = {
      data: data
    }
    await apiStudentPage.storePracticeQuestion(id, res)
    const tempExam = dataExams
    tempExam.sections.map((itemSection) => {
      if (itemSection.id === dataExams.sections[activeSectionId].id) {
        itemSection.question_items = temp
      }
    })
    setDataExams({ ...tempExam })
    setActiveQuestionId(activeQuestionId + 1)
    setRenderCount(!renderCount)
  }


  const onSaveLastQuestionSection = async () => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        itemQ.status = 'not_answered'
        itemQ.options.map((optionQ) => {
          if (optionQ.selected === 1) {
            optionQ.selected = 1
            itemQ.status = 'answered'
          }
        })
      } else {
        itemQ
      }
    })

    const dataQuestionItem = {
      remaining_minute: remaining,
      current_section: activeSectionId,
      current_item: activeQuestionId,
      ...dataExams.sections[activeSectionId].question_items[activeQuestionId]
    }
    const data = JSON.stringify(dataQuestionItem)
    const res = {
      data: data
    }
    console.log(res)
    await apiStudentPage.storePracticeQuestion(id, res)
      .then((res) => console.log(res))
    console.log(res)
    const tempExam = dataExams
    tempExam.sections.map((itemSection) => {
      if (itemSection.id === dataExams.sections[activeSectionId].id) {
        itemSection.question_items = temp
      }
    })
    setDataExams({ ...tempExam })
    setRenderCount(!renderCount)
  }

  const onpausePractice = () => {
    setPausePractice(!pausePractice)
  }

  return (
    <div className="md:mt-12 min-w-full overflow-x-hidden">
      {currentStep === 1 && (
        <>
          <div className="flex bg-white md:hidden shadow-lg border-b flex-row top-0 fixed w-full">
            <Link href="/student/practice">
              <a>
                <FaAngleLeft className="m-4" />
              </a>
            </Link>
            <div className="font-bold text-2xl m-2">{dataExams.name}</div>
          </div>
          <div className="my-12 md:hidden" />
          <GeneralInstruction />
        </>)}

      {currentStep === 2 && (
        <>
          {width < 768 && (
            <div className="flex bg-white md:hidden justify-between p-2 flex-row fixed w-full">
              <div className="font-bold text-2xl m-2">{dataExams.name}</div>
              {durationType === 'total' ? (
                <>
                  {!firstInstruction && (
                    <MyTimerPractice onPause={onpausePractice} newExpiry={totalTime} rerender={durationTotal} isPractice={true} remaining={(data) => setRemaining(data)} isLastSection={true} onFinish={submitTest} />
                  )}
                </>
              ) : (
                <>
                  {!firstInstruction && (
                    <div className="flex bg-blue-6 p-2 rounded">
                      <div className="inline-block my-auto bg-blue-5">
                        <MyTimerPractice onPause={onpausePractice} newExpiry={time} rerender={duration} remaining={(data) => setRemaining(data)} isLastSection={dataExams.sections.length === activeSectionId + 1 ? true : false} onNextSection={onNextSection} onFinish={submitTest} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div className="flex gap-4 md:mt-0 mt-16">
            <div className="w-full  md:pr-4">
              <div className="flex  gap-4 bg-white md:rounded-lg pt-4 px-4 mb-4">
                {dataExams.sections.map((item, index) => (
                  <div key={index} className={` ${activeSection === item.name ? 'text-blue-1 border-b-2 border-blue-1 font-bold' : 'text-black-5'}  pb-4`}>
                    {item?.name}
                  </div>
                ))}
              </div>
              <div className="flex overflow-x-scroll p-1 md:hidden ">
                {dataExams.sections[activeSectionId].question_items.map((item, index) => (
                  <div key={index} id={index}>
                    <div key={index} className={` 
                    ${index === activeQuestionId && 'rounded-t-full bg-purple-1 border-purple-2 border-1'} 
                    ${item.status === 'marked' && index !== activeQuestionId && 'bg-purple-1 rounded-full border-1 border-purple-2'} 
                    ${item.status === 'marked_and_answered' && index !== activeQuestionId && 'relative bg-purple-100 rounded-full border-1 border-purple-2'} 
                    ${item.status === 'answered' && index !== activeQuestionId && 'bg-green-3 rounded-t-full border-1 border-green-1'}
                    ${item.status === 'not_answered' && index !== activeQuestionId && 'bg-red-2 rounded-b-full border-1 border-red-1'}
                    cursor-pointer flex-nowrap w-8 flex  h-8 border text-xs m-1`} onClick={() => {
                        !pausePractice && setActiveQuestionId(index)
                      }}>
                      {item.status === 'marked_and_answered' && (
                        <div className="absolute bottom-2 right-0 rounded-full bg-green-1 w-2 h-2" />
                      )}
                      <div className="flex align-middle text-center m-auto">
                        {index + 1}
                      </div>
                    </div> </div>
                ))}
              </div>
              <Card>
                {sectionInstruction && (
                  <div className="text-container ml-3" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId].instruction }} />
                )}

                {questionPaper && (
                  <div>
                    <center className="font-bold">Question Paper</center>
                    {dataExams.sections[activeSectionId].question_items.map((item, index) => (
                      <div key={index} className="flex border-b my-2 p-2">
                        <div>{index + 1}) &nbsp; </div>
                        <div className="text-container ml-3 leading-6" dangerouslySetInnerHTML={{ __html: item.question }} />
                      </div>
                    ))}
                    <div className="flex mt-4">
                      <div className="w-full" />
                      <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                        onClick={() => {
                          !pausePractice && setQuestionPaper(false)
                        }}>Close Question Paper</button>
                    </div>
                  </div>
                )}
                {sectionInstruction === false && questionPaper === false && (
                  <>
                    {dataExams.sections[activeSectionId].question_items[activeQuestionId]?.count && (
                      <div className="font-bold">Questions {activeQuestionId + 1}-{activeQuestionId + dataExams.sections[activeSectionId].question_items[activeQuestionId]?.count} refer to the following passage</div>
                    )}
                    <div className="text-container ml-3" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId].question_items[activeQuestionId]?.practice_question?.instruction }} />
                    <div className="text-container ml-3" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId].question_items[activeQuestionId]?.practice_question?.paragraph }} />
                    <h1 className="font-bold my-2">Question {activeQuestionId + 1}</h1>
                    <div className="text-container leading-6" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId].question_items[activeQuestionId]?.question }} />
                    {dataExams.sections[activeSectionId].question_items[activeQuestionId]?.options.map((itemAnswer, indexAnswer) => {
                      const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                      if (itemAnswer.new) {
                        setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].new`, true)
                        if (itemAnswer.correct === null) {
                          setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].correct`, 0)
                        }
                      }
                      return (
                        <>
                          {dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type === 'single' ? (
                            <div className={`${dataExams.sections[activeSectionId].question_items[activeQuestionId]?.options[indexAnswer].selected === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} cursor-pointer my-2  p-3 border rounded-lg`} key={indexAnswer} onClick={() => !pausePractice && onSingleAnswer(itemAnswer, indexAnswer)}>
                              <div className='flex  gap-2'>
                                <div className="flex cursor-pointer" >
                                  <div className="m-auto" >
                                    {itemAnswer.selected === 1 ? (
                                      <Image src='/asset/icon/table/ic_radio_active.svg' width={16} height={16} alt="icon radio button" />
                                    ) : (
                                      <div className="border w-4 rounded-full h-4" />
                                    )}
                                  </div>
                                </div>
                                <span>{alphabet[indexAnswer]}.</span>
                                <div>{itemAnswer.title}</div>
                              </div>
                            </div>
                          ) : (
                            // if multiple answer
                            <div className={`${dataExams.sections[activeSectionId].question_items[activeQuestionId]?.options[indexAnswer].selected === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2  p-3 border rounded-lg cursor-pointer`} key={indexAnswer} onClick={() => !pausePractice && onMultipleAnswer(itemAnswer, indexAnswer)}>
                              <div className='flex  gap-2'>
                                <div className="flex cursor-pointer" >
                                  <div className="m-auto" >
                                    {itemAnswer.selected === 1 ? (
                                      <Image src='/asset/icon/table/ic_checkbox_active.svg' width={16} height={16} alt="icon radio button" />
                                    ) : (
                                      <div className="border w-4 rounded h-4" />
                                    )}
                                  </div>
                                </div>
                                <span>{alphabet[indexAnswer]}.</span>
                                <div>{itemAnswer.title}</div>
                              </div>
                            </div>
                          )}
                        </>
                      )
                    })}
                    <div className="md:flex flex-row gap-4 ">
                      <div className="w-full mt-4">
                        {dataExams.sections[activeSectionId].question_items.length !== activeQuestionId + 1 ? (
                          <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={() => { !pausePractice && onMarkAndNextQuestion() }} >Mark Question and Next</button>
                        ) : (
                          <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={() => {
                            !pausePractice && onMarkAndNextQuestion()
                          }} >Mark Question</button>
                        )}
                      </div>
                      <div className="w-full mt-4">
                        {dataExams.sections[activeSectionId].question_items.length !== activeQuestionId + 1 && (
                          <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                            onClick={() => {
                              !pausePractice && onSaveAndNextQuestion()
                            }}>Save and Next Question</button>
                        )}
                        {dataExams.sections[activeSectionId].question_items.length === activeQuestionId + 1 && dataExams.sections.length === activeSectionId + 1 && (
                          <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                            onClick={onSaveLastQuestionSection}>Save Question</button>
                        )}
                        {dataExams.sections[activeSectionId].question_items.length === activeQuestionId + 1 && dataExams.sections.length !== activeSectionId + 1 && (
                          <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                            onClick={() => {
                              const temp = dataExams.sections[activeSectionId].question_items
                              temp.map((itemQ) => {
                                if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
                                  itemQ.status = 'not_answered'
                                  itemQ.options.map((optionQ) => {
                                    if (optionQ.selected === 1) {
                                      optionQ.selected = 1
                                      itemQ.status = 'answered'
                                    }
                                  })
                                } else {
                                  itemQ
                                }
                              })
                              const tempExam = dataExams
                              tempExam.sections.map((itemSection) => {
                                if (itemSection.id === dataExams.sections[activeSectionId].id) {
                                  itemSection.question_items = temp
                                }
                              })
                              setDataExams({ ...tempExam })
                              setRenderCount(!renderCount)
                              // setActiveSectionId(activeSectionId + 1)
                              // setActiveSection(dataExams.sections[activeSectionId + 1].name)
                              // setActiveQuestionId(0)
                              // setDuration(dataExams.sections[activeSectionId + 1].duration)
                              // newTime.setSeconds(time.getSeconds() + dataExams.sections[activeSectionId].duration * 60)
                              // setRenderCount(!renderCount) 
                              !pausePractice && onOpenNextSectionModal()
                            }}>Save and Continue to Next Section</button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
            <div className="md:w-1/2 lg:w-1/2 hidden md:flex lg:flex" />
            <div className="md:w-1/3 lg:w-1/3 hidden md:flex lg:flex fixed right-4">
              <Card className="w-full">
                {width > 767 && (
                  <>
                    {durationType === 'total' ? (
                      <>
                        {!firstInstruction && (
                          <MyTimerPractice onPause={onpausePractice} newExpiry={totalTime} rerender={durationTotal} remaining={(data) => setRemaining(data)} isLastSection={true} onFinish={submitTest} />
                        )}
                      </>
                    ) : (
                      <>
                        {!firstInstruction && (
                          <div className="bg-black-9 text-center p-2 rounded">
                            Remaining time
                            <MyTimerPractice onPause={onpausePractice} newExpiry={time} rerender={duration} remaining={(data) => setRemaining(data)} isLastSection={dataExams.sections.length === activeSectionId + 1 ? true : false} onNextSection={onNextSection} onFinish={submitTest} />
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
                <AnswerCount notVisited={reviewSubmit[activeSectionId]?.notVisited} answered={reviewSubmit[activeSectionId]?.answeredSave} marked={reviewSubmit[activeSectionId]?.markedSave} notAnswered={reviewSubmit[activeSectionId]?.notAnswered} markedAndAnswered={reviewSubmit[activeSectionId]?.markedAndAnswered} />
                <NavigationQuestion totalAnswered={reviewSubmit[activeSectionId]?.answered} totalQuestion={dataExams.sections[activeSectionId].question_items.length} listQuestion={dataExams.sections[activeSectionId].question_items} setActiveQuestionId={(id) => setActiveQuestionId(id)} activeQuestionId={activeQuestionId} isPausePractice={pausePractice} />
                <div className="flex gap-4 mt-4">
                  <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={() => {
                    if (!pausePractice) {
                      setQuestionPaper(true)
                      setSectionInstruction(false)
                    }
                  }}   >Question Paper</button>
                  <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={() => {
                    if (!pausePractice) {
                      setSectionInstruction(true)
                      setQuestionPaper(false)
                    }
                  }} >Instruction</button>
                </div>
                {sectionInstruction || questionPaper ? (
                  <div>
                    <div className="flex py-2">
                      <button className={`text-white w-full bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                        onClick={() => {
                          setSectionInstruction(false)
                          setQuestionPaper(false)
                          if (firstInstruction) {
                            if (durationType === 'total' && activeSectionId === 0) {
                              setDurationTotal(dataExams.duration)
                              setFirstInstruction(false)
                            } else {
                              setDuration(dataExams.sections[activeSectionId].duration)
                              setFirstInstruction(false)
                            }
                          }
                        }}>Continue to Question</button>
                    </div>
                  </div>
                ) : (
                  <button className={`${isSubmit ? 'bg-blue-1 border-blue-1  hover:bg-blue-2 text-white' : 'bg-black-7 text-black-5 cursor-default'}   py-2 px-4 border  w-full font-semibold text-sm rounded hover:filter hover:drop-shadow-xl mt-4`}
                    onClick={() => {
                      if (isSubmit) {
                        !pausePractice && onOpenSuccessModal()
                      }
                    }}>Submit Test</button>
                )}
              </Card>
            </div>
          </div>
        </>
      )}

      {/* previous next */}
      <div className="flex -z-10 gap-4 flex-row-reverse my-4">
        {currentStep === 1 && (
          <>
            <div className='cursor-pointer' onClick={() => {
              setCurrentStep(2)
              setSectionInstruction(true)
              setFirstInstruction(true)
              setRenderCount(!renderCount)
            }} ><Button title="Continue" /></div>
            <Link href="/student/practice">
              <a>
                <button className={`md:flex hidden text-blue-1 border border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >Back to Exams</button>
              </a>
            </Link>
          </>
        )}

      </div>
      {currentStep === 2 && (
        <div className="flex gap-4 md:hidden mt-4 fixed bottom-2 bg-white w-full">
          <button className={`text-blue-1 bg-white py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl mt-4`} onClick={() => {
            setQuestionPaper(true)
            setSectionInstruction(false)
          }}   >Question Paper</button>
          {sectionInstruction || questionPaper ? (
            <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl mt-4`}
              onClick={() => {
                setSectionInstruction(false)
                setQuestionPaper(false)
                if (firstInstruction) {
                  if (durationType === 'total' && activeSectionId === 0) {
                    setDurationTotal(dataExams.duration)
                    setFirstInstruction(false)
                  } else {
                    setDuration(dataExams.sections[activeSectionId].duration)
                    setFirstInstruction(false)
                  }
                }
              }}>Continue to Question</button>
          ) : (
            <button className={`${isSubmit ? 'bg-blue-1 text-white border-blue-1  hover:bg-blue-2' : 'text-black-5 bg-black-7 cursor-default'}py-2 px-4 border  w-full font-semibold text-sm rounded hover:filter hover:drop-shadow-xl mt-4`}
              onClick={() => {
                if (isSubmit) {
                  !pausePractice && onOpenSuccessModal
                }
              }}>Submit Test</button>
          )}
        </div>
      )}

      <ModalSubmitTest isSuccessModal={isSuccessModal} onCloseSuccessModal={onCloseSuccessModal} submitTest={submitTest} reviewSubmit={reviewSubmit} />
      <ModalNextSection isOpen={isNextSectionModal} onClose={onCloseNextSectionModal} onNextSection={onNextSection} />

    </div>
  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
Index.layout = LayoutTest