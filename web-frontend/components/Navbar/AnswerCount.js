import React from "react";

export default function AnswerCount({notVisited, answered, marked, notAnswered, markedAndAnswered, totalCom, remainCom}) {
  return (
    <div className="flex flex-wrap gap-4 mt-2 text-xs">
      <div className="flex gap-2">
        <div className="flex-nowrap flex w-8 h-8 border">
          <div className="flex align-middle text-center m-auto">
            {notVisited}
          </div>
        </div>
        <span className="my-auto">Not Visited</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-nowrap w-8 flex  h-8 border bg-green-3 rounded-t-full border-1 border-green-1">
          <div className="flex align-middle text-center m-auto">
            {answered}
          </div>
        </div>
        <span className="my-auto">Answered</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-nowrap w-8 flex  h-8 border bg-purple-1 rounded-full border-1 border-purple-2">
          <div className="flex align-middle text-center m-auto">
            {marked}
          </div>
        </div>
        <span className="my-auto">Marked</span>
      </div>

      <div className="flex gap-2">
        <div className="flex-nowrap w-8 flex  h-8 border bg-red-2 rounded-b-full border-1 border-red-1">
          <div className="flex align-middle text-center m-auto">
            {notAnswered}
          </div>
        </div>
        <span className="my-auto">Not Answered</span>
      </div>

      {/* <div className="flex gap-2">
        <div className="flex-nowrap w-8 flex  h-8 border bg-yellow-1 rounded-full border-1 border-yellow-2">
          <div className="flex align-middle text-center m-auto">
            {totalCom}
          </div>
        </div>
        <span className="my-auto">Total Compulsory</span>
      </div> */}
      {/* <div className="flex gap-2">
        <div className="flex-nowrap w-8 flex  h-8 border bg-green-3 rounded-full border-1 border-green-1">
          <div className="flex align-middle text-center m-auto">
            {remainCom}
          </div>
        </div>
        <span className="my-auto">Compulsory and Answered</span>
      </div> */}

      <div className="flex gap-2">
        <div className="flex-nowrap w-8 flex  h-8 border relative bg-green-3 rounded-full border-1 border-purple-2">
          <div className="absolute bottom-1 right-0 rounded-full bg-green-1 w-2 h-2" />
          <div className="flex align-middle text-center m-auto">
            {markedAndAnswered}
          </div>
        </div>
        <span className="my-auto">Market and Answered</span>
      </div>
      {/* added code */}
      {/* <div className="flex gap-2">
        <div className="flex-nowrap flex w-8 h-8 border">
          <div className="flex align-middle text-center m-auto">
            {sectionRemainQuestion}/{sectionMaxQuestion}
          </div>
        </div>
        <span className="my-auto">Remaining Questions</span>
      </div> */}
      {/* end added code */}
    </div>
  )
}