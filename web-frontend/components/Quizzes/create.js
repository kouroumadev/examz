import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "../Cards/Card";
import { useForm } from "react-hook-form";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import QuillCreated from "../Editor/QuillMath";
import { Select } from '@chakra-ui/react'
import apiQuiz from "../../action/quiz";
import apiTopic from "../../action/topics";
import { MyDTPicker } from "../DateTime/DateTime";
import Button, { BackButton } from "../Button/button";
import { Stepper } from "../Section/Stepper";

export default function CreateQuiz({ role }) {
  const [file, setFile] = useState(null)
  const [coverName, setCoverName] = useState(null)
  const [errors, setErrors] = useState()
  const { register, handleSubmit, setValue, getValues } = useForm();
  const step = ['Quiz Details', 'Instruction', 'Question']
  const [currentStep, setCurrentStep] = useState(1)
  const [topics, setTopics] = useState([])
  const [type, setType] = useState()
  const [instruction, setInstruction] = useState('')
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [consenment, setConsentment] = useState([''])
  const [status, setStatus] = useState()
  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()

  const [questions, setQuestions] = useState([{
    id: 0,
    question: '',
    answer_type: "single",
    options: [{
      id: 0,
      title: '',
      correct: 0
    }]
  }
  ])
  const chooseImage = (e) => {
    setCoverName(e.target.files[0].name)
    // setImage(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0])
  }

  const getTopics = async () => {
    await apiTopic.all('', '', '')
      .then((res) => setTopics(res.data.data.data))
  }

  const submitQuiz = async (req) => {
    setErrors("")
    const data = new FormData()
    if (file !== null) {
      data.append("image", file)
    }
    data.append("name", req.name)
    data.append("type", req.type)
    if (req.type === 'live') {
      data.append("topic_id", req.topic_id)
      data.append("start_time", req.start_time)
      data.append("end_time", req.end_time)
    }
    data.append("duration", req.duration)
    // to step 2
    if (currentStep === 1) {
      await apiQuiz.create(data)
        .then()
        .catch((err) => {
          setErrors(err.response.data.data)
          if (!err.response.data.data.name && !err.response.data.data.duration && !err.response.data.data.start_time && !err.response.data.data.end_time) {
            setErrors(null)
            setCurrentStep(2)
          }
          return;
        })
      return null
    }

    data.append("instruction", instruction)
    if (req.consentments) {
      for (let i = 0; i < consenment.length; i++) {
        const field = `consentments[${i}]`
        data.append(`${field}`, consenment[i])
      }
    }
    // to step 3
    if (currentStep === 2) {
      await apiQuiz.create(data)
        .then()
        .catch((err) => {
          setErrors(err.response.data.data)
          if (!err.response.data.data["consentments"] && !err.response.data.data.instruction) {
            setErrors(null)
            setCurrentStep(3)
            // setCurrentStep(3)
          }
          return;
        })
      return null
    }

    for (let i = 0; i < req.questions.length; i++) {
      const field = `questions[${i}]`
      data.append(`${field}[level]`, req.questions[i].level)
      data.append(`${field}[tag]`, req.questions[i].tag)
      data.append(`${field}[mark]`, req.questions[i].mark)
      data.append(`${field}[answer_type]`, req.questions[i].answer_type)
      data.append(`${field}[negative_mark]`, req.questions[i].negative_mark)
      data.append(`${field}[question]`, req.questions[i].question)
      data.append(`${field}[answer_explanation]`, req.questions[i].answer_explanation)
      if (questions[i].options) {
        for (let j = 0; j < questions[i].options.length; j++) {
          const opt = `${field}[options][${j}]`
          data.append(`${opt}[correct]`, questions[i].options[j].correct === null ? 0 : questions[i].options[j].correct)
          data.append(`${opt}[title]`, questions[i].options[j].title)
        }

      }
    }
    // for (var key of data.entries()) {
    //   console.log(key[0] + ', ' + key[1]);
    // }
    data.append("status", status)
    await apiQuiz.create(data)
      .then((res) => {
        onOpenSuccessModal()
      })
      .catch((err) => {
        setErrors(err.response.data.data)
      })
  }

  useEffect(() => {
    getTopics()
  }, []);

  const setDataForm = (identifier, data) => {
    setValue(identifier, data)
  }

  return (
    <div className="mt-12 mb-48">
      <BackButton url={`/${role}/quizzes`} />
      <Card
        className="md:mt-4 w-full  bg-white overflow-visible"
        title="Create New Quiz " >
        <Stepper step={step} currentStep={currentStep} />
        <form onSubmit={handleSubmit(submitQuiz)}>

          {currentStep === 1 && (
            <div className="mb-8 test-sm">
              {type === 'live' && (
                <div className="flex">
                  {coverName === null && (
                    <div className="flex p-8 border-dashed w-48 border-blue-1 h-48 mt-4 border-4 border-black self-center justify-center text-sm">
                      <input type="file" accept="image/*" className="hidden" id="file-input" onChange={chooseImage} />
                      <div className="m-auto">
                        <label htmlFor="file-input">
                          <center>
                            <Image src="/asset/icon/ic_upload.png" alt="icon upload" htmlFor="" width={24} height={24} className="m-auto cursor-pointer" />
                          </center>
                        </label>
                        <p className="text-center text-blue-1">Upload Image</p>
                      </div>
                    </div>
                  )}
                  {coverName !== null && (
                    <div className="p-8 border-dashed border-4 border-black self-center justify-center">
                      <center>
                        <span>{coverName}</span> <span className="text-red-1 rounded border p-1 border-red-1 hover:cursor-pointer" onClick={() => setCoverName(null)}>x</span>
                      </center>
                    </div>
                  )}
                  <div className="my-auto ml-4 text-sm">
                    <p className="text-black-4">Maximum file size:</p>
                    <p className="font-bold">1 MB, image ration must be 1:1</p>
                  </div>
                </div>
              )}
              <div className="flex flex-col md:flex-row mt-4 gap-4 ">
                <div className="w-full">
                  <p>Quiz Name {errors && (
                    <span className="text-red-1 text-sm">{errors.name}</span>
                  )}</p>
                  <div>
                    <input type="text" className="form border w-full rounded p-2 h-full text-sm" placeholder="Input Quiz Name"  {...register("name")} />
                  </div>
                </div>
                {type === 'live' && (
                  <div className="w-full">
                    <p>Topic {errors && (
                      <span className="text-red-1 text-sm">{errors.topic}</span>
                    )}</p>
                    <div>
                      <select className="form w-full border bg-white p-2 text-sm rounded" placeholder="Choose Type" {...register("topic_id")} >
                        {topics.map((item, index) => (
                          <option key={index} value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row mt-4 gap-4" >
                <div className="w-full">
                  <p>Type {errors && (
                    <span className="text-red-1 text-sm">{errors.type}</span>
                  )}</p>
                  <div>
                    <select className="form w-full border h-full bg-white rounded p-2" placeholder="Choose Type" onClick={(e) => {
                      setType(e.target.value)
                    }} {...register("type")} >
                      <option value="mixed">Mixed Quiz</option>
                      <option value="live">Live Quiz</option>
                    </select>
                  </div>
                </div>
                <div className="w-full">
                  <p>Duration (Can be 0) {errors && (
                    <span className="text-red-1 text-sm">{errors.duration}</span>
                  )}</p>
                  <div >
                    <div className="flex h-full">
                      <input type="number" className="border w-full h-full flex-grow rounded p-2 text-sm" placeholder="0"  {...register("duration")} />
                      <input className="bg-black-9 p-2 w-24 text-center h-full border text-black-4" placeholder="Minute" disabled />
                    </div>
                  </div>
                </div>
              </div>

              {type === 'live' && (
                <div className="flex flex-col md:flex-row mt-4 mt-4 gap-4">
                  <div className="w-full">
                    <p>Start Time {errors && (
                      <span className="text-red-1 text-sm">{errors.start_time}</span>
                    )}</p>
                    <MyDTPicker data={startTime} setDate={(data) => {
                      setStartTime(data)
                      setValue("start_time", data)
                    }} />
                  </div>
                  <div className="w-full">
                    <p>End Time {errors && (
                      <span className="text-red-1 text-sm">{errors.end_time}</span>
                    )}</p>
                    <MyDTPicker data={endTime} setDate={(data) => {
                      setEndTime(data)
                      setValue("end_time", data)
                    }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <>
              <p className="mt-4">Instruction {errors && (
                <span className="text-red-1 text-sm">{errors['instruction']}</span>
              )}</p>
              <div className="w-full">
                <QuillCreated data={instruction} setData={(data) => setInstruction(data)} />
              </div>
              <p className="mt-4">Consentment</p>
              {consenment.map((item, index) => (
                <>{errors && (
                  <span className="text-red-1 text-sm">{errors[`consentments.${index}`]}</span>
                )}
                  <div key={index} className="flex">
                    <input key={index} type="text" value={item} onChange={(e) => {
                      const arr = consenment
                      arr[index] = e.target.value
                      setConsentment([...arr])

                      setValue(`consentments[${index}]`, e.target.value)
                    }} className="form border w-full rounded p-2 h-full m-1" autoComplete="off" placeholder="Input Consentment" />
                    {consenment.length !== 1 && (
                      <div className="m-auto cursor-pointer text-blue-1 -ml-8" onClick={() => {
                        let newArr = consenment
                        newArr.splice(index, 1)
                        setConsentment([...newArr])
                      }} >x</div>
                    )}
                  </div>
                </>
              ))}
              <div onClick={() => setConsentment([...consenment, ''])} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Consentment</div>
            </>
          )}

          {currentStep === 3 && (
            <div className="mt-8">
              <div className="bg-blue-6 p-4">
                {questions.map((eachQuestion, indexEachQuestion) => {
                  return (
                    <div className={`bg-white p-4 mt-8`} key={indexEachQuestion}>
                      <div className="font-bold text-xl">    Question {indexEachQuestion + 1}</div>

                      <div className="flex flex-col md:flex-row mt-4 gap-4">
                        <div className="w-full">
                          <p>Difficulty Level {errors && (
                            <span className="text-red-1 text-sm">{errors.type}</span>
                          )}</p>
                          <Select bg='white' {...register(`questions[${indexEachQuestion}].level`)} size="sm" variant='outline' iconColor="blue">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </Select>
                        </div>
                        <div className="w-full">
                          <p>Tag</p>
                          <Select bg='white' {...register(`questions[${indexEachQuestion}].tag`)} size="sm" variant='outline' iconColor="blue">
                            <option value="tag 1">tag 1</option>
                            <option value="tag 2">tag 2</option>
                            <option value="tag 3">tag 3</option>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="mt-4">Question {errors && (
                          <span className="text-red-1 text-sm">{errors[`questions.${indexEachQuestion}.question`]}</span>
                        )}</p>
                        <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                          <QuillCreated data='' register={(data) => setDataForm(`questions[${indexEachQuestion}].question`, data)} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="mt-4">Answer Type {errors && (
                          <span className="text-red-1 text-sm">{errors[`questions.${indexEachQuestion}.options`]}</span>
                        )}</p>
                        <select className="form w-full border bg-white p-2 text-sm rounded"  onClick={(e) => {
                          const temp = questions
                          temp.map((b) => {
                            if (b.id === eachQuestion.id) {
                              b.answer_type = e.target.value
                              const n = b.options.length
                              for (let i = 0; i < n; i++) {
                                b.options[i].correct = 0
                                setValue(`questions[${indexEachQuestion}].options[${i}].correct`, 0)
                              }
                            }
                          })
                          setQuestions([...temp])
                        }} {...register(`questions[${indexEachQuestion}].answer_type`)} size="sm" variant='outline' iconColor="blue">
                          <option value="single">Single Correct Answer</option>
                          <option value="multiple">Multiple Correct Answer</option>
                        </select>
                        {errors && (
                          <span className="text-red-1 text-sm">{errors[`questions.${indexEachQuestion}.options.0.correct`]}</span>
                        )}
                        {eachQuestion.options.map((itemAnswer, indexAnswer) => {
                          const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                          if (itemAnswer.correct === null) {
                            setValue(`questions[${indexEachQuestion}].options[${indexAnswer}].correct`, 0)
                          }
                          return (
                            <div className={`${itemAnswer.correct === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2 p-4 border rounded-lg text-sm`} key={indexAnswer}>
                              {errors && (
                                <span className="text-red-1 text-sm">{errors[`questions.${indexEachQuestion}.options.${indexAnswer}.title`]}</span>
                              )}
                              <div className='flex gap-2'>
                                {eachQuestion.answer_type === 'single' ? (
                                  <div className="flex cursor-pointer" onClick={() => {
                                    const temp = questions
                                    temp.map((b) => {
                                      if (b.id === eachQuestion.id) {
                                        b.options.map((optionQ) => {
                                          if (optionQ.id === itemAnswer.id) {
                                            optionQ.correct = 1
                                            setValue(`questions[${indexEachQuestion}].options[${indexAnswer}].correct`, 1)
                                          } else {
                                            for (let i = 0; i < b.options.length; i++) {
                                              if (i !== indexAnswer) {
                                                optionQ.correct = 0
                                                setValue(`questions[${indexEachQuestion}].options[${i}].correct`, 0)
                                              }
                                            }

                                          }
                                        })
                                      }
                                    })
                                    setQuestions([...temp])
                                  }}>
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
                                  <div className="flex cursor-pointer" onClick={() => {
                                    const temp = questions
                                    temp.map((b) => {
                                      if (b.id === eachQuestion.id) {
                                        b.options.map((optionQ) => {
                                          if (optionQ.id === itemAnswer.id) {
                                            const tempCorrect = !optionQ.correct
                                            optionQ.correct = tempCorrect ? 1 : 0
                                            setValue(`questions[${indexEachQuestion}].options[${indexAnswer}].correct`, tempCorrect ? 1 : 0)
                                          }
                                        })
                                      }
                                    })
                                    setQuestions([...temp])
                                  }}>
                                    <div className="m-auto" >
                                      {itemAnswer.correct === 1 ? (
                                        <Image src='/asset/icon/table/ic_checkbox_active.svg' width={16} height={16} alt="icon radio button" />
                                      ) : (
                                        <div className="border w-4 rounded h-4" />
                                      )}
                                    </div>
                                  </div>
                                  // <input className="m-auto" type="checkbox" id="html" {...register(`questions[${indexEachQuestion}].options[${indexAnswer}].correct`)} value="1" />
                                )}
                                <span className="m-auto">{alphabet[indexAnswer]}</span>
                                <input value={itemAnswer.title} onChange={(e) => {

                                  const temp = questions
                                  temp.map((b) => {
                                    if (b.id === eachQuestion.id) {
                                      b.options.map((optionQ) => {
                                        if (optionQ.id === itemAnswer.id) {
                                          const tempCorrect = !optionQ.correct
                                          optionQ.title = e.target.value
                                          setValue(`questions[${indexEachQuestion}].options[${indexAnswer}].title`, e.target.value)
                                        }
                                      })
                                    }
                                  })
                                  setQuestions([...temp])
                                }}
                                  autoComplete="off" type="text" className={`${itemAnswer.correct === 1 ? 'bg-blue-6 text-black-5' : 'bg-white'} form border w-full rounded p-2 h-full m-1`} placeholder="Input your answer" />
                                {eachQuestion.options.length !== 1 && (
                                  <div className="m-auto cursor-pointer text-blue-1 -ml-9" onClick={() => {

                                    const newOption = {
                                      id: eachQuestion.options[eachQuestion.options.length - 1].id + 1,
                                      title: '',
                                      correct: 0
                                    }
                                    const temp = questions
                                    temp.map((b) => {
                                      if (b.id === eachQuestion.id) {
                                        b.options = [...b.options.filter(i => i !== itemAnswer)]
                                      }
                                    })
                                    setQuestions([...temp])
                                  }} >
                                    <Image src="/asset/icon/table/fi_trash-2.svg" width={16} height={16} alt="icon delete" />
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                        <div onClick={() => {
                          const newOption = {
                            id: eachQuestion.options[eachQuestion.options.length - 1].id + 1,
                            title: '',
                            correct: null,
                            new: true
                          }
                          const temp = questions
                          temp.map((b) => {
                            if (b.id === eachQuestion.id) {
                              b.options = [...b.options, newOption]
                            }
                          })
                          setQuestions([...temp])
                        }} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Answer</div>
                        <div className="mt-4">
                          <p className="mt-4">Answer Explanation {errors && (
                            <span className="text-red-1 text-sm">{errors[`questions.${indexEachQuestion}.answer_explanation`]}</span>
                          )}</p>
                          <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                            <QuillCreated data='' register={(data) => setDataForm(`questions[${indexEachQuestion}].answer_explanation`, data)} />
                          </div>
                        </div>


                        <div className="flex flex-col md:flex-row mt-4 gap-4 mb-4">
                          <div className="w-full">
                            <p>Marks {errors && (
                              <span className="text-red-1 text-sm">{errors[`questions.${indexEachQuestion}.mark`]}</span>
                            )}</p>
                            <input type="number" step="0.01" className=" w-full form border rounded p-2" placeholder="0" {...register(`questions[${indexEachQuestion}].mark`)} />
                          </div>
                          <div className="w-full">
                            <p>Negative Marking {errors && (
                              <span className="text-red-1 text-sm">{errors[`questions.${indexEachQuestion}.negative_mark`]}</span>
                            )}</p>
                            <input type="number" step="0.01" className="w-full form border rounded p-2" placeholder="0" {...register(`questions[${indexEachQuestion}].negative_mark`)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div onClick={() => {
                const newQuestionItem = {
                  id: questions[questions.length - 1].id + 1,
                  question: '',
                  answer_type: 'single',
                  options: [{
                    id: 0,
                    title: '',
                    new: true,
                    correct: null
                  }]
                }
                setQuestions([...questions, newQuestionItem])
              }} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Question</div>
            </div>
          )}
          <div className="flex -z-10 gap-4 flex-row-reverse my-4">
            {currentStep < 3 && (<div className={`${3 > currentStep ? 'cursor-pointer' : 'cursor-default'}`}><Button title="Next Step" /></div>
            )}
            {currentStep === 3 && (
              <>
                <div onClick={() => setStatus("published")} ><Button title="Publish Quiz" /></div>
                <button onClick={() => setStatus("draft")} className="border border-blue-1 hover:bg-blue-6  rounded p-2" >Save to Draft</button>
              </>
            )}
            {currentStep > 1 ? (<div onClick={() => {
              currentStep > 1 && setCurrentStep(currentStep - 1)
            }} className={`${1 < currentStep ? 'cursor-pointer' : 'cursor-default'} my-auto text-black-4 p-2 rounded-lg`}>Back Step</div>
            ) : (
              <Link href={`/${role}/quizzes`}>
                <a className="text-black-4 p-2">
                  Cancel
                </a>
              </Link>
            )}
          </div>
        </form>
      </Card>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModal} onClose={onCloseSuccessModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md"><center>Success</center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col text-center text-sm">
              {status === 'published' ?
                (
                  <p> Quiz has published </p>
                ) : (

                  <p>Quiz saved as Draft </p>
                )
              }
              <div className="self-center">
                <Link href={`/${role}/quizzes`}>
                  <a> <Button title="Okay" className="mt-4" /></a>
                </Link>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div >
  )
}