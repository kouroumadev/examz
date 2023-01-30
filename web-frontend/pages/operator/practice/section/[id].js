import { useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "../../../../components/Cards/Card";
import Layout from "../../../../Layout/Layout";
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
import QuillCreated from "../../../../components/Editor/QuillMath";
import { Select } from '@chakra-ui/react'
import apiPractice from "../../../../action/practice";
import { useRouter } from "next/router";
import Button, { BackButton } from "../../../../components/Button/button";

export default function Create(props) {
  const Router = useRouter()
  const { id } = Router.query
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [errors, setErrors] = useState()
  const { register, handleSubmit, setValue, getValues, unregister } = useForm();
  const [status, setStatus] = useState()
  const [questionType, setQuestionType] = useState()
  const [idSection, setIdSection] = useState()
  const [firstNumber, setFirstNumber] = useState(0)
  const [questions, setQuestions] = useState([
    {
      id: 0,
      type: Router.asPath.split('#')[1] === 'simple' ? 'simple' : 'paragraph',
      question_items: [{
        id: 0,
        question: '',
        answer_type: "single",
        options: [{
          id: 0,
          title: '',
          correct: 0
        }]
      }]
    },
  ])

  const getDetail = async () => {
    const idExam = Router.query.id
    const idSecti = idExam.split("=")
    const ids = idSecti[1]
    await apiPractice.detailSection(id)
      .then((res) => {
        const data = res.data.data.sections
        data.map((item) => {
          if (item.id === ids) {
            setFirstNumber(item.questions_count + 1)
          }
        })
      })
  }

  const submitQuiz = async (data) => {
    for (let h = 0; h < data.questions.length; h++) {
      for (let i = 0; i < data.questions[h].question_items.length; i++) {
        const currentOption = [...data.questions[h].question_items[i].options]
        const finalOptions = []
        for (let b = 0; b < currentOption.length; b++) {
          if (typeof currentOption[b].deleteNew === "undefined") {
            finalOptions.push(currentOption[b])
          }
        }
        data.questions[h].question_items[i].options = finalOptions
      }
    }
    await apiPractice.createQuestion(data)
      .then((res) => {
        onOpenSuccessModal()
      })
      .catch((err) => {
        setErrors(err.response.data.data)
      })
  }

  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()

  useEffect(() => {
    const idExam = Router.query.id
    getDetail(idExam)
    const idSection = Router.asPath.split('=')[1]
    const num = idSection.split('#')[0]
    setIdSection(num)
    setValue("section_id", num)
  }, []);

  const setDataForm = (identifier, data) => {
    setValue(identifier, data)
  }

  return (
    <div className="mt-12">
      <BackButton url="/operator/practice" />
      <Card
        className="w-full  bg-white overflow-visible" >
        <form onSubmit={handleSubmit(submitQuiz)}>
          {questions.map((itemQuestion, indexQuestion) => {
            return (
              <div className="bg-blue-6 p-4 text-sm" key={indexQuestion}>
                <input type="text" hidden value={itemQuestion.type}  {...register(`questions.${indexQuestion}.type`)} />
                {itemQuestion.type === "simple" && (
                  <div className="flex justify-between mt-2 bg-white p-4">
                    <div className="text-sm font-bold">{firstNumber + indexQuestion + 1}. {itemQuestion.type === 'simple' ? 'Simple' : 'Paragraph'} Question</div>
                  </div>
                )}
                {itemQuestion.type === 'paragraph' && (
                  <>
                    <div className="flex justify-between mt-2">
                      <div className="text-1xl font-bold">{firstNumber + indexQuestion + 1}. {itemQuestion.type === 'simple' ? 'Simple' : 'Paragraph'} Question</div>
                    </div>
                    <div className="flex flex-col md:flex-row mt-4 gap-4">
                      <div className="w-full">
                        <p>Difficulty Level {errors && (
                          <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.level`]}</span>
                        )}</p>
                        <Select bg='white' {...register(`questions[${indexQuestion}].level`)} size="sm" variant='outline' iconColor="blue">
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </Select>
                      </div>
                      <div className="w-full">
                        <p>Tag</p>
                        <Select bg='white' {...register(`questions[${indexQuestion}].tag`)} size="sm" variant='outline' iconColor="blue">
                          <option value="tag 1">tag 1</option>
                          <option value="tag 2">tag 2</option>
                          <option value="tag 3">tag 3</option>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="mt-4">Instruction {errors && (
                        <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.instruction`]}</span>
                      )}</p>
                      <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >

                        {/* <textarea {...register(`questions[${indexQuestion}].question`)} /> */}
                        <QuillCreated data='' register={(data) => setDataForm(`questions[${indexQuestion}].instruction`, data)} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="mt-4">Paragraph {errors && (
                        <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.paragraph`]}</span>
                      )}</p>
                      <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                        {/* <textarea {...register(`questions[${indexQuestion}].question`)} /> */}
                        <QuillCreated data='' register={(data) => setDataForm(`questions[${indexQuestion}].paragraph`, data)} />
                      </div>
                    </div>
                  </>
                )}

                {/* question */}
                {itemQuestion.question_items.map((eachQuestion, indexEachQuestion) => {
                  return (
                    <div className={`bg-white p-4 ${itemQuestion.type === "paragraph" && 'mt-8'}`} key={indexEachQuestion}>
                      {itemQuestion.type === "paragraph" && (
                        <div className="flex justify-between mt-2 bg-white">
                          <div className="text-2xl ">{indexEachQuestion + 1}. Question</div>
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row mt-4 gap-4">
                        <div className="w-full">
                          <p>Difficulty Level {errors && (
                            <span className="text-red-1 text-sm">{errors.type}</span>
                          )}</p>
                          <Select bg='white' {...register(`questions[${indexQuestion}].question_items[${indexEachQuestion}].level`)} size="sm" variant='outline' iconColor="blue">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </Select>
                        </div>
                        <div className="w-full">
                          <p>Tag</p>
                          <Select bg='white' {...register(`questions[${indexQuestion}].question_items[${indexEachQuestion}].tag`)} size="sm" variant='outline' iconColor="blue">
                            <option value="tag 1">tag 1</option>
                            <option value="tag 2">tag 2</option>
                            <option value="tag 3">tag 3</option>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="mt-4">Question {errors && (
                          <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.question_items.${indexEachQuestion}.question`]}</span>
                        )}</p>
                        <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                          <QuillCreated data='' register={(data) => setDataForm(`questions[${indexQuestion}].question_items[${indexEachQuestion}].question`, data)} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="mt-4">Answer Type {errors && (
                          <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.options`]}</span>
                        )}</p>
                        <Select bg='white' onClick={(e) => {
                          const temp = questions
                          temp.map((itemQ) => {
                            if (itemQ.id === itemQuestion.id) {
                              itemQ.question_items.map((b) => {
                                if (b.id === eachQuestion.id) {
                                  b.answer_type = e.target.value
                                  const n = b.options.length
                                  for (let i = 0; i < n; i++) {
                                    b.options[i].correct = 0
                                    setValue(`questions[${indexQuestion}].question_items[${indexEachQuestion}].options[${i}].correct`, 0)
                                  }
                                }
                              })
                            } else {
                              itemQ
                            }
                          })
                          setQuestions([...temp])
                        }} {...register(`questions[${indexQuestion}].question_items[${indexEachQuestion}].answer_type`)} size="sm" variant='outline' iconColor="blue">
                          <option value="single">Single Correct Answer</option>
                          <option value="multiple">Multiple Correct Answer</option>
                        </Select>
                        {errors && (
                          <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.question_items.${indexEachQuestion}.options.0.correct`]}</span>
                        )}
                        {eachQuestion.options.map((itemAnswer, indexAnswer) => {
                          const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                          if (itemAnswer.new) {
                            if (itemAnswer.correct === null) {
                              setValue(`questions[${indexQuestion}].question_items[${indexEachQuestion}].options[${indexAnswer}].correct`, 0)
                            }
                          }
                          return (
                            <div className={`${itemAnswer.correct === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2  p-4 border rounded-lg`} key={indexAnswer}>
                              {errors && (
                                <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.question_items.${indexEachQuestion}.options.${indexAnswer}.title`]}</span>
                              )}
                              <div className='flex gap-2'>
                                {eachQuestion.answer_type === 'single' ? (
                                  <div className="flex cursor-pointer" onClick={() => {
                                    const temp = questions
                                    temp.map((itemQ) => {
                                      if (itemQ.id === itemQuestion.id) {
                                        itemQ.question_items.map((b) => {
                                          if (b.id === eachQuestion.id) {
                                            b.options.map((optionQ) => {
                                              if (optionQ.id === itemAnswer.id) {
                                                optionQ.correct = 1
                                                setValue(`questions[${indexQuestion}].question_items[${indexEachQuestion}].options[${indexAnswer}].correct`, 1)
                                              } else {
                                                for (let i = 0; i < b.options.length; i++) {
                                                  if (i !== indexAnswer) {
                                                    optionQ.correct = 0
                                                    setValue(`questions[${indexQuestion}].question_items[${indexEachQuestion}].options[${i}].correct`, 0)
                                                  }
                                                }

                                              }
                                            })
                                          }
                                        })
                                      } else {
                                        itemQ
                                      }
                                    })
                                    setQuestions([...temp])
                                  }}>
                                    <div className="m-auto" >
                                      {itemAnswer.correct === 1 ? (
                                        <Image src='/asset/icon/table/ic_radio_active.svg' width={16} height={16} alt="icon radio button"/>
                                      ) : (
                                        <div className="border w-4 rounded-full h-4" />
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  // if multiple answer
                                  <div className="flex cursor-pointer" onClick={() => {
                                    const temp = questions
                                    temp.map((itemQ) => {
                                      if (itemQ.id === itemQuestion.id) {
                                        itemQ.question_items.map((b) => {
                                          if (b.id === eachQuestion.id) {
                                            b.options.map((optionQ) => {
                                              if (optionQ.id === itemAnswer.id) {
                                                const tempCorrect = !optionQ.correct
                                                optionQ.correct = tempCorrect ? 1 : 0
                                                setValue(`questions[${indexQuestion}].question_items[${indexEachQuestion}].options[${indexAnswer}].correct`, tempCorrect ? 1 : 0)
                                              }
                                            })
                                          }
                                        })
                                      } else {
                                        itemQ
                                      }
                                    })
                                    setQuestions([...temp])
                                  }}>
                                    <div className="m-auto" >
                                      {itemAnswer.correct === 1 ? (
                                        <Image src='/asset/icon/table/ic_checkbox_active.svg' width={16} height={16} alt="icon radio button"/>
                                      ) : (
                                        <div className="border w-4 rounded h-4" />
                                      )}
                                    </div>
                                  </div>

                                  // <input className="m-auto" type="checkbox" id="html" {...register(`questions[${indexQuestion}].question_items[${indexEachQuestion}].options[${indexAnswer}].correct`)} value="1" />
                                )}
                                <span className="m-auto">{alphabet[indexAnswer]}</span>
                                <input value={itemAnswer.title} onChange={(e) => {

                                  const temp = questions
                                  temp.map((itemQ) => {
                                    if (itemQ.id === itemQuestion.id) {
                                      itemQ.question_items.map((b) => {
                                        if (b.id === eachQuestion.id) {
                                          b.options.map((optionQ) => {
                                            if (optionQ.id === itemAnswer.id) {
                                              optionQ.title = e.target.value
                                              setValue(`questions[${indexQuestion}].question_items[${indexEachQuestion}].options[${indexAnswer}].title`, e.target.value)
                                            }
                                          })
                                        }
                                      })
                                    } else {
                                      itemQ
                                    }
                                  })
                                  setQuestions([...temp])
                                }}
                                  // {...register(`questions[${indexQuestion}].question_items[${indexEachQuestion}].options[${indexAnswer}].title`)} 
                                  autoComplete="off" type="text" className={`${itemAnswer.correct === 1 ? 'bg-blue-6 text-black-5' : 'bg-white'} form border w-full rounded p-2 h-full m-1`} placeholder="Input your answer" />
                                {eachQuestion.options.length !== 1 && (
                                  <div className="m-auto cursor-pointer text-blue-1 -ml-9" onClick={() => {
                                    const temp = questions
                                    temp.map((itemQ) => {
                                      if (itemQ.id === itemQuestion.id) {
                                        itemQ.question_items.map((b) => {
                                          if (b.id === eachQuestion.id) {
                                            b.options = [...b.options.filter(i => i !== itemAnswer)]
                                          }
                                        })
                                      } else {
                                        itemQ
                                      }
                                    })
                                    setValue(`questions[${indexQuestion}].question_items[${indexEachQuestion}].options[${indexAnswer}].deleteNew`, true)
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
                          temp.map((itemQ) => {
                            if (itemQ.id === itemQuestion.id) {
                              itemQ.question_items.map((b) => {
                                if (b.id === eachQuestion.id) {
                                  b.options = [...b.options, newOption]
                                }
                              })
                            } else {
                              itemQ
                            }
                          })
                          setQuestions([...temp])
                        }} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Answer</div>
                        <div className="mt-4">
                          <p className="mt-4">Answer Explanation {errors && (
                            <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.question_items.${indexEachQuestion}.answer_explanation`]}</span>
                          )}</p>
                          <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                            <QuillCreated data='' register={(data) => setDataForm(`questions[${indexQuestion}].question_items[${indexEachQuestion}].answer_explanation`, data)} />
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row mt-4 gap-4 mb-4">
                          <div className="w-full">
                            <p>Marks {errors && (
                              <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.question_items.${indexEachQuestion}.mark`]}</span>
                            )}</p>
                            <input type="number" step="0.01" className=" w-full form border rounded p-2" placeholder="0" {...register(`questions[${indexQuestion}].question_items[${indexEachQuestion}].mark`)} />
                          </div>
                          <div className="w-full">
                            <p>Negative Marking {errors && (
                              <span className="text-red-1 text-sm">{errors[`questions.${indexQuestion}.question_items.${indexEachQuestion}.negative_mark`]}</span>
                            )}</p>
                            <input type="number" step="0.01" className="w-full form border rounded p-2" placeholder="0" {...register(`questions[${indexQuestion}].question_items[${indexEachQuestion}].negative_mark`)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {itemQuestion.type === 'paragraph' && (<div className="mt-8">
                  <div onClick={() => {
                    const newQuestionItem = {
                      id: itemQuestion.question_items[itemQuestion.question_items.length - 1].id + 1,
                      question: '',
                      answer_type: 'single',
                      options: [{
                        id: 0,
                        title: '',
                        correct: 0
                      }]
                    }
                    const temp = questions
                    temp.map((a) => {
                      if (a.id === itemQuestion.id) {
                        a.question_items = [...a.question_items, newQuestionItem]
                      } else {
                        a
                      }
                    })
                    setQuestions([...temp])
                  }} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Question for this paragraph</div>
                </div>

                )}

              </div>
            )
          })}
          {/* add new question with different type */}
          <div className="mt-8">
            <div onClick={() => {
              onOpen()
            }} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Question</div>
          </div>
          <div className="flex -z-10 gap-4 flex-row-reverse my-4">
            <div onClick={() => setStatus("published")} ><Button title="Save Question" /></div>
            <button onClick={() => setStatus("draft")} className='cursor-pointer text-blue-1 rounded p-2'>Cancel</button>
          </div>
        </form>
      </Card>


      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Question </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex gap-4">
              <div className={`${questionType === 'simple' ? 'text-blue-1 bg-blue-6 border-blue-1' : 'text-black-4 bg-black-9'} w-full text-center border py-12 cursor-pointer rounded-lg border`} onClick={() => setQuestionType('simple')}>
                Simple Question
              </div>
              <div className={`${questionType === 'paragraph' ? 'text-blue-1 bg-blue-6 border-blue-1' : 'text-black-4 bg-black-9'} w-full text-center border py-12 cursor-pointer rounded-lg border`} onClick={() => setQuestionType('paragraph')}>
                Paragraph Question
              </div>
            </div>
            <div className="flex flex-row-reverse gap-4 mt-4" >
              <div className="bg-blue-1 p-3 rounded-lg text-white cursor-pointer" onClick={() => {
                setQuestions([...questions, {
                  id: questions.length,
                  type: questionType,
                  question_items: [{
                    id: 0,
                    question: '',
                    answer_type: 'single',
                    options: [{
                      id: 0,
                      title: '',
                      correct: 0
                    }]
                  }]
                },])
                onClose()
              }}>Select</div>
              <button type="button" className="text-black-4 p-3 rounded-lg" onClick={onClose}>Cancel</button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModal} onClose={onCloseSuccessModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><center>Success</center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col text-center ">
              Question has Published
              <div className="self-center">
                <Link href={`/operator/practice/${id}`}>
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


// This also gets called at build time
export async function getServerSideProps(context) {
  const idExam = context.query.id
  // getDetail(idExam)
  const idSection = idExam.split('=')[1]
  const num = idSection.split('#')[0]
  return { props: { id_section: num } }
}
Create.layout = Layout