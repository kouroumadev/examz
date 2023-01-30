import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
  import Button from '../Button/button';

  import Card from '../Cards/Card';
//   import Image from "next/image";
  import Image from "next/image";
  
  export default function ModalResult({isOpen, onClose, sectionName, dataExams, activeSectionId, activeQuestionId }) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="medium">Information about the selected question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            
            <div className="min-w-full overflow-x-hidden">
                <div className="flex gap-4">
                <div className="w-full md:pr-4">
                    <div className="flex  gap-4 bg-white md:rounded-lg px-4">
                    
                        {/* here section name */}
                        <div className="text-blue-1 border-b-2 border-blue-1 font-bold"  pb-4 cursor-pointer>
                        {sectionName}
                        </div>
                    
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
                    <h6 className="font-bold my-2">Question {activeQuestionId + 1}</h6>
                    <div className="text-container leading-6" dangerouslySetInnerHTML={{ __html: dataExams.sections[activeSectionId].question_items[activeQuestionId]?.question }} />
                    {dataExams.sections[activeSectionId].question_items[activeQuestionId]?.options.map((itemAnswer, indexAnswer) => {
                        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
                        //  single correct answer => 1 => answer and selected answer is same(green) 2(red) => answer and selected answer is different 3(purple)=> you did not select this correct answer (4) this is just an option
                        //  multiple correct answer => 1(green) => this option is selected and its one of the correct answers (red) => option is selected but its not correct option 3(purple) => you did not select this correct answer
                        let selectedOption = 4;
                        if(dataExams.sections[activeSectionId].question_items[activeQuestionId]?.result_details.length > 0){
                        dataExams.sections[activeSectionId].question_items[activeQuestionId]?.result_details[0].detail_options?.map((option)=>{
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
                    
                    </Card>
                
                
                </div>
                
                </div>
            </div>
            
          </ModalBody>
          <ModalFooter>
            {/* <div className="mr-4 test-sm cursor-pointer" onClick={onClose}>
              Cancel
            </div> */}
            <div onClick={() => {
              // onNextSection()
              onClose()
            }}><Button title="Close" /></div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
  