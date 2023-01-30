import LayoutTest from "../../../../../Layout/LayoutTest"
import apiStudentPage from "../../../../../action/student_page"
import apiExamCategoryType from '../../../../../action/ExamCategoryType';
import { useState, useEffect } from "react";
import Card from '../../../../../components/Cards/Card'
import { useDisclosure } from '@chakra-ui/react'
import ResultModal  from '../../../../../components/Modal/ModalResult'
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import LayoutTestResult from "../../../../../Layout/LayoutTest Result";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Index() {
  const Router = useRouter()
  const { id } = Router.query
  const { idResult } = Router.query
  const [dataChart, setDataChart] = useState([])
  const [data, setData] = useState()
  const [details, setDetails] = useState([])
  const [activeQuestionId, setActiveQuestionId] = useState(0)
  const [examCatId, setExamCatId] = useState()
  const [sectionName, setSectionName] = useState('')
  const [mark, setMark] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState(0)
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

  const {
    isOpen: isModalSection,
    onOpen: onOpenModalSection,
    onClose: onCloseModalSection
  } = useDisclosure()

  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.showExamsResultAnalysis(id, idResult)
        .then((res) => {
          // console.log(res.data.data.sections)
          setData(res.data.data)
          const level = []
          const score = []
          const percentage = []
          res.data.data.sections.map((item) => {
            // console.log(item)
            level.push(item.created_at)
            score.push(item?.details?.easy)
            score.push(item?.details?.medium)
            score.push(item?.details?.hard)
            percentage.push(item?.percentage?.easy)
            percentage.push(item?.percentage?.medium)
            percentage.push(item?.percentage?.hard)
          })
          const temp = res.data.data.sections
          temp.map((item) => {
            item.bar = {
              options: {
                chart: {
                  id: "basic-bar"
                },
                xaxis: {
                  categories: ['Easy', 'Medium', 'Hard']
                }
              },
              series: [{
                name: "series-1",
                data: [item.details.easy, item.details.medium, item.details.hard]
              }]
            }
            item.pie = {

              series: [item.percentage.easy, item.percentage.medium, item.percentage.hard],
              options: {
                chart: {
                  width: 380,
                  type: 'pie',
                },
                legend: {
                  position: 'bottom'
                },
                labels: ['Easy', 'Medium', 'Hard'],
                responsive: [{
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                }]
              },
            };
          })
          setDataChart([...temp])
        })
    }
    getData()
  }, [])

  useEffect(async () => {

    const configData = []
    const getMarks = async () => {
      await apiExamCategoryType.allConfig()
        .then((res) => {   
           configData.push(res.data.data)
        })
    }
     getMarks()

    //  console.log('toi')
    //  console.log(configData)

    const getDetails = async () => {
      await apiStudentPage.showExamsResultDetails(id, idResult)
      .then((res) => {
        const slug = res.data.data.exam.slug
        const id = res.data.data.id
        // const totalIncorrect = []
        //  console.log(res.data.data.exam.exam_category_id)
        // console.log("new data")
        // console.log(res.data.data)
        setExamCatId(res.data.data.exam.exam_category_id)

        const tout = []
         const temp = res.data.data.exam.sections
          temp.map((section) => {
            let secName = section.exam_name
            let moi = []
            let maxCorrect = []
            let maxIncorrect = []
            let mark = ''
            let negMark = ''
            section.question_items.map((item) => {
              let quesLevel = item.question_level
              let ans = 0
              item.result_details.map((val) => {
                ans = val.correct
                if(val.correct == 1) {
                  maxCorrect.push('i')
                } else if (val.correct == 0) {
                  maxIncorrect.push('i')
                }
              })
              configData[0].map((i) => {
                if(res.data.data.exam.exam_category_id == i.exam_category_id) {
                  i.data.sections.map((j) => {
                    if(secName == j.name) {
                      mark = j.questions.mark
                      negMark = j.questions.negative_mark
                    }
                  })
                }
              })
              const rep = {
                questionLevel: quesLevel,
                correct: ans
              }

             moi.push(rep)

            })

            const rep = {
              id: id,
              slug: slug,
              sectionName: secName,
              mark: mark,
              negative_mark: negMark,
              max_correct: maxCorrect.length,
              max_incorrect: maxIncorrect.length,
              score: mark*maxCorrect.length - negMark*maxIncorrect.length,
              data : [...moi]
            }
            tout.push(rep)
          })
        //  setDetails([...temp])
         setDetails(tout)
      })
    }
    getDetails()

    //  console.log('neW')
    //  console.log(details)


    // get modal data
    const getModalData = async () => {
      await apiStudentPage.showExamsResult(id, idResult)
        .then((res) => {   
          if (res.data.message === 'Detail data') {
            setData(res.data.data)
            setDataExams(res.data.data.exam)
            console.log('nee')
            console.log(res.data.data.exam)
          }
        })
    }
     getModalData()
   
  }, [])

  return (
    
    <html>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />      
      </head>
      <body>
        <div className="container py-1">

            <div className="row mt-5 mb-4 justify-content-center">
              <div className="col-md-12 justify-content-center">
                <h3 className="">Impact of Incorrect Answers !</h3>
                <p>This Analysis shows Negative marks have hampered your score at, both the subject and the overall level</p>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col" className="table-primary">Sections</th>
                      {/* <th className="table-primary">Attempt</th> */}
                      <th className="table-primary">No. of Correct Response</th>
                      <th className="table-primary">No. of Incorrect Response</th>
                      <th className="table-primary">Marks from Correct Response</th>
                      <th className="table-primary">Marks from Incorrect Response</th>
                      <th className="table-primary">Actual Scored</th>
                    </tr>
                  </thead>
                  <tbody>

                    {details.map((item, index) => (
                        <tr key={index}>
                          <th scope="row" className="table-primary">{item.sectionName}</th>
                          {/* <td>NA</td> */}
                          <td>{item.max_correct}</td>
                          <td>{item.max_incorrect}</td>
                          <td>{item.mark}</td>
                          <td class="table-secondary">{item.negative_mark}</td>
                          <td>{item.score}</td>
                      </tr>
                    ))}
                    
                  </tbody>
                </table>
              </div>
              
            </div> 

            <div className="row mt-5 justify-content-center">
              <div className="col-12 col-md-12">
                <h5>Selection and Accurency: Individual Question Breakup</h5>
                <div className="row no-gutters justify-content-start">
                  <div className="col-12 col-md-6">
                    <div class="row justify-content-start">
                      <div className="col-12 col-md-2">
                        <span class="badge badge-pill badge-primary p-2">Correct </span>
                      </div>
                      <div className="col-12 col-md-2">
                        <span class="badge badge-pill badge-danger p-2">Incorrect</span>
                      </div>
                      <div className="col-12 col-md-2">
                        <span class="badge badge-pill badge-info p-2">Not Attempted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3 justify-content-center">
              <div className="col-md-12 justify-content-center">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Attempts (Acc %)</th>
                      <th className="table-primary">Easy</th>
                      <th className="table-info">Medium</th>
                      <th className="table-danger">Hard</th>
                    </tr>
                  </thead>
                  <tbody>

                    {/* <tr>
                      <th>maths</th>
                      <td>2</td>
                      <td>2</td>
                      <td>2</td>
                    </tr> */}

                   {details.map((itemm, indexx) => (
                    <tr key={indexx}>
                      <th scope="row">{itemm.sectionName}</th>             
                      <td>
                        {itemm.data.map((item, index) => (
                          item.questionLevel == 'easy' && (
                          // <Link key={index} href={`/student/exams/${itemm.slug}/${itemm.id}`}>
                          //   <a>
                          //     <span 
                          //       key={index} 
                          //       class={"btn badge badge-pill " +(item?.correct == 1 ? ' badge-primary' : ' badge-danger') }
                          //     >{index + 1}
                          //     </span>
                          //   </a>
                          // </Link>
                          <span 
                                key={index} 
                                class={"btn badge badge-pill " +(item?.correct == 1 ? ' badge-primary' : ' badge-danger') }
                                onClick={() => {
                                  setSectionName(itemm.sectionName)
                                  setActiveQuestionId(index)
                                  setActiveSectionId(indexx)
                                  onOpenModalSection()
                                }}
                              >{index + 1}
                          </span>
                          )
                        ))}
                      </td>
                      <td>
                        {itemm.data.map((item, index) => (
                          item.questionLevel == 'medium' && (
                            // <Link key={index} href={`/student/exams/${itemm.slug}/${itemm.id}`}>
                            //   <a>
                            //     <span 
                            //       key={index} 
                            //       class={"btn badge badge-pill " +(item?.correct == 1 ? ' badge-primary' : ' badge-danger') }
                            //     >{index + 1}
                            //     </span>
                            //   </a>
                            // </Link>
                            <span 
                                key={index} 
                                class={"btn badge badge-pill " +(item?.correct == 1 ? ' badge-primary' : ' badge-danger') }
                                onClick={() => {
                                  setSectionName(itemm.sectionName)
                                  setActiveQuestionId(index)
                                  setActiveSectionId(indexx)
                                  onOpenModalSection()
                                }}
                              >{index + 1}
                          </span>
                          )
                        ))}
                      </td>
                      <td>
                        {itemm.data.map((item, index) => (
                          item.questionLevel == 'hard' && (
                            // <Link key={index} href={`/student/exams/${itemm.slug}/${itemm.id}`}>
                            //   <a>
                            //     <span 
                            //       key={index} 
                            //       class={"btn badge badge-pill " +(item?.correct == 1 ? ' badge-primary' : ' badge-danger') }
                            //     >{index + 1}
                            //     </span>
                            //   </a>
                            // </Link>
                            <span 
                                key={index} 
                                class={"btn badge badge-pill " +(item?.correct == 1 ? ' badge-primary' : ' badge-danger') }
                                onClick={() => {
                                  setSectionName(itemm.sectionName)
                                  setActiveQuestionId(index)
                                  setActiveSectionId(indexx)
                                  onOpenModalSection()
                                }}
                              >{index + 1}
                          </span>
                          )
                        ))}
                      </td>
                                                          
                    </tr>
                  ))} 
                    
                   
                  </tbody>
                </table>
              </div>
            </div>

           

        </div>
        <ResultModal isOpen={isModalSection} onClose={onCloseModalSection} sectionName={sectionName} dataExams={dataExams} activeSectionId={activeSectionId} activeQuestionId={activeQuestionId} />
    
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
      </body>
    </html>

    
  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
Index.layout = LayoutTestResult