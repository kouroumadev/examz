import LayoutTest from "../../../../Layout/LayoutTest"
import apiStudentPage from "../../../../action/student_page"
import { useRouter } from "next/router";
import { useState, useEffect, useLayoutEffect } from "react";
import Card from '../../../../components/Cards/Card'
import Image from "next/image"
import GeneralInstruction from "../../../../components/Section/generalInstruction"
import Button from "../../../../components/Button/button";
import Link from "next/link";
import MyTimer from '../../../../components/Timer/MyTimer'
import { useDisclosure } from '@chakra-ui/react'
import { FaAngleLeft } from "react-icons/fa";
import AnswerCount from "../../../../components/Navbar/AnswerCount";
import NavigationQuestion from "../../../../components/Navbar/QuestionNavigation";
// import NavigationQuestionComp from "../../../../components/Navbar/QuestionNavigationComp";
import { ModalSubmitTest } from "../../../../components/Modal/ModalSubmitTest";
import { ModalNextSection } from "../../../../components/Modal/ModalNextSection";
import { ModalNextSectionCompulsory } from "../../../../components/Modal/ModalNextSectionCompulsory";
// import { ModalSendExam } from "../../../../components/Modal/ModalSendExam";
import apiExamCategoryType from '../../../../action/ExamCategoryType';

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
  const [currentStep, setCurrentStep] = useState()
  const [activeSection, setActiveSection] = useState()
  const [activeSectionId, setActiveSectionId] = useState(0)
  const [activeQuestionId, setActiveQuestionId] = useState(0)
  const [sectionInstruction, setSectionInstruction] = useState(false)
  const [questionPaper, setQuestionPaper] = useState(false)
  const [duration, setDuration] = useState()
  const [durationType, setDurationType] = useState()
  const [durationTotal, setDurationTotal] = useState()
  const [reviewSubmit, setReviewSubmit] = useState([])
  const [renderCount, setRenderCount] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState()
  const [firstInstruction, setFirstInstruction] = useState(false)
  const [resultId, setResultId] = useState(Router.asPath.split("=")[1])
  const time = new Date();
  const totalTime = new Date()
  const [isSubmit, setIsSubmit] = useState(false)
  // new code
  const [answer, setAnswer] = useState('')
  // const [remainQuestion, setRemainQuestion] = useState(0)
  // const [examCatId, setExamCatId] = useState(0)
  // const [maxQuestion, setMaxQuestion] = useState(0)
  // const [compQuestion, setCompQuestion] = useState({})
  // const [notCompQuestion, setNotCompQuestion] = useState([])
  
  // eend code
  const [dataExams, setDataExams] = useState({
    sections: [{
      question_items: [{
        options: [{
          selected: 0
        }]
      }]
    }]
  })
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
  const {
    isOpen: isNextSectionModalCompulsory,
    onOpen: onOpenNextSectionModalCompulsory,
    onClose: onCloseNextSectionModalCompulsory
  } = useDisclosure()
  

  useEffect(async () => {
    
    const getDataContinue = async (resultId) => {
      await apiStudentPage.showExamsTemp(id, resultId)
        .then((res) => {
          //  console.log('exam ' + res.data.data.exam)
          // time.setSeconds(time.getSeconds() + res.data.data.exam.sections[res.data.data.current_section].duration * 60);
          setActiveSectionId(res.data.data.current_section)
          setCurrentStep(2)
          setDataExams(res.data.data.exam)
          // setExamCatId(res.data.data.exam.exam_category_id)
          setActiveQuestionId(res.data.data.current_item)
          setActiveSection(res.data.data.exam.sections[res.data.data.current_section].name)
          if (res.data.data.exam.duration !== null) {
            setDurationType('total')
            setDurationTotal(res.data.data.exam.duration)
          } else {
            setDurationType('section')
            setDuration(res.data.data.exam.sections[res.data.data.current_section].duration)
            // time.setSeconds(time.getSeconds() + res.data.data.exam.sections[res.data.data.current_section].duration * 60);
          }
          const Rsubmit = []
          
          res.data.data.exam.sections.map((item) => {
            const dataResult = {
              name: item.name,
              total: item.question_items.length,
              answered: 0,
              notAnswered: 0,
              marked: 0,
              markedSave: 0,
              answeredSave: 0,
              notVisited: item.question_items.length,
              markedAndAnswered: 0,
              totalCompulsory: 0,
              totalNotCompulsory: 0,
              remainComp: 0,
              remainNotComp: 0,
            }
            Rsubmit.push(dataResult)
          })
          setReviewSubmit(Rsubmit)
          const temp = res.data.data.exam.sections
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
          const tempExam = res.data.data.exam
          tempExam.sections = temp
          setDataExams({ ...tempExam })
          setRenderCount(!renderCount)
        })
    }

    const getData = async () => {
      
      await apiStudentPage.showExams(id)
        .then((res) => {
          if (res.data.message === 'Please continue the unfinished exam') {
            setResultId(res.data.data.resultId)
            getDataContinue(res.data.data.resultId)
            // added code
            // // setExamCatId(res.data.data.exam_category_id)
            // end added code
          } else {
            setCurrentStep(1)
            setDataExams(res.data.data)
            setActiveQuestionId(0)
            setActiveSectionId(0)
            // added code
            // setExamCatId(res.data.data.exam_category_id)
            // end added code
            setActiveSection(res.data.data.sections[0].name)
            if (res.data.data.duration !== null) {
              setDurationType('total')
            } else {
              setDurationType('section')
            }

            const Rsubmit = []
                    
            res.data.data.sections.map((item) => {
              // console.log(item)
              const dataResult = {
                name: item.name,
                total: item.question_items.length,
                answered: 0,
                notAnswered: 0,
                marked: 0,
                markedSave: 0,
                answeredSave: 0,
                notVisited: item.question_items.length,
                markedAndAnswered: 0,
                totalCompulsory: 0,
                totalNotCompulsory: 0,
                remainComp: 0,
                remainNotComp: 0,
                // remaining: 0
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
    time.setSeconds(time.getSeconds() + dataExams.sections[activeSectionId].duration);
  }, [duration])

  useEffect(async () => {
    totalTime.setSeconds(time.getSeconds() + durationTotal);
  }, [durationTotal])

  const onNextSection = async  () => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        if(dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type == 'numeric') {
          // console.log('moi ' + answer)
          if(answer.length === 0) {
            itemQ.status = 'not_answered'
          } else {
            itemQ.status = 'answered'
          }
        } else {
          itemQ.status = 'not_answered'
        }

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
      remaining_second: remainingSeconds,
      current_section: activeSectionId,
      current_item: activeQuestionId,
      ...temp[activeQuestionId]
    }
    // console.log(dataQuestionItem)
    const data = JSON.stringify(dataQuestionItem)
    const res = {
      data: data
    }
    await apiStudentPage.storeExamsQuestion(id, res)

    const tempExam = dataExams
    tempExam.sections.map((itemSection) => {
      if (itemSection.id === dataExams.sections[activeSectionId].id) {
        itemSection.question_items = temp
      }
    })
    // added code
    // // setremainQuestion(0)
    // end added code
    setDataExams({ ...tempExam })
    setActiveSectionId(activeSectionId + 1)
    setActiveSection(dataExams.sections[activeSectionId + 1].name)
    setActiveQuestionId(0)
    setSectionInstruction(true)
    setAnswer('')
    if (durationType === 'section') {
      setFirstInstruction(true)
      setDuration('')
    }
  }

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
    await apiStudentPage.storeExams(id, res)
      .then((res) => {
        Router.push('/student/exams/' + id + "/" + res.data.data.id)
      })
  }

  // first run init
  useEffect(() => {

    
    
    const countReviewResult = () => {
      // console.log('com list ' + dataExams.sections[activeSectionId].question_items)

      dataExams.sections.map((itemSection) => {
        
        let answerCount = []
        let marked = []
        let compulsory = []
        let notCompulsory = []
        let totalRemain = []
        let totalNotRemain = []
        let compQuestList = []
        // for remaining
        let answeredSave = []
        let notAnsweredSave = []
        let markedSave = []
        let markedAndAnswered = []
        itemSection.question_items.map((itemQuestion) => {
          // console.log('okay')
          //  console.log(itemQuestion)

          if(itemQuestion.is_required == '1') {
            if(itemQuestion.status == 'answered') {
              totalRemain.push("moi")          
            }
            compulsory.push("moi")
          } else {
            if(itemQuestion.status == 'answered') {
              totalNotRemain.push("moi")          
            }
            notCompulsory.push("moi")
          }

          

          if (itemQuestion.status === 'answered') {
            answerCount.push("answer")
            answeredSave.push("save answer")
            // console.log("beeee")
            // countNumber()

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
        if (answeredSave.length > 0) {
          setIsSubmit(true)
        }
        let temp = reviewSubmit
        // console.log('im in ' + itemSection.name)
        temp.map((item) => {
          if (item.name === itemSection.name) {
            item.name = item.name,
              item.total = item.total,
              item.answered = answerCount.length,
              item.notAnswered = item.total - answerCount.length,
              item.marked = marked.length,
              item.totalCompulsory = compulsory.length,
              item.totalNotCompulsory = notCompulsory.length,
              item.remainComp = totalRemain.length,
              item.remainNotComp = totalNotRemain.length,

              // console.log('tot ' + compulsory.length)

              
              // item.remaining = answerCount.length
            // for remaining
             item.notVisited = item.total - answeredSave.length - notAnsweredSave.length - markedSave.length - markedAndAnswered.length
            // item.notVisited = 1
            item.answeredSave = answeredSave.length
            item.notAnswered = notAnsweredSave.length
            item.markedSave = markedSave.length
            item.markedAndAnswered = markedAndAnswered.length
            // item.remaining = answerCount.length
          } else {
            item
          }
        })
        // console.log('im in ' + compulsory.length)
         setReviewSubmit([...temp])
         
        // setReviewSubmit([])
        // setMaxQuestion(0)
        // // setRemainQuestion(0)
      })
    }
    countReviewResult()
  }, [renderCount])

  const onSingleAnswer = (itemAnswer, indexAnswer) => {
    // console.log('hello baby')
    
    const temp = dataExams.sections[activeSectionId].question_items
    const moi = dataExams.sections[activeSectionId].question_items[activeQuestionId]
    // console.log('rep')
    // console.log(dataExams.sections[activeSectionId].name)
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
     console.log('SINGLE')
     console.log(moi)
    setDataExams({ ...tempExam })
    setAnswer('')
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
    console.log('MULTIPLE')
    console.log(tempExam)
    setDataExams({ ...tempExam })
    setAnswer('')
  }

  // start added code
   const onNumericAnswer = (event, itemAnswer) => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) =>{
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        itemQ.options.map((optionQ) => {
          if (optionQ.id === itemAnswer.id){
            if(event.target.value == itemAnswer.title ){
              optionQ.selected = 1
            } else {
              optionQ.selected = 0
            }
            // console.log(itemAnswer);
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
     setAnswer(event.target.value);
    //  console.log('NUMERIC')
    // console.log(tempExam)
    
    setDataExams({ ...tempExam })
    
   }

   const holdData = () => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        if(dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type == 'numeric') {
          // console.log('moi ' + answer)
          if(answer.length === 0) {
            itemQ.status = 'not_answered'
          } else {
            itemQ.status = 'answered'
          }
        } else {
          itemQ.status = 'not_answered'
        }

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
    
    onOpenNextSectionModal()
   }

    // end added code

  const onMarkAndNextQuestion = () => {
    const temp = dataExams.sections[activeSectionId].question_items
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        itemQ.status = 'marked'
        itemQ.options.map((optionQ) => {
          if (optionQ.selected === 1) {
            optionQ.selected = 1
            itemQ.status = 'marked_and_answered'
            // console.log('prev value ' + remainQuestion)
            // // setRemainQuestion(prev => prev - 1)
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
    setAnswer('')
    if (dataExams.sections[activeSectionId]?.question_items.length !== activeQuestionId + 1) {
      setActiveQuestionId(activeQuestionId + 1)
    }
  }

  const onSaveAndNextQuestion = async () => {
    // console.log("suis laaaa")
    const temp = dataExams.sections[activeSectionId].question_items
    
    temp.map((itemQ) => {
      if (itemQ.id === dataExams.sections[activeSectionId].question_items[activeQuestionId].id) {
        if(dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type == 'numeric') {
          // console.log('moi ' + answer)
          if(answer.length === 0) {
            itemQ.status = 'not_answered'
          } else {
            itemQ.status = 'answered'
          }
        } else {
          itemQ.status = 'not_answered'
        }
        
        itemQ.options.map((optionQ) => {
          if (optionQ.selected === 1) {
            optionQ.selected = 1
            itemQ.status = 'answered'
            // console.log('prev value ' + remainQuestion)
            // setRemainQuestion(prevState => prevState - 1)
            // setRemainQuestion(remainQuestion - 1)
            
          } else {
            optionQ.selected = 0
          }
        })
      } else {
        itemQ
      }
    })
    
    const dataQuestionItem = {
      remaining_second: remainingSeconds,
      current_section: activeSectionId,
      current_item: activeQuestionId,
      ...temp[activeQuestionId]
    }
    // console.log(dataQuestionItem)
    const data = JSON.stringify(dataQuestionItem)
    const res = {
      data: data
    }
    await apiStudentPage.storeExamsQuestion(id, res)

    const tempExam = dataExams
    tempExam.sections.map((itemSection) => {
      if (itemSection.id === dataExams.sections[activeSectionId].id) {
        itemSection.question_items = temp
      }
    })
    setDataExams({ ...tempExam })
    setActiveQuestionId(activeQuestionId + 1)
    setRenderCount(!renderCount)
    setAnswer('')
  }

  

  return (
    <div className="md:mt-12 min-w-full overflow-x-hidden">
      {currentStep === 1 && (
        <>
          <div className="flex bg-white md:hidden shadow-lg border-b flex-row top-0 fixed w-full">
            <Link href="/student/exams">
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
          <div className="flex bg-white md:hidden justify-between p-2 flex-row fixed w-full">
            {width < 768 && (
              <>
                <div className="font-bold text-2xl m-2">{dataExams.name}</div>
                {durationType === 'total' ? (
                  <>
                    {!firstInstruction && (
                      <MyTimer newExpiry={totalTime} rerender={durationTotal} isLastSection={true} onFinish={submitTest} remaining={(data) => setRemainingSeconds(data)} />
                    )}
                  </>
                ) : (
                  <>
                    {!firstInstruction && (
                      <div className=" bg-blue-6 max-h-max flex p-2 rounded">
                        <div className="inline-block bg-blue-5 my-auto flex">
                          <MyTimer remaining={(data) => setRemainingSeconds(data)} newExpiry={time} rerender={duration} isLastSection={dataExams.sections.length === activeSectionId + 1 ? true : false} onNextSection={onNextSection} onFinish={submitTest} />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex gap-4 md:mt-0 mt-16">
            <div className="w-full md:pr-4">
              <div className="flex  gap-4 bg-white md:rounded-lg pt-4 px-4 mb-4">
                {dataExams.sections.map((item, index) => (
                  <div key={index} className={` ${activeSection === item.name ? 'text-blue-1 border-b-2 border-blue-1 font-bold' : 'text-black-5'}  pb-4`}>
                    {item?.name}
                  </div>
                ))}
              </div>
              <div className="flex overflow-x-scroll p-2 md:hidden ">
                {dataExams.sections[activeSectionId]?.question_items.map((item, index) => (
                  <div key={index} id={index}>
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
                        <div className="text-container ml-3" dangerouslySetInnerHTML={{ __html: item.question }} />
                      </div>
                    ))}
                    <div className="flex mt-4">
                      <div className="w-full" />
                      <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                        onClick={() => {
                          setQuestionPaper(false)
                        }}>Close Question Paper</button>
                    </div>
                  </div>
                )}
                {sectionInstruction === false && questionPaper === false && (
                  <>
                    {dataExams.sections[activeSectionId]?.question_items[activeQuestionId]?.count && (
                      <div className="font-bold">Questions {activeQuestionId + 1}-{activeQuestionId + dataExams.sections[activeSectionId].question_items[activeQuestionId]?.count} refer to the following passage</div>
                    )}
                    <div className="text-container ml-3" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId]?.question_items[activeQuestionId]?.exam_question?.instruction }} />
                    <div className="text-container ml-3" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId]?.question_items[activeQuestionId]?.exam_question?.paragraph }} />
                    <h1 className="font-bold my-2">Question {activeQuestionId + 1}</h1>
                    <div className="text-container leading-6" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId]?.question_items[activeQuestionId]?.question }} />
                    {dataExams.sections[activeSectionId]?.question_items[activeQuestionId]?.options.map((itemAnswer, indexAnswer) => {
                      const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                      if (itemAnswer.new) {
                        setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].new`, true)
                        if (itemAnswer.correct === null) {
                          setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].correct`, 0)
                        }
                      }
                      return (
                        <>
                          {/* if single type question */}
                          {dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type === 'single' && (
                            <div className={`${dataExams.sections[activeSectionId].question_items[activeQuestionId]?.options[indexAnswer].selected === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} cursor-pointer my-2  p-3 border rounded-lg`} key={indexAnswer} onClick={() => onSingleAnswer(itemAnswer, indexAnswer)}>
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
                          )} 

                          {/* if multiple answer */}
                          {dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type === 'multiple' && (                            
                            <div className={`${dataExams.sections[activeSectionId].question_items[activeQuestionId]?.options[indexAnswer].selected === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2  p-3 border rounded-lg cursor-pointer`} key={indexAnswer} onClick={() => onMultipleAnswer(itemAnswer, indexAnswer)}>
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

                          {/* if numeric type */}
                          {dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type === 'numeric' && (
                            <div>
                            {/* {setLaQuestion(itemAnswer.title)}  */}
                            {/* {setMonItem(itemAnswer.id)}  */}
                              <input 
                                value={answer} 
                                onChange={event => onNumericAnswer(event,itemAnswer )}
                                autoComplete="off" type="text" className="form border w-full rounded p-2 h-full m-1" placeholder="Enter your answer" 
                              />
                            </div>
                          )}
                        </>
                      )
                    })}
                    <div className="md:flex flex-row gap-4 ">
                      <div className="w-full mt-4">
                        {dataExams.sections[activeSectionId]?.question_items.length !== activeQuestionId + 1 ? (
                          <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={onMarkAndNextQuestion} >Mark Question and Next</button>
                        ) : (
                          <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={onMarkAndNextQuestion} >Mark Question</button>
                        )}
                      </div>
                      <div className="w-full mt-4">
                        {dataExams.sections[activeSectionId]?.question_items.length !== activeQuestionId + 1 && (
                          <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                            onClick={onSaveAndNextQuestion}>Save and Next Question</button>
                        )}
                        {dataExams.sections[activeSectionId]?.question_items.length === activeQuestionId + 1 && dataExams.sections.length !== activeSectionId + 1 && (
                          <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                            onClick={() => {
                              // if(reviewSubmit[activeSectionId].remainComp == reviewSubmit[activeSectionId].totalCompulsory) {
                              //   holdData()
                              // } else { 
                              //   if(dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type == 'single' || dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type == 'multiple') {
                              //     const moi = dataExams.sections[activeSectionId].question_items[activeQuestionId]
                              //     let val = []
                              //     moi.options.map((item) => {
                              //       if(item.selected === 1) {
                              //         val.push("yes")
                              //       }
                              //       })
                              //      if(val.length > 0) {
                              //       holdData()
                              //      } else {
                              //       onOpenNextSectionModalCompulsory()
                              //      }
                              //   } else if(dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type == 'numeric') {
                              //     if(answer.length > 0) {
                              //       holdData()
                              //     } else {
                              //       onOpenNextSectionModalCompulsory()
                              //     }
                              //   }
                                                                
                              // }
                              holdData()
                            }}>Save and Continue to Next Section</button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
            <div className="md:w-1/2 lg:w-1/2 hidden md:flex lg:flex" />
            <div className="md:w-1/3 lg:w-1/3 hidden md:flex lg:flex  top-20 fixed right-4 ">
              <Card>
                {width > 767 && (
                  <>
                    {durationType === 'total' ? (
                      <>
                        {!firstInstruction && (
                          <MyTimer remaining={(data) => setRemainingSeconds(data)} newExpiry={totalTime} rerender={durationTotal} isLastSection={true}  onFinish={submitTest} />
                        )}
                      </>
                    ) : (
                      <>
                        {!firstInstruction && (
                          <div className="bg-black-9 text-center p-2 rounded">
                            Remaining time
                            <MyTimer remaining={(data) => setRemainingSeconds(data)} newExpiry={time} rerender={duration} isLastSection={dataExams.sections.length === activeSectionId + 1 ? true : false} onNextSection={onNextSection} onFinish={submitTest} />
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {dataExams.sections[activeSectionId]?.question_items.length > 0 && (<>
                  <AnswerCount notVisited={reviewSubmit[activeSectionId]?.notVisited} answered={reviewSubmit[activeSectionId]?.answeredSave} marked={reviewSubmit[activeSectionId]?.markedSave} notAnswered={reviewSubmit[activeSectionId]?.notAnswered} markedAndAnswered={reviewSubmit[activeSectionId]?.markedAndAnswered } totalCom={reviewSubmit[activeSectionId]?.totalCompulsory} remainCom={reviewSubmit[activeSectionId]?.remain} />
                  {/* <NavigationQuestionComp totalAnswered={reviewSubmit[activeSectionId]?.answered} totalQuestion={dataExams.sections[activeSectionId]?.question_items.length} listQuestion={dataExams.sections[activeSectionId].question_items} setActiveQuestionId={(id) => setActiveQuestionId(id)} activeQuestionId={activeQuestionId} /> */}
                  <NavigationQuestion totalNotCompAnswered={reviewSubmit[activeSectionId]?.remainNotComp} totalNotCompQuestion={reviewSubmit[activeSectionId]?.totalNotCompulsory} listQuestion={dataExams.sections[activeSectionId].question_items} setActiveQuestionId={(id) => setActiveQuestionId(id)} activeQuestionId={activeQuestionId} totalCompQuestion={reviewSubmit[activeSectionId]?.totalCompulsory} totalCompAnswered={reviewSubmit[activeSectionId]?.remainComp} />
                </>)}
                <div className="md:flex hidden gap-4 mt-4">
                  <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={() => {
                    setQuestionPaper(true)
                    setSectionInstruction(false)
                  }}   >Question Paper</button>
                  <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={() => {
                    setSectionInstruction(true)
                    setQuestionPaper(false)
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
                      // if(reviewSubmit[activeSectionId].remainComp == reviewSubmit[activeSectionId].totalCompulsory) {
                      //   if (isSubmit) {
                      //     setRenderCount(!renderCount)
                      //     onOpenSuccessModal()
                      //   }
                      // } else {
                      //   if(dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type == 'single' || dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type == 'multiple') {
                      //     const moi = dataExams.sections[activeSectionId].question_items[activeQuestionId]
                      //     let val = []
                      //     moi.options.map((item) => {
                      //       if(item.selected === 1) {
                      //         val.push("yes")
                      //       }
                      //       })
                      //      if(val.length > 0) {
                      //       if (isSubmit) {
                      //         setRenderCount(!renderCount)
                      //         onOpenSuccessModal()
                      //       }
                      //      } else {
                      //       onOpenNextSectionModalCompulsory()
                      //      }
                      //   } else if(dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type == 'numeric') {
                      //     if(answer.length > 0) {
                      //       if (isSubmit) {
                      //         setRenderCount(!renderCount)
                      //         onOpenSuccessModal()
                      //       }
                      //     } else {
                      //       onOpenNextSectionModalCompulsory()
                      //     }
                      //   }
                      // }

                      if (isSubmit) {
                        setRenderCount(!renderCount)
                        onOpenSuccessModal()
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
              setRenderCount(!renderCount)
              setFirstInstruction(true)
            }} ><Button title="Continue" /></div>
            <Link href="/student/exams">
              <a>
                <button className={`md:flex hidden text-blue-1 border border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >Back to Exams</button>
              </a>
            </Link>
          </>
        )}
      </div>
      {currentStep === 2 && (
        <div className="flex md:hidden gap-4 mt-4 fixed bottom-0 bg-white w-full">
          <button className={`text-blue-1 bg-white py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl mt-4`} onClick={() => {
            setQuestionPaper(true)
            setSectionInstruction(false)
          }}>Question Paper</button>

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
                // setDuration(dataExams.sections[activeSectionId].duration)

                // newTime.setSeconds(time.getSeconds() + dataExams.sections[activeSectionId].duration * 60)
              }}>Continue to Question</button>
          ) : (
            <button className={`${isSubmit ? 'bg-blue-1 text-white border-blue-1  hover:bg-blue-2' : 'text-black-5 bg-black-7 cursor-default'}py-2 px-4 border  w-full font-semibold text-sm rounded hover:filter hover:drop-shadow-xl mt-4`}
              onClick={() => {
                if (isSubmit) {
                  setRenderCount(!renderCount)
                  onOpenSuccessModal()
                }
              }}>Submit Test</button>
          )}
        </div>
      )}
      <ModalSubmitTest isSuccessModal={isSuccessModal} onCloseSuccessModal={onCloseSuccessModal} submitTest={submitTest} reviewSubmit={reviewSubmit} />
      <ModalNextSection isOpen={isNextSectionModal} onClose={onCloseNextSectionModal} onNextSection={onNextSection} />
      <ModalNextSectionCompulsory isOpen={isNextSectionModalCompulsory} onClose={onCloseNextSectionModalCompulsory} />
      
    </div>
  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
Index.layout = LayoutTest