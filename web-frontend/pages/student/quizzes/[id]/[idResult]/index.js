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
  const [data, setData] = useState()
  const [resultDetails, setResultDetails] = useState(false)
  const [dataExams, setDataExams] = useState({
    questions: [{
      options: [{
        selected: 0
      }],
      result_details: [{
        correct: 0
      }
      ]
    }]
  })
  const [activeQuestionId, setActiveQuestionId] = useState(0)
  const [correctTotal, setCorrectTotal] = useState()
  const [unAnswered, setUnanswered] = useState()
  const [dataRank, setDataRank] = useState()
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
      await apiStudentPage.showQuizResult(id, idResult)
        .then((res) => {
          if (res.data.message === 'Detail data') {
            setData(res.data.data)
            setDataExams(res.data.data.quiz)
            let answerCount = []
            let unAnswered = []
            res.data.data.quiz.questions.map((itemQuestion) => {
              setResultDetails('data')
              if (itemQuestion.result_details?.length > 0) {
                if (itemQuestion.result_details[0].correct === 1) {
                  answerCount.push("correct")
                }
              } else {
                unAnswered.push("no answer")
              }
            })
            setCorrectTotal(answerCount.length)
            setUnanswered(unAnswered.length)
          }
          if (res.data.message === 'Please wait until live quiz ended') {
            setResultDetails('soon')
            setData(res.data)
          }
        })
    }
    const getRank = async () => {
      await apiStudentPage.showQuizResultRank(id, idResult)
        .then((res) => {
          setDataRank(res.data.data)
        })
    }
    getData()
    getRank()
  }, [])

  return (
    <>
      {resultDetails === 'soon' && (

        <div className="md:mt-12 mt-16 px-4 md:px-0">
          <BackButton/>
          <Card className="py-12">
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
      {resultDetails === 'data' && (
        <div className="min-w-full overflow-x-hidden">
          {/* <div className="flex bg-white md:hidden justify-between p-2 flex-row fixed w-full">
            <div className="font-bold text-2xl m-2">{dataExams.name}</div>
          </div> */}
          <div className="flex gap-4 mt-16 md:mt-12">
            <div className="w-full md:pr-4">
              <div className="flex overflow-x-hidden p-2 md:hidden flex-wrap gap-4">
                {dataExams.questions.map((item, index) => (
                  <div key={index} className={`
                    ${item.result_details[0]?.correct === 1 && 'bg-green-3 rounded-t-full border-1 border-green-1'}
                    ${item.result_details[0]?.correct === 0 && 'bg-red-2 rounded-b-full border-1 border-red-1'}
                    cursor-pointer flex w-12 h-12 border rounded`} onClick={() => setActiveQuestionId(index)}>
                    <div className="flex align-middle text-center m-auto">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              <Card>
                <h1 className="font-bold my-2">Question {activeQuestionId + 1}</h1>
                <div className="text-container leading-6" dangerouslySetInnerHTML={{ __html: dataExams.questions[activeQuestionId]?.question }} />
                {dataExams.questions[activeQuestionId].options.map((itemAnswer, indexAnswer) => {
                  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                  return (
                    <div className={`${dataExams.questions[activeQuestionId].options[indexAnswer].correct === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2  p-3 border rounded-lg`} key={indexAnswer}>
                      <div className='flex  gap-2'>
                        {dataExams.questions[activeQuestionId].answer_type === 'single' ? (
                          <div className="flex" >
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
                          <div className="flex" >
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
                <div className="text-container leading-6" dangerouslySetInnerHTML={{ __html: dataExams.questions[activeQuestionId].answer_explanation }} />
                <div className="md:flex flex-row gap-4 ">
                  <div className="w-full mt-4">
                    {activeQuestionId !== 0 && (
                      <button className={`text-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} onClick={() => {
                        setActiveQuestionId(activeQuestionId - 1)
                      }} >Previous</button>
                    )}
                  </div>
                  <div className="w-full mt-4">
                    {dataExams.questions.length !== activeQuestionId + 1 && (
                      <button className={`text-white bg-blue-1 py-2 px-4 border border-blue-1 w-full font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl`}
                        onClick={() => {
                          setActiveQuestionId(activeQuestionId + 1)
                        }}>Next</button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <NavigationAnswerResult type="Quiz" score={data?.score} totalScore={data?.quiz?.total_score} markAnswer={markAnswer} correct={correctTotal} unanswered={0} totalQuestion={dataExams.questions.length} listQuestion={dataExams.questions} activeQuestionId={activeQuestionId} setActiveQuestionId={(id) => setActiveQuestionId(id)} url="/student/quizzes" urlAnalysis={`/student/quizzes/${id}/${idResult}/analysis`} incorrect={dataExams.questions.length - correctTotal - unAnswered} dataRank={dataRank} />
          </div>
          <div className="my-8 md:hidden" />
          <div className="md:hidden fixed bottom-0 w-full bg-white">
            <Link href="/student/attempted">
              <a>
                <button className={`text-blue-1 bg-white border w-full  border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >Back to List Quizzes</button>
              </a>
            </Link>

            <Link href={`/student/quizzes/${id}/${idResult}/analysis`}>
              <a>
                <button className={`text-blue-1 bg-white border w-full mt-2 border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >View Analysis</button>
              </a>
            </Link>
          </div>
        </div>
      )
      }
    </>

  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
Index.layout = LayoutTestResult