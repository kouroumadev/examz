import apiStudentPage from "../../../../../action/student_page"
import { useState, useEffect } from "react";
import Card from '../../../../../components/Cards/Card'
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/router";
import NavigationAnswerResult from "../../../../../components/Navbar/NavigationAnswerResult";
import LayoutTestResult from "../../../../../Layout/LayoutTest Result";
import { BackButton } from "../../../../../components/Button/button";


export default function Index() {
  const Router = useRouter()
  const { id } = Router.query
  const { idResult } = Router.query
  const [detailResult, setDetailResult] = useState(false)
  const [dataExams, setDataExams] = useState({
    sections: [{
      question_items: [{
        options: [{
          selected: 0
        }],
        result_details: [{
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
      await apiStudentPage.showExamsResult(id, idResult)
        .then((res) => {
          console.log(res.data)
          if (res.data.message === 'Detail data') {
            setData(res.data.data)
            setDataExams(res.data.data.exam)
            setActiveSection(res.data.data.exam.sections[0].name)
            const Rsubmit = []
            res.data.data.exam.sections.map((item) => {
              setDetailResult('data')
              const dataResult = {
                name: item.name,
                total: item.question_items.length,
              }
              Rsubmit.push(dataResult)
            })
            setReviewSubmit(Rsubmit)
            setRenderCount(!renderCount)
          }
          if (res.data.message === 'Please wait until live exam ended') {
            setDetailResult('soon')
            setData(res.data)

          }
        })
    }
    getData()
  }, [])


  useEffect(() => {
    const countReviewResult = () => {
      dataExams.sections.map((itemSection) => {
        let correctAnswer = 0
        let wrongAnswer = 0;
        let unAnswered = 0;
        itemSection.question_items.map((itemQuestion) => {
          if (itemQuestion.result_details?.length > 0) {
            if (itemQuestion.result_details[0].correct) {
              correctAnswer += 1;
            } else {
              wrongAnswer += 1;
            }
          } else {
            unAnswered += 1;
          }
        })
        let temp = reviewSubmit
        temp.map((item) => {
          if (item.name === itemSection.name) {
            item.total = correctAnswer + wrongAnswer + unAnswered;
            item.correct = correctAnswer
            item.incorrect = wrongAnswer;
            item.unanswered = unAnswered;
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
      {detailResult === 'soon' && (
        <div className="md:mt-12 mt-16 px-4 md:px-0">
        <BackButton url="/"/>
        <Card className="p-12">
          <div className="flex px-8 py-auto">
            <div className="my-auto mx-auto flex-col text-center px-auto">
              <img src="/asset/icon/table/ic_upcomingResult.svg" className="px-auto mx-auto mb-8" />
              <p className="font-bold text-xl">{data?.message} on {data?.data?.end_time}</p>
              <p className="">Result test will appear in {data?.data?.ended}</p>
            </div>
          </div>
        </Card>
        </div>
      )}
      {detailResult === 'data' && (
        <>
          <div className="flex bg-white md:hidden  border-b  flex-row top-0 fixed w-full">
            <div className="font-bold text-2xl m-2">{dataExams.name}</div>
          </div>
          <div className="my-12" />
          <div className="mt-12 min-w-full overflow-x-hidden">
            <div className="flex gap-4">
              <div className="w-full md:pr-4">
                <div className="flex  gap-4 bg-white md:rounded-lg pt-4 px-4 mb-4">
                  {dataExams.sections.map((item, index) => (
                    <div key={index} className={` ${activeSection === item.name ? 'text-blue-1 border-b-2 border-blue-1 font-bold' : 'text-black-5'}  pb-4 cursor-pointer`} onClick={() => {
                      setActiveSectionId(index)
                      setActiveSection(item.name)
                      setActiveQuestionId(0)
                    }}>
                      {item?.name}
                    </div>
                  ))}
                </div>
                <div className="flex overflow-x-scroll p-2 md:hidden">
                  {dataExams.sections[activeSectionId].question_items.map((item, index) => (
                    <div key={index} id={index}>
                      <div key={index} className={` ${ item.result_details.length === 0 ? 'cursor-pointer flex-nowrap w-12 flex  h-12 border rounded m-2' : (item.result_details[0].correct? 'bg-green-3 rounded-t-full border-1 border-green-1' :' bg-red-2 rounded-b-full border-1 border-red-1') }`} onClick={() => setActiveQuestionId(index)}>
                        <div className="flex align-middle text-center m-auto">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Card>
                  {dataExams.sections[activeSectionId].question_items[activeQuestionId]?.count && (
                    <div className="font-bold">Questions {activeQuestionId + 1}-{activeQuestionId + dataExams.sections[activeSectionId].question_items[activeQuestionId]?.count} refer to the following passage</div>
                  )}
                  <div className="text-container" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId].question_items[activeQuestionId]?.exam_question?.paragraph }} />
                  <h1 className="font-bold my-2">Question {activeQuestionId + 1}</h1>
                  <div className="text-container leading-6" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId].question_items[activeQuestionId]?.question }} />
                  {dataExams.sections[activeSectionId].question_items[activeQuestionId]?.options.map((itemAnswer, indexAnswer) => {
                    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                    //  single correct answer => 1 => answer and selected answer is same(green) 2(red) => answer and selected answer is different 3(purple)=> you did not select this correct answer (4) this is just an option
                    //  multiple correct answer => 1(green) => this option is selected and its one of the correct answers (red) => option is selected but its not correct option 3(purple) => you did not select this correct answer
                    let selectedOption = 4;
                    if(dataExams.sections[activeSectionId].question_items[activeQuestionId]?.result_details.length > 0){
                      dataExams.sections[activeSectionId].question_items[activeQuestionId]?.result_details[0].detail_options.map((option)=>{
                        if(option.exam_option_id === itemAnswer.id) {
                          selectedOption = itemAnswer.correct? 1:2;
                        }
                      })
                    }
                    if(selectedOption !== 1 && selectedOption !== 2){
                      selectedOption = itemAnswer.correct? 3 : 4;
                    }
                    return (
                      <div className={`${dataExams.sections[activeSectionId].question_items[activeQuestionId]?.options[indexAnswer].correct ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2  p-3 border rounded-lg`} key={indexAnswer}>
                        <div className='flex  gap-2'>
                          {dataExams.sections[activeSectionId].question_items[activeQuestionId].answer_type === 'single' ? (
                            <div className="flex">
                              <div className="m-auto" >
                                {itemAnswer.correct ? (
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
                                {itemAnswer.correct ? (
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
                      <button className={`text-blue-1 bg-white border w-full  border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >Back to List Exams</button>
                    </a>
                  </Link>

                  <Link href={`/student/exams/${id}/${idResult}/analysis`}>
                    <a>
                      <button className={`text-blue-1 bg-white border w-full mt-2 border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >View Analysis</button>
                    </a>
                  </Link>
                </div>
              </div>
              <NavigationAnswerResult type="Exams" score={data?.score} totalScore={data?.exam?.total_score} markAnswer={markAnswer} correct={reviewSubmit[activeSectionId]?.correct} unanswered={reviewSubmit[activeSectionId]?.unanswered} totalQuestion={dataExams.sections[activeSectionId].question_items.length} listQuestion={dataExams.sections[activeSectionId].question_items} activeQuestionId={activeQuestionId} setActiveQuestionId={(id) => setActiveQuestionId(id)} url="/student/exams" urlAnalysis={`/student/exams/${id}/${idResult}/analysis`} incorrect={reviewSubmit[activeSectionId]?.incorrect} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
Index.layout = LayoutTestResult