import React from "react";

export default function NavigationQuestion({ totalCompAnswered, totalCompQuestion, totalNotCompAnswered, totalNotCompQuestion, listQuestion, setActiveQuestionId, activeQuestionId, isPausePractice = false }) {
  
  let notCompulsory = []
  
  listQuestion.map((itemQuestion) => {
    if(itemQuestion.is_required == '0') {
      notCompulsory.push(itemQuestion)
    } 
  })

  return (
    <>
      
      <div className="bg-black-9 p-2 mt-4 ">

        <h1 className="font-bold my-2">{totalCompAnswered} of &nbsp;
          {totalCompQuestion} Compulsory Question Answered</h1>
        <div className="flex flex-wrap gap-2 text-xs">
          {listQuestion.map((item, index) => (
            <>

              {item.is_required == '1' && (
                  <div key={index} className={` 
                  ${index === activeQuestionId && 'rounded-t-full bg-purple-1 border-purple-2 border-1'} 
                  ${item.status === 'marked' && index !== activeQuestionId && 'bg-purple-1 rounded-full border-1 border-purple-2'} 
                  ${item.status === 'marked_and_answered' && index !== activeQuestionId && 'relative bg-purple-100 rounded-full border-1 border-purple-2'} 
                  ${item.status === 'answered' && index !== activeQuestionId && 'bg-green-3 rounded-t-full border-1 border-green-1'}
                  ${item.status === 'not_answered' && index !== activeQuestionId && 'bg-red-2 rounded-b-full border-1 border-red-1'}
                  cursor-pointer flex-nowrap w-8 flex  h-8 border`} onClick={() => {
                    !isPausePractice && setActiveQuestionId(index)
                  }}>
                  {item.status === 'marked_and_answered' && (
                    <div className="absolute bottom-1 right-0 rounded-full bg-green-1 w-2 h-2" />
                  )}
                  <div className="flex align-middle text-center m-auto text-xs">
                    {index + 1}
                  </div>
                </div>
              )}
                    
              
            </>
          ))}
        </div>    

      </div>

      <div className="bg-black-9 p-2 mt-4 ">

        <h1 className="font-bold my-2">{totalNotCompAnswered} of &nbsp;
          {totalNotCompQuestion} Not Compulsory Question Answered</h1>
        <div className="flex flex-wrap gap-2 text-xs">
          {listQuestion.map((item, index) => (
            <>

              {item.is_required == '0' && (
                  <div key={index} className={` 
                  ${index === activeQuestionId && 'rounded-t-full bg-purple-1 border-purple-2 border-1'} 
                  ${item.status === 'marked' && index !== activeQuestionId && 'bg-purple-1 rounded-full border-1 border-purple-2'} 
                  ${item.status === 'marked_and_answered' && index !== activeQuestionId && 'relative bg-purple-100 rounded-full border-1 border-purple-2'} 
                  ${item.status === 'answered' && index !== activeQuestionId && 'bg-green-3 rounded-t-full border-1 border-green-1'}
                  ${item.status === 'not_answered' && index !== activeQuestionId && 'bg-red-2 rounded-b-full border-1 border-red-1'}
                  cursor-pointer flex-nowrap w-8 flex  h-8 border`} onClick={() => {
                    !isPausePractice && setActiveQuestionId(index)
                  }}>
                  {item.status === 'marked_and_answered' && (
                    <div className="absolute bottom-1 right-0 rounded-full bg-green-1 w-2 h-2" />
                  )}
                  <div className="flex align-middle text-center m-auto text-xs">
                    {index + 1}
                  </div>
                </div>
              )}
                    
              
            </>
          ))}
        </div>


        

      </div>

    </>
  )
}