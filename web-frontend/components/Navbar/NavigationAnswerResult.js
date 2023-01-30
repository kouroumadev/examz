import React from "react";
import Card from "../Cards/Card";
import Link from "next/link";

export default function NavigationAnswerResult({ score, totalScore, setActiveQuestionId, activeQuestionId, correct, unanswered, totalQuestion, listQuestion, url, incorrect, urlAnalysis, type, dataRank }) {
  return (
    <>
      <div className="md:w-1/2 lg:w-1/2 hidden md:flex lg:flex" />
      <div className="md:w-1/3 lg:w-1/3 hidden md:flex lg:flex fixed right-4">
        <Card className="w-full">
          <div className="bg-black-9 text-center p-2 rounded">
            Test Result
            <div className="font-bold text-blue-1 text-2xl">{score}/{totalScore}</div>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-xs">
            <div className="flex gap-2">
              <div className="flex-nowrap w-8 flex  h-8 border bg-green-3 rounded-t-full border-1 border-green-1">
                <div className="flex align-middle text-center m-auto">
                  {correct}
                </div>
              </div>
              <span className="my-auto">Correct</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-nowrap w-8 flex  h-8 border bg-red-2 rounded-b-full border-1 border-red-1">
                <div className="flex align-middle text-center m-auto">
                  {incorrect}
                </div>
              </div>
              <span className="my-auto">Incorrect</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-nowrap w-8 flex h-8 border bg-purple-1 rounded-full border-1 border-purple-1">
                <div className="flex align-middle text-center m-auto">
                  {unanswered}
                </div>
              </div>
              <span className="my-auto">Unanswered</span>
            </div>
          </div>
          <div className="bg-black-9 p-2 mt-4">
            <h1 className="font-bold my-2">{correct} of &nbsp;
              {totalQuestion} Question Correct</h1>
            <div className="flex flex-wrap gap-2">
              {listQuestion.map((item, index) => (
                <div key={index} className={` 
                ${index === activeQuestionId && item.status !== 'marked' && item.status !== 'marked_and_answered' && item.status !== 'answered' && item.status !== 'not_answered' && 'rounded-full'} 
                ${item?.result_details?.length > 0 &&  item?.result_details[0]?.correct && 'bg-green-3 rounded-t-full border-1 border-green-1'}
                ${item?.result_details?.length > 0 &&  !item?.result_details[0]?.correct && 'bg-red-2 rounded-b-full border-1 border-red-1'}
                cursor-pointer flex w-8 h-8 text-xs border rounded`} onClick={() => setActiveQuestionId(index)}>
                  <div className="flex align-middle text-center m-auto">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href={url}>
            <a>
              <button className={`text-blue-1 bg-white border w-full mt-4 border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >Back to List {type}</button>
            </a>
          </Link>
          {dataRank?.ended ? (
            <div className={`text-black-3 bg-white border w-full mt-2 border-blue-1 py-2 px-4 font-semibold text-sm rounded  text-center`}> Analysis will appear after the live quiz is over</div>
          ) : (
            <Link href={urlAnalysis}>
              <a>
                <button className={`text-blue-1 bg-white border w-full mt-2 border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >View Analysis</button>
              </a>
            </Link>
          )}
        </Card>
      </div>
    </>
  )
}