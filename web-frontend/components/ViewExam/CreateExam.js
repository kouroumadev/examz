import React, {useEffect, useState, Fragment} from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "../Cards/Card";
import {useForm} from "react-hook-form";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react'
import QuillCreated from "../Editor/QuillCreated";
import {Select} from '@chakra-ui/react'
import apiExam from "../../action/exam";
import apiTopic from "../../action/topics";
import apiBranch from "../../action/branch";
import apiBatch from "../../action/batch";
import Multiselect from 'multiselect-react-dropdown';
import DatePicker2 from "../DateTime/Date";
import {Time} from "../DateTime/Time";
import Button, {BackButton} from "../Button/button";
import {Stepper} from "../Section/Stepper";
import apiExamCategoryType from '../../action/ExamCategoryType'

export default function CreateExam({role}) {
    const [errors, setErrors] = useState();
    const {register, handleSubmit, setValue, getValues} = useForm();
    const step = ['Exams Details', 'Instruction', 'Sections'];
    const [currentStep, setCurrentStep] = useState(1);
    const [batchSelectionRequired, setBatchSelectionRequired] = useState(false);
    const [type, setType] = useState('standard');
    const [consents, setConsents] = useState(['']);
    const [status, setStatus] = useState("published");
    const [listTopic, setListTopic] = useState([]);
    const [topicItem, setTopicItem] = useState([]);
    const [examType, setExamType] = useState([]);
    const [subType, setSubType] = useState([]);
    const [selectExamType, setSelectExamType] = useState();
    const [selectBranch, setSelectBranch] = useState([]);
    const [branches, setBranches] = useState([]);
    const [listBatch, setListBatch] = useState([]);
    const [batchItem, setBatchItem] = useState([]);
    const [durationType, setDurationType] = useState('total');
    // new
    const [duration, setDuration] = useState([]);
    const [consent, setConsent] = useState([]);
    const [instruction, setInstruction] = useState([]);
    const [allSections, setAllSections] = useState([]);
    const [isNotChecked, setIsNotChecked] = useState('false');

    // end new
    const [sections, setsections] = useState([
        {
            id: 0,
        },
    ])
    const branchSelected = function (e){
        let branches = [];
        branches.push(e.target.value);
        setSelectBranch(branches);
        setValue("branches[]", branches);
    };

    const getExamType = async () => {
        await apiExamCategoryType.allCategory()
            .then((res) => {
                setExamType(res.data.data)

            })
    }

    // new
    useEffect(() => {
        const getExamConfiguration = async () => {
            await apiExamCategoryType.allConfig()
                .then((res) => {
                    // let instruction = []
                    res.data.data.map((item) => {
                        if (selectExamType === item.exam_category_id.toString()) {
                            //  if(durationType=== 'total')
                            setDuration(item.data.duration.value);
                            setConsent(item.data.consent);
                            setInstruction(item.data.instruction);
                            setAllSections(item.data.sections) ;
                            setValue('instruction', instruction);
                            setValue('consentments', item.data.consent)
                        }
                    })

                })
        }
        getExamConfiguration()
    }, [selectExamType])


    //   useEffect(() => {
    //     const getInstruction = async () => {
    //         await apiExamCategoryType.allInstruction()
    //             .then((res) => {
    //                 let intruction = []
    //                 res.data.data.map((item) => {
    //                     if (selectExamType === item.exam_category_id.toString()) {
    //                         intruction.push(item)
    //                     }
    //                 })
    //                 setInstruction(intruction)
    //             })
    //     }
    //     getInstruction()
    // }, [selectExamType])

    // end new


    useEffect(() => {
        const getExamSubType = async () => {
            await apiExamCategoryType.allType()
                .then((res) => {
                    let subType = []
                    res.data.data.map((item) => {
                        if (selectExamType === item.exam_category_id.toString()) {
                            subType.push(item)
                        }
                    })
                    setSubType(subType)
                })
        }
        getExamSubType()
    }, [selectExamType])

    useEffect(() => {
        const getBatches = async () => {
            await apiBatch.all()
                .then((res) => {
                    let batches = []
                    res.data.data.map((item) => {
                        if (selectBranch[0] === item.institute_id.toString()) {
                            batches.push(item)
                        }
                    })
                    setListBatch(batches)
                })
        }
        getBatches()
    }, [selectBranch])

    const onSelectTopic = (list, item) => {
        setTopicItem(list)
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

    const onSelectBatch = (list, item) => {
        setBatchItem(list)
        let arr = []
        for (let i = 0; i < list.length; i++) {
            arr.push(list[i].id)
        }
        setValue("batches[]", arr)
    }

    const onRemoveBatch = (list, item) => {
        setBatchItem(list)
        let arr = []
        for (let i = 0; i < list.length; i++) {
            arr.push(list[i].id)
        }
        setValue("batches[]", arr)
    }

    const getTopics = async () => {
        await apiTopic.allTopic()
            .then((res) => setListTopic(res.data.data))
    }

    const getBranches = async () => {
        await apiBranch.all()
            .then((res) => setBranches(res.data.data))
    }

    const submitExams = async (data) => {
        if (data.type === 'standard') {
            delete data.start_time
            delete data.end_time
            delete data.start_date
            delete data.end_date
        }
        if (durationType === 'section') {
            delete data.duration
        } else {
            data?.sections?.map((item) => {
                delete item.duration
            })
        }
        if (currentStep === 1) {
            await apiExam.create(data)
                .then()
                .catch((err) => {
                    setErrors(err.response.data.data)
                    if (!err.response.data.data.name && !err.response.data.data.exam_type_id && !err.response.data.data.start_date && !err.response.data.data.end_date && !err.response.data.data.start_time && !err.response.data.data.end_time && !err.response.data.data.exam_category_id) {
                        setErrors(null)
                        setIsNotChecked('false')
                        setCurrentStep(2)
                    }
                    // setCurrentStep(2)
                    return;
                })
            return null
        }
        console.log(errors)

        // data.consentments = consents
        // data.consentments = consent
        data.instruction = instruction
        data.duration = duration
        // data.status = status
        if (currentStep === 2) {
            setErrors(null)
            if(!isNotChecked){
                setCurrentStep(3)
            }
            return null
        }
        console.log(data)
        console.log(errors)
        if (currentStep === 3) {
            await apiExam.create(data)
                .then((res) => {
                    onOpenSuccessModal()
                })
                .catch((err) => {
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
        getTopics()
        getExamType()
        setBatchSelectionRequired(role === "institute");
        getBranches();
    }, []);

    const setDataForm = (identifier, data) => {
        setValue(identifier, data)
    }

    return (
        <div className="mt-12">
            <BackButton url={`/${role}/exams`} />
            <Card
                className=" w-full  bg-white overflow-visible"
                title="Create New Exam " >
                <Stepper step={step} currentStep={currentStep} />
                <form onSubmit={handleSubmit(submitExams)} className="text-sm">
                    {currentStep === 1 && (
                        <div className="mb-8">
                            <input hidden type="text" value={type} {...register("type")} />
                            <div className="flex flex-col md:flex-row gap-4 ">
                                <div className="w-full gap-4">
                                    <p>Held Type</p>
                                    <div className="flex gap-4 h-9">
                                        <div className={` ${type === 'live' ? 'bg-blue-6' : 'bg-white'} flex gap-2 h-full w-full border rounded cursor-pointer`} onClick={() => {
                                            setValue("type", "live")
                                            setType('live')
                                        }}>
                                            <div className="my-auto ml-2">
                                                <Image src={`${type === 'live' ? "/asset/icon/table/ic_radio_active.svg" : "/asset/icon/table/ic_radio.svg"}`} height={12} width={12} className="flex align-middle my-auto" alt="icon radio-button" />
                                            </div>
                                            <p className={`${type === 'live' ? 'text-blue-1' : 'text-black-5'} my-auto`}>
                                                Live Exam
                                            </p>
                                        </div>
                                        <div className={` ${type === 'standard' ? 'bg-blue-6' : 'bg-white'} flex gap-2  w-full  h-full border rounded cursor-pointer`} onClick={() => {
                                            setValue("type", "standard")

                                            setType('standard')
                                        }}>
                                            <div className="my-auto ml-2">
                                                <Image src={`${type === 'standard' ? "/asset/icon/table/ic_radio_active.svg" : "/asset/icon/table/ic_radio.svg"}`} height={12} width={12} className="flex align-middle my-auto ml-4" alt="icon radio-button" />
                                            </div>
                                            <p className={`${type === 'standard' ? 'text-blue-1' : 'text-black-5'} my-auto `}>
                                                Standard Exam
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <p>Exam Name {errors && (
                                        <span className="text-red-1 text-sm">{errors.name}</span>
                                    )}</p>
                                    <div>
                                        <input type="text" className="form border w-full rounded p-2 h-9" placeholder="Input Exam Name"  {...register("name")} />
                                    </div>
                                </div>
                            </div>

                            {type === 'live' && (
                                <>
                                    <div className="flex flex-col md:flex-row mt-4 gap-4">
                                        <div className="w-full">
                                            <p>Start Date {errors && (
                                                <span className="text-red-1 text-sm">{errors.start_date}</span>
                                            )}</p>
                                            <div className="border p-2 rounded">
                                                <DatePicker2
                                                    setData={(data) => setValue("start_date", data)}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <p>End Date {errors && (
                                                <span className="text-red-1 text-sm">{errors.end_date}</span>
                                            )}</p>
                                            <div className="border p-2 h-9 rounded">
                                                <DatePicker2
                                                    setData={(data) => setValue("end_date", data)}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex flex-col md:flex-row mt-4 gap-4">
                                        <div className="w-full">
                                            <p>Start Time {errors && (
                                                <span className="text-red-1 text-sm">{errors.start_time}</span>
                                            )}</p>
                                            <Time data={getValues("start_time")} setDate={(data) => setValue("start_time", data)} />
                                        </div>
                                        <div className="w-full">
                                            <p>End Time {errors && (
                                                <span className="text-red-1 text-sm">{errors.end_time}</span>
                                            )}</p>
                                            <Time data={getValues("end_time")} setDate={(data) => setValue("end_time", data)} />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col md:flex-row gap-4 mt-4 " >
                                <div className="w-1/2">
                                    <p>Topic {errors && (
                                        <span className="text-red-1 text-sm">{errors.topics}</span>
                                    )}</p>
                                    <Multiselect
                                        className="z-100 "
                                        options={listTopic}
                                        style={{
                                            "multiselectContainer": {
                                                "height": '36px',
                                                "padding": "1px",
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
                                <div className="w-1/4">
                                    <p>Exam Type {errors && (
                                        <span className="text-red-1 text-sm">{errors.exam_category_id}</span>
                                    )}</p>
                                    <div className="w-full rounded py-2 h-9 pl-2 border">
                                        <Select size="sm" defaultValue="1" variant='unstyled' onClick={(e) => setSelectExamType(e.target.value)}  {...register('exam_category_id')}>
                                            <option value="" >Choose Exam type</option>
                                            {examType.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                {subType.length > 0 ? (
                                    <div className="w-1/4">
                                        <p>Exam Sub Type {errors && (
                                            <span className="text-red-1 text-sm">{errors.exam_type_id}</span>
                                        )}</p>
                                        <div className="w-full rounded py-2 h-9 pl-2 border">
                                            <Select size="sm" defaultValue="1" variant='unstyled'  {...register('exam_type_id')}>
                                                {subType.map((item) => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className=" hidden w-1/4" />
                                )}
                            </div>
                            <div className="flex gap-4 flex-col-reverse md:flex-row gap-4 mt-4">
                                <div className="w-1/2 gap-4 ">
                                    <p>Duration Type</p>
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
                                { batchSelectionRequired ? (<>
                                        <div className="w-1/4">
                                            <p>Branch {errors && (
                                                <span className="text-red-1 text-sm">{errors.branches}</span>
                                            )}</p>
                                            <div className="w-full rounded py-2 h-9 pl-2 border">
                                                <Select size="sm" defaultValue="1" variant='unstyled' onClick={(e) => branchSelected(e)}  >
                                                    <option value="" >Choose Institute Branch</option>
                                                    {branches.map((item) => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="w-1/4">
                                            <p>Batch {errors && (
                                                <span className="text-red-1 text-sm">{errors.batches}</span>
                                            )}</p>
                                            <Multiselect
                                                className="z-100 "
                                                options={listBatch}
                                                style={{
                                                    "multiselectContainer": {
                                                        "height": '36px',
                                                        "padding": "1px",
                                                        "border-width": "1px",
                                                        "border-radius": "5px"
                                                    }, "searchBox": {
                                                        "border": "none",
                                                    }, "chips": {
                                                        "padding": "2px"
                                                    },
                                                }}
                                                placeholder="Select Batch"
                                                selectedValues={batchItem} // Preselected value to persist in dropdown
                                                onSelect={onSelectBatch} // Function will trigger on select event
                                                onRemove={onRemoveBatch} // Function will trigger on remove event
                                                displayValue="name" // Property name to display in the dropdown options
                                            />
                                        </div>
                                    </>
                                ) : (<div className=" hidden w-1/2"/>)}

                            </div>
                            {durationType === 'total' && (<div className="w-full md:w-1/2 md:pr-2 mt-4">
                                    <p>Duration {errors && (
                                        <span className="text-red-1 text-sm">{errors.duration}</span>
                                    )}</p>
                                    <div >
                                        <div className="flex h-full">
                                            <input type="number" value={duration} step="1" className="border w-full h-full flex-grow rounded p-2" />
                                            <input className="bg-black-9 p-2 w-24 text-center h-full border text-black-4" placeholder="Minute" disabled />
                                        </div>
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
                            {/* <div className="w-full">
                <QuillCreated data={getValues('instruction')} setData={(data) => setValue('instruction', data)} />
              </div>  */}


                            <div className="p-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Exam requirements:</h2>
                                <ul className="space-y-1 max-w-md list-disc list-inside text-gray-500 dark:text-gray-400">
                                    {
                                        <p>{instruction}</p>
                                    }
                                </ul>
                            </div>


                            {/* <p className="mt-4">ReadOnly Consent</p>
              {consents.map((item, index) => (
                <>{errors && (
                  <span className="text-red-1 text-sm">{errors[`consentments.${index}`]}</span>
                )}

                  <div key={index} className="flex">
                    <input key={index} type="text" value={item} onChange={(e) => {
                      const arr = consents
                      arr[index] = e.target.value
                      setConsents([...arr])
                      setValue(`consentments[${index}]`, e.target.value)
                    }} className="bg-blue-6 form border w-full p-2 rounded h-full m-1" autoComplete="off" placeholder="Input Consentment" />
                    {consents.length !== 1 && (
                      <div className="m-auto cursor-pointer text-blue-1 -ml-8" onClick={() => {
                        let newArr = consents
                        newArr.splice(index, 1)
                        setConsents([...newArr])
                      }} >x</div>
                    )}
                  </div>
                </>
              ))} */}

                            {/* new */}
                            <p className="mt-4">checkbox Consent</p>
                            {isNotChecked && <span className="text-red-1 text-sm">Field required</span>}

                            <div className="flex flex-col md:flex-row gap-4 ">
                                <div className="bg-blue-6 flex gap-2 h-full w-full border rounded cursor-pointer pb-6">
                                    <div className="flex gap-4 h-9">
                                        <div className="my-auto ml-2">
                                            <input
                                                id="bordered-checkbox-1"
                                                type="checkbox"
                                                value={isNotChecked}
                                                onChange={() => setIsNotChecked(current => !current)}
                                                name=""
                                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"

                                            />
                                        </div>
                                        <p className={'text-blue-1 my-auto'}>
                                            {consent}
                                            {/* <label for="bordered-checkbox-1" class="py-4 w-full text-sm font-medium text-gray-900 dark:text-gray-300">Default radio</label> */}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* <div onClick={() => setConsents([...consents, ''])} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Consent</div> */}
                        </>
                    )}

                    {/* end new */}

                    {/* {currentStep === 3 && (
            <div className="mt-8">
              <div className="bg-blue-6 p-4">
                {sections.map((itemSection, indexSection) => {
                  return (
                    <>
                      <p className="font-bold mt-4 text-lg">Section {indexSection + 1}</p>
                      <div className="flex flex-col md:flex-row gap-4 mt-4" >
                        <div className="w-full">
                          <p>Section Name{errors && (
                            <span className="text-red-1 text-sm">{errors[`sections.${indexSection}.name`]}</span>
                          )}</p>
                          <div>
                            <input type="text" value={sectionName} className="form border w-full p-2 rounded h-full" placeholder="Input Section Name"  {...register(`sections[${indexSection}].name`)} />
                          </div>
                        </div>
                        {durationType === 'section' ? (
                          <div className="w-full">
                            <p>Duration {errors && (
                              <span className="text-red-1 text-sm">{errors[`sections.${indexSection}.duration`]}</span>
                            )}</p>
                            <div >
                              <div className="flex h-full">
                                <input type="number" value={duration} className="border w-full h-full flex-grow rounded p-2" placeholder="0"  />
                                <input className="bg-black-9 p-2 w-24 text-center h-full border text-black-4" placeholder="Minute" disabled />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="hidden md:flex md:w-full" />
                        )}

                      </div>
                      <div className="mt-4">
                        <p className="mt-4">Instruction {errors && (
                          <span className="text-red-1 text-sm">{errors[`sections.${indexSection}.instruction`]}</span>
                        )}</p>
                         <div className="w-full rounded-lg " style={{ lineHeight: 2 }} >
                          <QuillCreated className="" data='' register={(data) => setDataForm(`sections[${indexSection}].instruction`, data)} />
                        </div>




                        <div className="p-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                          <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Exam requirements:</h2>
                          <ul class="space-y-1 max-w-md list-disc list-inside text-gray-500 dark:text-gray-400">

                                {
                                  <p>{instruction}</p>
                                }

                          </ul>
                        </div>
                      </div>

                    </>
                  )
                }
                )}

              </div>
              <div onClick={() => {
                setsections([...sections, { id: sections[sections.length - 1].id + 1, option: [0] }])
              }} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Section</div>
            </div>
          )} */}


                    {currentStep === 3 && (
                        <div className="mt-8">
                            <div className="bg-blue-6 p-4">
                                {allSections.map((item, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <p className="font-bold mt-4 text-lg">Section {index + 1}</p>
                                                <div className="flex flex-col md:flex-row gap-4 mt-4" >
                                                    <div className="w-full">
                                                        <p>Section Name</p>
                                                        <div>
                                                            <input type="text" value={item.name} className="form border w-full p-2 rounded h-full" {...register(`sections[${index}].name`)} />
                                                        </div>
                                                    </div>
                                                    {durationType === 'section' ? (
                                                        <div className="w-full">
                                                            <p>Duration</p>
                                                            <div >
                                                                <div className="flex h-full">
                                                                    <input type="number" className="border w-full h-full flex-grow rounded p-2" placeholder="0"  />
                                                                    <input className="bg-black-9 p-2 w-24 text-center h-full border text-black-4" placeholder="Minute" disabled />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="hidden md:flex md:w-full" />
                                                    )}

                                                </div>
                                                <div className="mt-4">
                                                    <p className="mt-4">Instruction </p>

                                                    <div className="p-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Exam requirements:</h2>
                                                        <ul className="space-y-1 max-w-md list-disc list-inside text-gray-500 dark:text-gray-400">
                                                            { <p>{instruction}</p>  }
                                                            <QuillCreated className="invisible" data={instruction} register={ setValue(`sections[${index}].instruction`, instruction)} />
                                                        </ul>
                                                    </div>
                                                </div>

                                            </React.Fragment>
                                        )
                                    }
                                )}

                            </div>
                            {/* <div onClick={() => {
                setsections([...sections, { id: sections[sections.length - 1].id + 1, option: [0] }])
              }} className="text-blue-1 cursor-pointer text-center p-2 border-dashed border-2 border-blue-1 mt-4 rounded-lg">+ Add New Section</div> */}
                        </div>
                    )}


                    <div className="flex -z-10 gap-4 flex-row-reverse my-4">
                        {currentStep < 3 && (<div className={`${3 > currentStep ? 'cursor-pointer' : 'cursor-default'}`}><Button title="Next Step" /></div>
                        )}
                        {currentStep === 3 && (
                            <>
                                <div onClick={() => setStatus("published")}><Button title="Save Test" /></div>
                            </>
                        )}
                        {currentStep > 1 ? (
                            <div onClick={() => {
                                currentStep > 1 && (setCurrentStep(currentStep - 1) , setIsNotChecked('false'))
                            }} className={`${1 < currentStep ? 'cursor-pointer' : 'cursor-default'}  text-black-4 p-2 rounded`}>Back Step</div>
                        ) : (
                            <Link href={`/${role}/exams`}>
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
                    <ModalHeader fontSize="medium"><center>Success</center></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="flex flex-col text-center text-sm ">
                            Section Successfully Created
                            <div className="self-center">
                                <Link href={`/${role}/exams`}>
                                    <a><Button title="Okay" className="mt-4" /></a>
                                </Link>
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </div >
    )
}
