import apiStudentPage from "../../../../../action/student_page"
import { useState, useEffect } from "react";
import Card from '../../../../../components/Cards/Card'
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/router";
import NavigationAnswerResult from "../../../../../components/Navbar/NavigationAnswerResult";
import LayoutTestResult from "../../../../../Layout/LayoutTest Result";

export default function Index() {
  const Router = useRouter()
  const { id } = Router.query
  const { idResult } = Router.query
  const [dataExams, setDataExams] = useState({
    sections: [{
      question_items: [{
        options: [{
          correct: 0
        }]
      }]
    }]
  })
  const [activeSection, setActiveSection] = useState()
  const [activeSectionId, setActiveSectionId] = useState(0)
  const [activeQuestionId, setActiveQuestionId] = useState(0)
  const [reviewSubmit, setReviewSubmit] = useState([])
  const [renderCount, setRenderCount] = useState(false)
  const [data, setData] = useState()
  const markAnswer = [
    {
      icon: "/asset/icon/table/ic_answer.svg",
      desc: "Correct"
    },
    {
      icon: "/asset/icon/table/ic_not_answer.svg",
      desc: "Incorrect"
    },
  ]

  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.showPracticeResult(id, idResult)
        .then((res) => {
          setData(res.data.data)
          setDataExams(res.data.data.practice)
          setActiveSection(res.data.data.practice.sections[0].name)
          const Rsubmit = []
          res.data.data.practice.sections.map((item) => {
            const dataResult = {
              name: item.name,
              total: item.question_items.length,
            }
            Rsubmit.push(dataResult)
          })
          setReviewSubmit(Rsubmit)
          setRenderCount(!renderCount)
        })
    }
    getData()
  }, [])


  useEffect(() => {
    const countReviewResult = () => {
      dataExams.sections.map((itemSection) => {
        let answerCount = []
        let unAnswered = []
        itemSection.question_items.map((itemQuestion) => {
          if (itemQuestion.result_details?.length > 0) {
            if (itemQuestion.result_details[0].correct === 1) {
              answerCount.push("correct")
            }
          } else {
            unAnswered.push("no answer")
          }
        })
        let temp = reviewSubmit
        temp.map((item) => {
          if (item.name === itemSection.name) {
            item.name = item.name,
              item.total = item.total,
              item.correct = answerCount.length
            item.incorrect = item.total - answerCount.length - unAnswered.length
          } else {
            item
          }
        })
        setReviewSubmit([...temp])
      })
    }
    countReviewResult()
  }, [renderCount])
  return (
    <>
      <div className="flex bg-white md:hidden  border-b flex-row top-0 fixed w-full">
        <div className="font-bold text-2xl m-2">{dataExams?.name}</div>
      </div>
      <div className="my-12" />
      <div className="mt-12 min-w-full overflow-x-hidden">
        <div className="flex gap-4">
          <div className="w-full md:pr-4">
            <div className="flex  gap-4 bg-white md:rounded-lg pt-4 px-4 mb-4">
              {dataExams.sections.map((item, index) => (
                <div key={index} className={` ${activeSection === item.name ? 'text-blue-1 border-b-2 border-blue-1 font-bold' : 'text-black-5'} cursor-pointer  pb-4`} onClick={() => {
                  setActiveSectionId(index)
                  setActiveSection(item.name)
                  setActiveQuestionId(0)
                }}>
                  {item?.name}
                </div>
              ))}
            </div>
            <div className="flex overflow-x-scroll p-2 md:hidden ">
              {dataExams.sections[activeSectionId].question_items.map((item, index) => (
                <div key={index} id={index}>
                  <div key={index} className={` 
                    ${item.options[0].correct === 1 && 'bg-green-3 rounded-t-full border-1 border-green-1'}
                    ${item.options[0].correct === 0 && 'bg-red-2 rounded-b-full border-1 border-red-1'}
                    cursor-pointer flex-nowrap w-12 flex  h-12 border rounded m-2`} onClick={() => setActiveQuestionId(index)}>
                    <div className="flex align-middle text-center m-auto">
                      {index + 1}
                    </div>
                  </div> </div>
              ))}
            </div>
            <Card>
              {dataExams.sections[activeSectionId].question_items[activeQuestionId]?.count && (
                <div className="font-bold">Questions {activeQuestionId + 1}-{activeQuestionId + dataExams.sections[activeSectionId].question_items[activeQuestionId]?.count} refer to the following passage</div>
              )}
              <div className="text-container" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId].question_items[activeQuestionId]?.practice_question?.paragraph }} />
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
                  <div className={`${dataExams.sections[activeSectionId].question_items[activeQuestionId]?.options[indexAnswer].correct === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2  p-3 border rounded-lg`} key={indexAnswer}>
                    <div className='flex  gap-2'>
                      {dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type === 'single' ? (
                        <div className="flex">
                          <div className="m-auto" >
                            {itemAnswer.correct === 1 ? (
                              <Image src='/asset/icon/table/ic_radio_active.svg' width={16} height={16} alt="icon radio button" />
                            ) : (
                              <div className="border w-4 rounded-full h-4" />
                            )}
                          </div>
                        </div>
                      ) : (
                        // if multiple answer
                        <div className="flex">
                          <div className="m-auto" >
                            {itemAnswer.correct === 1 ? (
                              <Image src='/asset/icon/table/ic_checkbox_active.svg' width={16} height={16} alt="icon radio button" />
                            ) : (
                              <div className="border w-4 rounded h-4" />
                            )}
                          </div>
                        </div>
                      )}
                      <span>{alphabet[indexAnswer]}.</span>
                      <div>{itemAnswer.title}</div>
                    </div>
                  </div>
                )
              })}
              <div className="font-bold mt-4">Answer Explanation</div>
              <div className="text-container leading-6" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_explanation }} />
              <div className="md:flex flex-row gap-4 ">
                <div className="w-full mt-4">
                  {activeQuestionId !== 0 && (
                    <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={() => {
                      setActiveQuestionId(activeQuestionId - 1)
                    }} >Previous</button>
                  )}
                </div>
                <div className="w-full mt-4">
                  {dataExams.sections[activeSectionId].question_items.length !== activeQuestionId + 1 && (
                    <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                      onClick={() => {
                        setActiveQuestionId(activeQuestionId + 1)
                      }}>Next</button>
                  )}
                  {dataExams.sections[activeSectionId].question_items.length === activeQuestionId + 1 && dataExams.sections.length !== activeSectionId + 1 && (
                    <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                      onClick={() => {
                        setActiveSectionId(activeSectionId + 1)
                        setActiveSection(dataExams.sections[activeSectionId + 1].name)
                        setActiveQuestionId(0)
                      }}>Continue to Next Section</button>
                  )}
                </div>
              </div>
            </Card>
            <div className="my-8 md:hidden" />
            <div className="md:hidden fixed bottom-0 w-full bg-white">
              <Link href="/student/attempted">
                <a>
                  <button className={`text-blue-1 bg-white border w-full  border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >Back to List Practice</button>
                </a>
              </Link>

              <Link href={`/student/practice/${id}/${idResult}/analysis`}>
                <a>
                  <button className={`text-blue-1 bg-white border w-full mt-2 border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >View Analysis</button>
                </a>
              </Link>
            </div>
          </div>
          <NavigationAnswerResult type="Practice" score={data?.score} totalScore={data?.practice?.total_score} markAnswer={markAnswer} correct={reviewSubmit[activeSectionId]?.correct} unanswered={0} totalQuestion={dataExams.sections[activeSectionId].question_items.length} listQuestion={dataExams.sections[activeSectionId].question_items} activeQuestionId={activeQuestionId} setActiveQuestionId={(id) => setActiveQuestionId(id)} url="/student/practice" urlAnalysis={`/student/practice/${id}/${idResult}/analysis`} incorrect={reviewSubmit[activeSectionId]?.incorrect} />
        </div>
      </div>
    </>
  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
Index.layout = LayoutTestResult