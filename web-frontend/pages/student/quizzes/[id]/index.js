import LayoutTest from "../../../../Layout/LayoutTest"
import apiStudentPage from "../../../../action/student_page"
import { useState, useEffect, useLayoutEffect } from "react";
import Card from '../../../../components/Cards/Card'
import Image from "next/image"
import MyTimer from '../../../../components/Timer/MyTimer'
import { useRouter } from "next/router";
import {
  useDisclosure,
} from '@chakra-ui/react'
import AnswerCount from "../../../../components/Navbar/AnswerCount";
import NavigationQuestion from "../../../../components/Navbar/QuestionNavigation";
import { ModalSubmitTest } from "../../../../components/Modal/ModalSubmitTest";

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
    questions: [{
      options: [{
        selected: 0
      }]
    }]
  })
  const [activeQuestionId, setActiveQuestionId] = useState(0)
  const [sectionInstruction, setSectionInstruction] = useState(true)
  const [questionPaper, setQuestionPaper] = useState(false)
  const [duration, setDuration] = useState()
  const [firstInstruction, setFirstInstruction] = useState(false)
  const [resultId, setResultId] = useState(Router.asPath.split("=")[1])
  const [isMobile, setIsMobile] = useState(false)
  const [reviewSubmit, setReviewSubmit] = useState({
    notVisited: 0,
    answeredSave: 0,
    notAnswered: 0,
    markedSave: 0,
    markedAndAnswered: 0
  })
  const [renderCount, setRenderCount] = useState(false)
  const time = new Date();
  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()

  useEffect(async () => {
    const getDataContinue = async (resultId) => {
      await apiStudentPage.showQuizTemp(id, resultId)
        .then((res) => {
          setSectionInstruction(false)
          setDataExams(res.data.data.quiz)
          setActiveQuestionId(res.data.data.current_item)
          setDuration(res.data.data.quiz.duration)
          time.setSeconds(time.getSeconds() + res.data.data.quiz.duration * 60);
          const dataResult = {
            total: res.data.data.quiz.questions.length,
            answered: 0,
            notAnswered: 0,
            marked: 0,
            markedSave: 0,
            answeredSave: 0,
            notVisited: res.data.data.quiz.questions.length,
            markedAndAnswered: 0
          }
          setReviewSubmit({ ...dataResult })
          // setRenderCount(!renderCount)
          const temp = res.data.data.quiz.questions
          temp.map((itemQ) => {
            itemQ.status = 'not_answered'
            itemQ.options.map((optionQ) => {
              if (optionQ.selected === 1) {
                optionQ.selected = 1
                itemQ.status = 'answered'
              }
            })
          })
          const tempExam = dataExams
          tempExam.questions = temp
          setDataExams({ ...tempExam })
          setRenderCount(!renderCount)
        })
    }
    const getData = async () => {
      await apiStudentPage.showQuiz(id)
        .then((res) => {
          if (res.data.message === 'Please continue the unfinished quiz') {
            setResultId(res.data.data.resultId)
            getDataContinue(res.data.data.resultId)
          } else {
            setDataExams(res.data.data)
            setFirstInstruction(true)
            // setDuration(res.data.data.duration)
            // time.setSeconds(time.getSeconds() + res.data.data.duration * 60);
            const dataResult = {
              total: res.data.data.questions.length,
              answered: 0,
              notAnswered: 0,
              marked: 0,
              markedSave: 0,
              answeredSave: 0,
              notVisited: res.data.data.questions.length,
              markedAndAnswered: 0
            }
            setReviewSubmit({ ...dataResult })
            setRenderCount(!renderCount)
          }
        })
    }
    resultId !== undefined ? getDataContinue(resultId) : getData()
    setRenderCount(!renderCount)
  }, [])

  useEffect(async () => {
    time.setSeconds(time.getSeconds() + dataExams.duration);
  }, [duration])

  const submitTest = async () => {
    const temp = dataExams
    dataExams.questions.map((item) => {
      if (item.answer_type === 'multiple') {
        if (item.status === 'answered' || item.status === 'marked_and_answered') {
          item.options.map((itemOption) => {
            itemOption.selected = itemOption.selected === 1 ? 1 : 0
          })
        }
      }
    })
    const data = JSON.stringify(temp)
    const res = {
      data: data
    }
    console.log("auto submit")
    console.log(temp)
    await apiStudentPage.storeQuiz(id, res)
      .then((res) => {
        console.log(res)
        Router.push('/student/quizzes/' + id + "/" + res.data.data.id)
      })
  }

  useEffect(() => {
    const countReviewResult = () => {
      let answerCount = []
      let marked = []
      // for remaining
      let answeredSave = []
      let notAnsweredSave = []
      let markedSave = []
      let markedAndAnswered = []
      dataExams.questions.map((itemQuestion) => {
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
      let temp = reviewSubmit

      temp.answered = answerCount.length,
        temp.notAnswered = temp.total - answerCount.length,
        temp.marked = marked.length
      // for remaining
      temp.notVisited = temp.total - answeredSave.length - notAnsweredSave.length - markedSave.length - markedAndAnswered.length
      temp.answeredSave = answeredSave.length
      temp.notAnswered = notAnsweredSave.length
      temp.markedSave = markedSave.length
      temp.markedAndAnswered = markedAndAnswered.length
      console.log(temp)
      setReviewSubmit({ ...temp })
    }
    countReviewResult()
  }, [renderCount])

  const onSingleAnswer = (itemAnswer, indexAnswer) => {
    const temp = dataExams.questions
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.questions[activeQuestionId].id) {
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
    tempExam.questions = temp
    setDataExams({ ...tempExam })
  }

  const onMultipleAnswer = (itemAnswer, indexAnswer) => {
    const temp = dataExams.questions
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.questions[activeQuestionId].id) {
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
    tempExam.questions = temp
    setDataExams({ ...tempExam })
  }

  const onMarkAndSaveQuestion = () => {
    const temp = dataExams.questions
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.questions[activeQuestionId].id) {
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
    tempExam.questions = temp
    setDataExams({ ...tempExam })
    setActiveQuestionId(activeQuestionId + 1)
    setRenderCount(!renderCount)
  }

  const onSaveQuestion = async () => {
    const temp = dataExams.questions
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.questions[activeQuestionId].id) {
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
      current_item: activeQuestionId,
      ...dataExams.questions[activeQuestionId]
    }
    const data = JSON.stringify(dataQuestionItem)
    const res = {
      data: data
    }
    console.log(dataQuestionItem)
    await apiStudentPage.storeQuizQuestion(id, res)
    const tempExam = dataExams
    tempExam.questions = temp
    setDataExams({ ...tempExam })
    setRenderCount(!renderCount)
  }

  const onSubmit = () => {
    const temp = dataExams.questions
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.questions[activeQuestionId].id) {
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
    tempExam.questions = temp
    setDataExams({ ...tempExam })
    setRenderCount(!renderCount)
    onOpenSuccessModal()
  }

  return (
    <div className="min-w-full md:mt-12 overflow-x-hidden">
      <div className="flex bg-white md:hidden justify-between p-2 flex-row fixed w-full">
        <div className="font-bold text-2xl m-2">{dataExams.name}</div>
        {!sectionInstruction && (
          <div className="flex bg-blue-6 p-2 rounded">
            <div className="inline-block bg-blue-5">
              {width < 768 && (
                <MyTimer newExpiry={time} rerender={duration} isLastSection={true} onFinish={submitTest} />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="w-full md:pr-4">
          <div className="flex overflow-x-hidden mt-16 p-2 md:hidden flex-wrap gap-4">
            {dataExams.questions.map((item, index) => (
              <div key={index} className={` 
              ${index === activeQuestionId && 'rounded-t-full bg-purple-1 border-purple-2 border-1'} 
              ${item.status === 'marked' && index !== activeQuestionId && 'bg-purple-1 rounded-full border-1 border-purple-2'} 
              ${item.status === 'marked_and_answered' && index !== activeQuestionId && 'relative bg-purple-100 rounded-full border-1 border-purple-2'} 
              ${item.status === 'answered' && index !== activeQuestionId && 'bg-green-3 rounded-t-full border-1 border-green-1'}
              ${item.status === 'not_answered' && index !== activeQuestionId && 'bg-red-2 rounded-b-full border-1 border-red-1'}
              cursor-pointer flex-nowrap w-12 flex  h-12 border  m-2`} onClick={() => setActiveQuestionId(index)}>
                {item.status === 'marked_and_answered' && (
                  <div className="absolute bottom-2 right-0 rounded-full bg-green-1 w-2 h-2" />
                )}
                <div className="flex align-middle text-center m-auto">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          <Card>
            {sectionInstruction && (
              <div className="text-container ml-3" dangerouslySetInnerHTML={{ __html: dataExams.instruction }} />
            )}

            {sectionInstruction === false && questionPaper === false && (
              <>
                <h1 className="font-bold my-2">Question {activeQuestionId + 1}</h1>
                <div className="text-container leading-6" dangerouslySetInnerHTML={{ __html: dataExams.questions[activeQuestionId]?.question }} />
                {dataExams.questions[activeQuestionId].options.map((itemAnswer, indexAnswer) => {
                  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                  return (
                    <>
                      {dataExams.questions[activeQuestionId].answer_type === 'single' ? (
                        <div className={`${dataExams.questions[activeQuestionId].options[indexAnswer].selected === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2  p-3 border rounded-lg cursor-pointer`} key={indexAnswer} onClick={() => onSingleAnswer(itemAnswer, indexAnswer)}>
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
                        <div className={`${dataExams.questions[activeQuestionId].options[indexAnswer].selected === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2  p-3 border rounded-lg cursor-pointer`} key={indexAnswer} onClick={() => onMultipleAnswer(itemAnswer, indexAnswer)}>
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
                    {dataExams.questions.length !== activeQuestionId + 1 && (
                      <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={onMarkAndSaveQuestion} >Mark Question and Next</button>
                    )}
                  </div>
                  <div className="w-full mt-4">
                    {dataExams.questions.length !== activeQuestionId + 1 ? (
                      <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                        onClick={() => {
                          onSaveQuestion()
                          setActiveQuestionId(activeQuestionId + 1)
                        }}>Save and Next Question</button>
                    ) : (
                      <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                        onClick={onSaveQuestion}>Save Question</button>
                    )}
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
        {/* desktop */}
        <div className="md:w-1/2 lg:w-1/2 hidden md:flex lg:flex " />
        <div className="md:w-1/3 lg:w-1/3 hidden md:flex lg:flex fixed right-4">
          <Card>
            {!sectionInstruction && (
              <div className="bg-black-9 text-center p-2 rounded">
                Remaining time
                {width > 767 && (
                  <MyTimer newExpiry={time} rerender={duration} isLastSection={true} onFinish={submitTest} />
                )}
              </div>
            )}
            <AnswerCount notVisited={reviewSubmit.notVisited} answered={reviewSubmit.answeredSave} marked={reviewSubmit.markedSave} notAnswered={reviewSubmit.notAnswered} markedAndAnswered={reviewSubmit.markedAndAnswered} />
            <NavigationQuestion totalAnswered={reviewSubmit.answered} totalQuestion={dataExams.questions.length} listQuestion={dataExams.questions} setActiveQuestionId={(id) => setActiveQuestionId(id)} activeQuestionId={activeQuestionId} />
            {sectionInstruction ? (
              <div>
                <div className="flex">
                  <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                    onClick={() => {
                      if (firstInstruction) {
                        setDuration(dataExams.duration)
                        setFirstInstruction(false)
                      }
                      setSectionInstruction(false)
                    }}>Continue to Question</button>
                </div>
              </div>
            ) : (
              <button className={`${reviewSubmit.answeredSave > 0 ? 'bg-blue-1 border-blue-1  hover:bg-blue-2 text-white' : 'bg-black-7 text-black-5 cursor-default'}   py-2 px-4 border  w-full font-semibold text-sm rounded hover:filter hover:drop-shadow-xl mt-4`}
                onClick={() => {
                  if (reviewSubmit.answeredSave > 0) {
                    onSubmit()
                  }
                }}>Submit Test</button>
            )}
          </Card>
        </div>
      </div>
      {/* mobile */}
      {sectionInstruction ? (
        <div className="fixed bottom-0 p-2 w-full flex bg-white md:hidden">
          <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
            onClick={() => {
              if (firstInstruction) {
                setDuration(dataExams.duration)
                setFirstInstruction(false)
              }
              setSectionInstruction(false)
            }}>Continue to Question</button>
        </div>
      ) : (
        <div className="fixed bottom-0 p-2 w-full flex bg-white md:hidden">
          <button className={`${reviewSubmit.answeredSave > 0 ? 'bg-blue-1 text-white border-blue-1  hover:bg-blue-2' : 'text-black-5 bg-black-7 cursor-default'}py-2 px-4 border  w-full font-semibold text-sm rounded hover:filter hover:drop-shadow-xl mt-4`}
            onClick={() => {
              if (reviewSubmit.answeredSave > 0) {
                onSubmit()
              }
            }}>Submit Test</button>
        </div>
      )}
      <ModalSubmitTest isSuccessModal={isSuccessModal} onCloseSuccessModal={onCloseSuccessModal} submitTest={submitTest} reviewSubmit={reviewSubmit} isQuiz={true} />
    </div>
  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
Index.layout = LayoutTest