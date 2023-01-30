import { useEffect, useState } from "react";
import Link from "next/link";
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
  useToast,
  Select
} from '@chakra-ui/react'
import Quill from "../Editor/Quill";
import apiPractice from "../../action/practice";
import apiTopic from "../../action/topics";
import Multiselect from 'multiselect-react-dropdown';
import DatePicker2 from "../DateTime/Date";
import { Time } from "../DateTime/Time";
import Button, { BackButton } from "../Button/button";
import { Stepper } from "../Section/Stepper";
import { useRouter } from "next/router";
import apiExamCategoryType from "../../action/ExamCategoryType";
import Image from "next/image";

export default function EditPractice({ role, id }) {
  const Router = useRouter()
  const toast = useToast()
  const [errors, setErrors] = useState()
  const { register, handleSubmit, setValue, getValues } = useForm();
  const step = ['Practice Details', 'Instruction', 'Sections']
  const [currentStep, setCurrentStep] = useState(1)
  const [type, setType] = useState()
  const [startTime, setStartTime] = useState()
  const [consentments, setConsentments] = useState([0])
  const [status, setStatus] = useState()
  const [listTopic, setListTopic] = useState([])
  const [topicItem, setTopicItem] = useState([])
  const [selectExamType, setSelectExamType] = useState()
  const [subType, setSubType] = useState([])
  const [durationType, setDurationType] = useState()
  const [examType, setExamType] = useState([])
  const [sections, setsections] = useState([
    {
      id: 0,
    },
  ])

  useEffect(() => {
    const uri = Router.asPath.split('#')
    if (uri[1] === 'draft') {
      toast({
        title: 'Change Needed',
        description: "You must change date before edit Practice",
        status: 'error',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      })
    }
  }, [])

  const getDetail = async (id) => {
    await apiPractice.detail(id)
      .then((res) => {
        const data = res.data.data
        setType(res.data.data.type)
        setValue("name", data.name)
        setValue("type", data.type)
        setValue("exam_type_id", data.exam_type_id)
        onSelectTopic(data.topics, "")
        const start = data.start_time.split(":")
        setStartTime(start[0] + ":" + start[1])
        setValue("start_time", start[0] + ":" + start[1])
        setValue("start_date", data.start_date)
        setValue("instruction", data.instruction)
        setValue("duration", data.duration)
        if (currentStep === 1) {
          if (data.duration !== null) {
            setDurationType('total')
          } else {
            setDurationType('section')
          }
        }

        if (data.consentments !== 'null') {
          const str = data.consentments.replace(/['"]+/g, '').slice(1)
          const myArr = str.slice(0, str.length - 1).split(", ")
          var arr = []
          for (let i = 0; i < myArr.length; i++) {
            arr.push(myArr[i])
          }
          setConsentments(arr)
          for (let i = 0; i < arr.length; i++) {
          }
        }
        setsections([...data.sections])
        for (let i = 0; i < data.sections.length; i++) {
          const field = `sections[${i}]`
          setValue(`${field}[id]`, data.sections[i].id)
          setValue(`${field}[name]`, data.sections[i].name)
          setValue(`${field}[duration]`, data.sections[i].duration)
          setValue(`${field}[instruction]`, data.sections[i].instruction)
        }
      })
  }

  const getExamType = async () => {
    await apiExamCategoryType.allCategory()
      .then((res) => {
        setExamType(res.data.data)
      })
  }

  useEffect(() => {
    console.log("render sub type")
    const getExamSubType = async () => {
      await apiExamCategoryType.allType()
        .then((res) => {
          let subType = []
          res.data.data.map((item) => {
            console.log("each")
            console.log(typeof selectExamType)
            console.log(typeof item.exam_category_id)
            if (selectExamType === item.exam_category_id.toString()) {
              console.log("sma")
              subType.push(item)
            }
          })
          setSubType(subType)
        })
    }
    getExamSubType()
  }, [selectExamType])

  const onSelectTopic = (list, item) => {
    setTopicItem(list)
    console.log(list)
    let arr = []
    for (let i = 0; i < list.length; i++) {
      arr.push(list[i].id)
    }
    setValue("topics[]", arr)
  }

  const onRemoveTopic = (list, item) => {
    setTopicItem(list)
    let arr = []
    for (let i = 0; i < list.length; i++) {
      arr.push(list[i].id)
    }
    setValue("topics[]", arr)
  }

  const getTopics = async () => {
    await apiTopic.allTopic()
      .then((res) => setListTopic(res.data.data))
  }

  const submitExams = async (data) => {
    if (durationType === 'section') {
      delete data.duration
    } else{
      data?.sections?.map((item)=>{
        delete item.duration
      })
    }
    if (currentStep === 1) {
      console.log(data)
      delete data.consentments
      const arr = []
      if (consentments) {
        for (let i = 0; i < consentments.length; i++) {
          arr.push(consentments[i])
          const field = `consentments[${i}]`
          setValue(`${field}`, consentments[i])
        }
      }
      data.consentments = arr
      await apiPractice.update(id, data)
        .then(() =>
          setCurrentStep(2))
        .catch((err) => {
          setErrors(err.response.data.data)
          console.log(err.response)
          if (!err.response.data.data.name && !err.response.data.data.duration && !err.response.data.data.start_date && !err.response.data.data.end_date && !err.response.data.data.start_time && !err.response.data.data.end_time) {
            setErrors(null)
            setCurrentStep(2)
          }
          return;
        })
      return null
    }

    if (currentStep === 2) {
      console.log(data)
      delete data.consentments
      const arr = []
      if (consentments) {
        for (let i = 0; i < consentments.length; i++) {
          arr.push(consentments[i])
          const field = `consentments[${i}]`
          setValue(`${field}`, consentments[i])
        }
      }
      data.consentments = arr
      console.log(data)
      await apiPractice.update(id, data)
        .then(() =>
          setCurrentStep(3))
        .catch((err) => {
          setErrors(err.response.data.data)
          console.log(err.response.data.data)
          if (!err.response.data.data["consentments"] && !err.response.data.data.instruction) {
            setErrors(null)
            setCurrentStep(3)
            getDetail(id)
          }
          return;
        })
      return null
    }

    if (currentStep === 3) {
      console.log(data)
      delete data.consentments
      const arr = []
      if (consentments) {
        for (let i = 0; i < consentments.length; i++) {
          arr.push(consentments[i])
          const field = `consentments[${i}]`
          setValue(`${field}`, consentments[i])
        }
      }
      data.consentments = arr
      await apiPractice.update(id, data)
        .then((res) => {
          onOpenSuccessModal()
        })
        .catch((err) => {
          console.log(err.response.data.data)
          setErrors(err.response.data.data)
        })
    }
  }

  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()

  useEffect(() => {
    getDetail(id)
    getExamType()
    getTopics()
  }, [currentStep]);

  const setDataForm = (identifier, data) => {
    setValue(identifier, data)
  }

  return (
    <div className=" md:pb-28 mt-12">
      <BackButton url={`/${role}/practice`} />
      <Card
        className="w-full  bg-white overflow-visible"
        title="Edit Practice " >
        <Stepper step={step} currentStep={currentStep} />
        <form onSubmit={handleSubmit(submitExams)} className="text-sm">
        {currentStep === 1 && (
            <div className="mb-8">
              <div className="flex flex-col md:flex-row mt-4 gap-4 ">
                <div className="w-full">
                  <p>Practice Name {errors && (
                    <span className="text-red-1 text-sm">{errors.name}</span>
                  )}</p>
                  <div>
                    <input type="text" className="form border w-full rounded p-2 h-9 text-sm" placeholder="Input Practice Name"  {...register("name")} />
                  </div>
                </div>
                <div className="w-full ">
                  <p>Topic {errors && (
                    <span className="text-red-1 text-sm">{errors.topics}</span>
                  )}</p>
                  <Multiselect
                    className="z-100 "
                    options={listTopic}
                    style={{
                      "multiselectContainer": {
                        'height': '36px',
                        "padding": "0px",
                        "border-width": "1px",
                        "border-radius": "5px"
                      }, "searchBox": {
                        "border": "none",
                      }, "chips": {
                        "padding": "2px"
                      },
                    }}
                    placeholder="Select Topic"
                    // singleSelect
                    // options={listTag} // Options to display in the dropdown
                    selectedValues={topicItem} // Preselected value to persist in dropdown
                    onSelect={onSelectTopic} // Function will trigger on select event
                    onRemove={onRemoveTopic} // Function will trigger on remove event
                    displayValue="name" // Property name to display in the dropdown options
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row mt-4 gap-4">
                <div className="w-full">
                  <p>Start Date</p>
                  <div className="border rounded p-1 h-9">
                    <DatePicker2
                      setData={(data) => setValue("start_date", data)}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <p>Start Time</p>
                  <Time data={getValues("start_time")} setDate={(data) => setValue("start_time", data)} />
                </div>
              </div>


              <div className="flex flex-col-reverse md:flex-row md:gap-4 mt-4" >
                <div className="w-full">
                  <p>Practice Type {errors && (
                    <span className="text-red-1 text-sm">{errors.exam_type_id}</span>
                  )}</p>
                  <div className="border    rounded text-sm">
                    <select className="w-full h-9 bg-white" {...register('exam_type_id')} onClick={(e) => setSelectExamType(e.target.value)} >
                      <option value="" >Choose Type</option>
                      {examType.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}</select>
                  </div>
                </div>
                <div className="w-full md:gap-4">
                  <p className="hidden md:flex">Duration Type</p>
                  <div className="hidden md:flex gap-4 h-9">
                    <div className={` ${durationType === 'total' ? 'bg-blue-6' : 'bg-white'} flex gap-2 h-full w-full border rounded cursor-pointer`} onClick={() => {
                      setDurationType('total')
                    }}>
                      <div className="my-auto ml-2">
                        <Image src={`${durationType === 'total' ? "/asset/icon/table/ic_radio_active.svg" : "/asset/icon/table/ic_radio.svg"}`} height={12} width={12} className="flex align-middle my-auto" alt="icon radio-button" />
                      </div>
                      <p className={`${durationType === 'total' ? 'text-blue-1' : 'text-black-5'} my-auto`}>
                        Total Duration
                      </p>
                    </div>
                    <div className={` ${durationType === 'section' ? 'bg-blue-6' : 'bg-white'} flex gap-2  w-full  h-full border rounded cursor-pointer`} onClick={() => {
                      setDurationType('section')
                    }}>
                      <div className="my-auto ml-2">
                        <Image src={`${durationType === 'section' ? "/asset/icon/table/ic_radio_active.svg" : "/asset/icon/table/ic_radio.svg"}`} height={12} width={12} className="flex align-middle my-auto ml-4" alt="icon radio-button" />
                      </div>
                      <p className={`${durationType === 'section' ? 'text-blue-1' : 'text-black-5'} my-auto `}>
                        Each Section
                      </p>
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                {subType.length > 0 ? (
                  <div className="w-full">
                    <p>Practice Sub Type {errors && (
                      <span className="text-red-1 text-sm">{errors.exam_type_id}</span>
                    )}</p>
                    <div className="w-full rounded py-2 h-9 pl-2 border">
                      <Select size="sm" defaultValue="1" variant='unstyled'  {...register('exam_type_id')}>
                        {/* <option value="" >Choose Exam type</option> */}
                        {subType.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                ) : (<div className="flex w-full -mt-4" />)}
                <div className="w-full md:hidden">
                  <p className="md:hidden">Duration Type</p>
                  <div className="flex gap-4 h-9">
                    <div className={` ${durationType === 'total' ? 'bg-blue-6' : 'bg-white'} flex gap-2 h-full w-full border rounded cursor-pointer`} onClick={() => {
                      setDurationType('total')
                    }}>
                      <div className="my-auto ml-2">
                        <Image src={`${durationType === 'total' ? "/asset/icon/table/ic_radio_active.svg" : "/asset/icon/table/ic_radio.svg"}`} height={12} width={12} className="flex align-middle my-auto" alt="icon radio-button" />
                      </div>
                      <p className={`${durationType === 'total' ? 'text-blue-1' : 'text-black-5'} my-auto`}>
                        Total Duration
                      </p>
                    </div>
                    <div className={` ${durationType === 'section' ? 'bg-blue-6' : 'bg-white'} flex gap-2  w-full  h-full border rounded cursor-pointer`} onClick={() => {
                      setDurationType('section')
                    }}>
                      <div className="my-auto ml-2">
                        <Image src={`${durationType === 'section' ? "/asset/icon/table/ic_radio_active.svg" : "/asset/icon/table/ic_radio.svg"}`} height={12} width={12} className="flex align-middle my-auto ml-4" alt="icon radio-button" />
                      </div>
                      <p className={`${durationType === 'section' ? 'text-blue-1' : 'text-black-5'} my-auto `}>
                        Each Section
                      </p>
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
                {durationType === 'total' ? (
                  <div className="w-full">
                    <p>Duration {errors && (
                      <span className="text-red-1 text-sm">{errors.duration}</span>
                    )}</p>
                    <div >
                      <div className="flex h-full">
                        <input type="number" step="1" className="border w-full h-full flex-grow rounded p-2" placeholder="0"  {...register(`duration`)} />
                        <input className="bg-black-9 p-2 w-24 text-center h-full border text-black-4" placeholder="Minute" disabled />
                      </div>
                    </div>
                  </div>

                ) : (<div className="w-full" />)}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <>
              <p className="mt-4">Instruction {errors && (
                <span className="text-red-1 text-sm">{errors['instruction']}</span>
              )}</p>
              <div className="w-full ">
                <Quill data={getValues('instruction')} setData={(data) => setValue('instruction', data)} />
              </div>
              <p className="mt-4">Consent</p>
              {consentments.map((item, index) => {
                return (
                  <>{errors && (
                    <span className="text-red-1 text-sm">{errors[`consentments.${index}`]}</span>
                  )}
                    <div key={index} className="flex">
                      <input key={index} type="text" value={item} onChange={(e) => {
                        const arr = consentments
                        arr[index] = e.target.value
                        setConsentments([...arr])
                        setValue(`consentments[${index}]`, e.target.value)
                      }} className="form border w-full rounded p-2 h-full m-1" autoComplete="off" placeholder="Input Consentment" />
                      {consentments.length !== 1 && (
                        <div className="m-auto cursor-pointer text-blue-1 -ml-8" onClick={() => {
                          let newArr = consentments
                          newArr.splice(index, 1)
                          setConsentments([...newArr])
                        }} >x</div>
                      )}
                    </div>
                  </>
                )
              })}
              <div onClick={() => setConsentments([...consentments, ''])} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded">+ Add New Consent</div>
            </>
          )}

          {currentStep === 3 && (
            <div className="mt-8">
              <div className="bg-blue-6 p-4">
                {sections.map((itemQuestion, indexQuestion) => {
                  if (itemQuestion.new) {
                    setValue(`sections[${indexQuestion}].id`, -1)
                  }
                  return (
                    <>
                      <p className="font-bold mt-4 text-lg">Section {indexQuestion + 1}</p>
                      <div className="flex flex-col md:flex-row mt-4 gap-4" >
                        <div className="w-full">
                          <p>Section Name{errors && (
                            <span className="text-red-1 text-sm">{errors[`sections.${indexQuestion}.name`]}</span>
                          )}</p>
                          <div>
                            <input type="text" className="form border w-full rounded-lg p-2 h-full" placeholder="Input Section Name"  {...register(`sections[${indexQuestion}].name`)} />
                          </div>
                        </div>
                        {durationType === 'section' ? (
                          <div className="w-full">
                            <p>Duration {errors && (
                              <span className="text-red-1 text-sm">{errors[`sections.${indexQuestion}.duration`]}</span>
                            )}</p>
                            <div >
                              <div className="flex h-full">
                                <input type="number" step="1" className="border w-full h-full flex-grow rounded p-2" placeholder="0"  {...register(`sections[${indexQuestion}].duration`)} />
                                <input className="bg-black-9 p-2 w-24 text-center h-full border text-black-4" placeholder="Minute" disabled />
                              </div>
                            </div>
                          </div>
                        ):(<div className="hidden md:flex md:w-full" />)}
                      </div>
                      <div className="mt-4">
                        <p className="mt-4">Instruction {errors && (
                          <span className="text-red-1 text-sm">{errors[`sections.${indexQuestion}.instruction`]}</span>
                        )}</p>
                        <div className="w-full  bg-white rounded-lg " style={{ lineHeight: 2 }} >
                          <Quill data={getValues(`sections[${indexQuestion}].instruction`)} register={(data) => setDataForm(`sections[${indexQuestion}].instruction`, data)} />
                        </div>
                      </div>
                    </>
                  )
                }
                )}

              </div>
              <div onClick={() => {
                setsections([...sections, {
                  id: sections[sections.length - 1].id + 1, option: [0],
                  new: true
                }])
              }} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Section</div>
            </div>
          )}
          <div className="flex -z-10 gap-4 flex-row-reverse my-4">
            {currentStep < 3 && (
              <button className={`${3 > currentStep ? 'cursor-pointer' : 'cursor-default'} bg-blue-1  text-white p-2 rounded`}>Next Step</button>
            )}
            {currentStep === 3 && (
              <>
                <button onClick={() => setStatus("published")} className='cursor-pointer bg-blue-1  text-white p-2 rounded'>Save Test</button>
              </>
            )}
            {currentStep > 1 ? (
              <div onClick={() => {
                currentStep > 1 && setCurrentStep(currentStep - 1)
                console.log(currentStep)
              }} className={`${1 < currentStep ? 'cursor-pointer' : 'cursor-default'}  text-black-4 p-2 rounded`}>Back Step</div>
            ) : (
              <Link href={`/${role}/practice`}>
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
          <ModalHeader><center>Success</center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col text-center ">
              Section Successfully Created
              <div className="self-center">
                <Link href={`/${role}/practice`}>
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