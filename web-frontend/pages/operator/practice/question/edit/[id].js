import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "../../../../../components/Cards/Card";
import Layout from "../../../../../Layout/Layout";
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
import Quill from "../../../../../components/Editor/QuillMath";
import { Select } from '@chakra-ui/react'
import apiPractice from "../../../../../action/practice";
import { useRouter } from "next/router";
import Button, { BackButton } from "../../../../../components/Button/button";

export default function Edit(props) {
  const Router = useRouter()
  const { id } = Router.query
  const [errors, setErrors] = useState()
  const { register, handleSubmit, setValue } = useForm();
  const [status, setStatus] = useState()
  const [lastIdOption, setLastIdOption] = useState()
  const [listDeleteOption, setListDeleteOption] = useState([])
  const [idExamPractice, setIdExamPractice] = useState()
  const [questions, setQuestions] = useState([
    {
      id: 0,
      instruction: "",
      type: "",
      items: [{
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

  const getDetail = useCallback(async (id) => {

    const idExam = Router.query.id
    const idSecti = idExam.split("=")
    const ids = idSecti[1]
    console.log(ids)
    setIdExamPractice(ids)
    await apiPractice.detailQuestion(id)
      .then((res) => {
        const arr = []
        arr.push(res.data.data)
        setQuestions([...arr])
        console.log(res.data.data)
        const data = res.data.data
        setValue("section_id", data.id)
        setValue("type", data.type)
        setValue(`level`, data.level)
        setValue(`tag`, data.tag)
        setValue(`instruction`, data.instruction)
        setValue(`paragraph`, data.paragraph)
        for (let i = 0; i < data.items.length; i++) {
          const field = `question_items[${i}]`
          setValue(`${field}[id]`, data.items[i].id)
          setValue(`${field}[mark]`, data.items[i].mark)
          setValue(`${field}[tag]`, data.items[i].tag)
          setValue(`${field}[level]`, data.items[i].level)
          setValue(`${field}[answer_type]`, data.items[i].answer_type)
          setValue(`${field}[negative_mark]`, data.items[i].negative_mark)
          setValue(`${field}[question]`, data.items[i].question)
          setValue(`${field}[answer_explanation]`, data.items[i].answer_explanation)
          for (let j = 0; j < data.items[i].options.length; j++) {
            const fieldOption = `question_items[${i}].options[${j}]`
            const oldField = `question_items[${i}].oldOptions[${j}]`
            const id = data.items[i].options[j].id.toString()

            setValue(`${fieldOption}[id]`, id)
            setValue(`${fieldOption}[title]`, data.items[i].options[j].title)
            setValue(`${fieldOption}[correct]`, data.items[i].options[j].correct)
            setValue(`${oldField}[id]`, id)
            setValue(`${oldField}[title]`, data.items[i].options[j].title)
            setValue(`${oldField}[correct]`, data.items[i].options[j].correct)
          }
          setLastIdOption(data.items[i].options[data.items[i].options.length - 1].id)
        }
      })
  }, [])

  const submitQuiz = async (data) => {
    if (data.type === 'simple') {
      delete data.paragraph
      delete data.instruction
      delete data.tag
      delete data.level
    }

    for (let i = 0; i < data.question_items.length; i++) {
      const deleteOption = []
      if (data.question_items[i].new) {
        data.question_items[i].id = -1
      }
      if (data.question_items[i].oldOptions) {
        const oldOption = [...data.question_items[i].oldOptions]
        for (let i = 0; i < oldOption.length; i++) {
          for (let j = 0; j < listDeleteOption.length; j++) {
            if (parseInt(oldOption[i].id) === listDeleteOption[j]) {
              oldOption[i].deleted = "1"
              deleteOption.push(oldOption[i])
            }
          }
        }
      }
      const currentOption = [...data.question_items[i].options]
      const newOptions = []
      const oldsOption = []
      for (let b = 0; b < currentOption.length; b++) {
        if (typeof currentOption[b].deleteNew === "undefined") {
          if (currentOption[b].new) {
            newOptions.push(currentOption[b])
          } else {
            oldsOption.push(currentOption[b])
          }
        }
      }
      const mergeOption = [...oldsOption, ...deleteOption]
      const finalOption = Object.values(mergeOption.reduce((acc, cur) => Object.assign(acc, { [cur.id]: cur }), {}))
      const resultOption = [...finalOption, ...newOptions]
      for (let j = 0; j < resultOption.length; j++) {
        if (typeof resultOption[j].deleteNew === "undefined") {
          if (typeof resultOption[j].title !== "undefined") {
            if (resultOption[j].new) {
              resultOption[j].id = "-1"
            }
          }
        }
      }
      data.question_items[i].options = resultOption
    }
    await apiPractice.updateQuestion(id, data)
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

  useEffect(async () => {
    getDetail(id)
  }, []);

  const setDataForm = (identifier, data) => {
    setValue(identifier, data)
  }

  return (
    <div className="mt-12">
      <BackButton url="/operator/practice" />
      <Card
        className="w-full  bg-white overflow-visible text-sm" >
        <form onSubmit={handleSubmit(submitQuiz)}>
          {questions.map((itemQuestion, indexQuestion) => {
            return (
              <div className="bg-blue-6 p-4" key={indexQuestion}>
                {itemQuestion.type === 'paragraph' && (
                  <>
                    <div className="flex justify-between mt-2">
                      <div className="text-1xl font-bold">Edit {itemQuestion.type === 'simple' ? 'Simple' : 'Paragraph'} Question</div>
                    </div>
                    <div className="flex flex-col md:flex-row mt-4 gap-4">
                      <div className="w-full">
                        <p>Difficulty Level {errors && (
                          <span className="text-red-1 text-sm">{errors[`level`]}</span>
                        )}</p>
                        <Select bg='white' {...register(`level`)} size="md" variant='outline' iconColor="blue">
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </Select>
                      </div>
                      <div className="w-full">
                        <p>Tag</p>
                        <Select bg='white' {...register(`tag`)} size="md" variant='outline' iconColor="blue">
                          <option value="tag 1">tag 1</option>
                          <option value="tag 2">tag 2</option>
                          <option value="tag 3">tag 3</option>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="mt-4">Instruction {errors && (
                        <span className="text-red-1 text-sm">{errors[`instruction`]}</span>
                      )}</p>
                      <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                        <Quill data={itemQuestion.instruction} register={(data) => setDataForm(`instruction`, data)} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="mt-4">Paragraph {errors && (
                        <span className="text-red-1 text-sm">{errors[`paragraph`]}</span>
                      )}</p>
                      <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                        <Quill data={itemQuestion.paragraph} register={(data) => setDataForm(`paragraph`, data)} />
                      </div>
                    </div>
                  </>
                )}

                {/* question */}
                {itemQuestion.items.map((eachQuestion, indexEachQuestion) => {
                  setValue(`question_items[${indexEachQuestion}].new`, eachQuestion.new && true)
                  return (
                    <div className={`bg-white p-4 ${itemQuestion.type === "paragraph" && 'mt-8'}`} key={indexEachQuestion}>
                      <input defaultValue={eachQuestion.id} hidden {...register(`question_items[${indexEachQuestion}].id`)} />
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
                          <Select bg='white' {...register(`question_items[${indexEachQuestion}].level`)} size="md" variant='outline' iconColor="blue">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </Select>
                        </div>
                        <div className="w-full">
                          <p>Tag</p>
                          <Select bg='white' {...register(`question_items[${indexEachQuestion}].tag`)} size="md" variant='outline' iconColor="blue">
                            <option value="tag 1">tag 1</option>
                            <option value="tag 2">tag 2</option>
                            <option value="tag 3">tag 3</option>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="mt-4">Question {errors && (
                          <span className="text-red-1 text-sm">{errors[`question_items.${indexEachQuestion}.question`]}</span>
                        )}</p>
                        <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                          <Quill data={eachQuestion.question} register={(data) => setDataForm(`question_items[${indexEachQuestion}].question`, data)} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="mt-4">Answer Type {errors && (
                          <span className="text-red-1 text-sm">{errors[`options`]}</span>
                        )}</p>
                        <Select bg='white' onClick={(e) => {
                          const temp = questions
                          temp.map((itemQ) => {
                            if (itemQ.id === itemQuestion.id) {
                              itemQ.items.map((b) => {
                                if (b.id === eachQuestion.id) {
                                  b.answer_type = e.target.value
                                  const n = b.options.length
                                  for (let i = 0; i < n; i++) {
                                    b.options[i].correct = 0
                                    setValue(`question_items[${indexEachQuestion}].options[${i}].correct`, 0)
                                  }
                                }
                              })
                            } else {
                              itemQ
                            }
                          })
                          setQuestions([...temp])
                        }} {...register(`question_items[${indexEachQuestion}].answer_type`)} size="md" variant='outline' iconColor="blue">
                          <option value="single">Single Correct Answer</option>
                          <option value="multiple">Multiple Correct Answer</option>
                        </Select>
                        {errors && (
                          <span className="text-red-1 text-sm">{errors[`question_items.${indexEachQuestion}.options.0.correct`]}</span>
                        )}
                        {eachQuestion.options.map((itemAnswer, indexAnswer) => {
                          const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                          if (itemAnswer.new) {
                            setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].new`, true)
                            if (itemAnswer.correct === null) {
                              setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].correct`, 0)
                            }
                          }
                          return (
                            <div className={`${itemAnswer.correct === 1 ? 'bg-blue-6 border-blue-1' : 'bg-white'} my-2  p-4 border rounded-lg`} key={indexAnswer}>
                              {errors && (
                                <span className="text-red-1 text-sm">{errors[`question_items.${indexEachQuestion}.options.${indexAnswer}.title`]}</span>
                              )}
                              <div className='flex gap-2'>
                                {eachQuestion.answer_type === 'single' ? (
                                  <div className="flex cursor-pointer" onClick={() => {
                                    const temp = questions
                                    temp.map((itemQ) => {
                                      if (itemQ.id === itemQuestion.id) {
                                        itemQ.items.map((b) => {
                                          if (b.id === eachQuestion.id) {
                                            b.options.map((optionQ) => {
                                              if (optionQ.id === itemAnswer.id) {
                                                optionQ.correct = 1
                                                setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].correct`, 1)
                                              } else {
                                                for (let i = 0; i < b.options.length; i++) {
                                                  if (i !== indexAnswer) {
                                                    optionQ.correct = 0
                                                    setValue(`question_items[${indexEachQuestion}].options[${i}].correct`, 0)
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
                                    temp.map((itemQ) => {
                                      if (itemQ.id === itemQuestion.id) {
                                        itemQ.items.map((b) => {
                                          if (b.id === eachQuestion.id) {
                                            b.options.map((optionQ) => {
                                              if (optionQ.id === itemAnswer.id) {
                                                const tempCorrect = !optionQ.correct
                                                optionQ.correct = tempCorrect ? 1 : 0
                                                setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].correct`, tempCorrect ? 1 : 0)
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
                                        <Image src='/asset/icon/table/ic_checkbox_active.svg' width={16} height={16} alt="icon radio button" />
                                      ) : (
                                        <div className="border w-4 rounded h-4" />
                                      )}
                                    </div>
                                  </div>

                                  // <input className="m-auto" type="checkbox" id="html" {...register(`question_items[${indexEachQuestion}].options[${indexAnswer}].correct`)} value="1" />
                                )}
                                <span className="m-auto">{alphabet[indexAnswer]}</span>
                                <input value={itemAnswer.title} onChange={(e) => {

                                  const temp = questions
                                  temp.map((itemQ) => {
                                    if (itemQ.id === itemQuestion.id) {
                                      itemQ.items.map((b) => {
                                        if (b.id === eachQuestion.id) {
                                          b.options.map((optionQ) => {
                                            if (optionQ.id === itemAnswer.id) {
                                              const tempCorrect = !optionQ.correct
                                              optionQ.title = e.target.value
                                              setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].title`, e.target.value)
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
                                  // {...register(`question_items[${indexEachQuestion}].options[${indexAnswer}].title`)} 
                                  autoComplete="off" type="text" className={`${itemAnswer.correct === 1 ? 'bg-blue-6 text-black-5' : 'bg-white'} form border w-full rounded-lg p-2 h-full m-1`} placeholder="Input your answer" />
                                {eachQuestion.options.length !== 1 && (
                                  <div className="m-auto cursor-pointer text-blue-1 -ml-9" onClick={() => {
                                    const temp = questions
                                    temp.map((itemQ) => {
                                      if (itemQ.id === itemQuestion.id) {
                                        itemQ.items.map((b) => {
                                          if (b.id === eachQuestion.id) {
                                            b.options = [...b.options.filter(i => i !== itemAnswer)]
                                          }
                                        })
                                      } else {
                                        itemQ
                                      }
                                    })
                                    if (typeof itemAnswer.new === "undefined") {
                                      setListDeleteOption([...listDeleteOption, itemAnswer.id])
                                    } else {
                                      setValue(`question_items[${indexEachQuestion}].options[${indexAnswer}].deleteNew`, true)
                                    }
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
                            // id: eachQuestion.options[eachQuestion.options.length - 1].id + 1,
                            id: lastIdOption + 1,
                            title: '',
                            correct: null,
                            new: true
                          }
                          const temp = questions
                          temp.map((itemQ) => {
                            if (itemQ.id === itemQuestion.id) {
                              itemQ.items.map((b) => {
                                if (b.id === eachQuestion.id) {
                                  b.options = [...b.options, newOption]
                                }
                              })
                            } else {
                              itemQ
                            }
                          })
                          setQuestions([...temp])
                          setLastIdOption(lastIdOption + 1)
                        }} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Answer</div>
                        <div className="mt-4">
                          <p className="mt-4">Answer Explanation {errors && (
                            <span className="text-red-1 text-sm">{errors[`question_items.${indexEachQuestion}.answer_explanation`]}</span>
                          )}</p>
                          <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                            <Quill data={eachQuestion.answer_explanation} register={(data) => setDataForm(`question_items[${indexEachQuestion}].answer_explanation`, data)} />
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row mt-4 gap-4 mb-4 text-sm">
                          <div className="w-full">
                            <p>Marks {errors && (
                              <span className="text-red-1 text-sm">{errors[`question_items.${indexEachQuestion}.mark`]}</span>
                            )}</p>
                            <input type="number" step="0.01" className=" w-full form border p-2 rounded" placeholder="0" {...register(`question_items[${indexEachQuestion}].mark`)} />
                          </div>
                          <div className="w-full">
                            <p>Negative Marking {errors && (
                              <span className="text-red-1 text-sm">{errors[`question_items.${indexEachQuestion}.negative_mark`]}</span>
                            )}</p>
                            <input type="number" step="0.01" className="w-full form border p-2 rounded" placeholder="0" {...register(`question_items[${indexEachQuestion}].negative_mark`)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {itemQuestion.type === 'paragraph' && (<div className="mt-8">
                  <div onClick={() => {
                    const newQuestionItem = {
                      id: itemQuestion.items[itemQuestion.items.length - 1].id + 1,
                      question: '',
                      answer_type: 'single',
                      new: true,
                      level: 'easy',
                      options: [{
                        id: 0,
                        title: '',
                        correct: 0,
                        new: true
                      }]
                    }
                    const temp = questions
                    temp.map((a) => {
                      if (a.id === itemQuestion.id) {
                        a.items = [...a.items, newQuestionItem]
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
          <div className="flex -z-10 gap-4 flex-row-reverse my-4">
            <div  ><Button title="Save Question" /></div>
            <Link href="/operator/practice">
              <a className="flex gap-4 text-blue-1">
                <div onClick={() => setStatus("draft")} className='cursor-pointer text-blue-1 p-2 rounded-lg'>Cancel</div>
              </a>
            </Link>
          </div>
        </form>
      </Card>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModal} onClose={onCloseSuccessModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><center>Success</center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col text-center ">
              Successfully Update Question
              <div className="self-center">
                <Link href={`/operator/practice/${idExamPractice}`}>
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
  return { props: {} }
}

Edit.layout = Layout