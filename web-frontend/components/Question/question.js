import { useEffect, useState } from 'react'

export function Marking({ mark, negativeMark, setMark, setNegativeMark, indexEachQuestion, errors, render}) {
  const [markValue, setMarkValue] = useState(mark) 
  const [negativeMarkValue, setNegativeMarkValue] = useState()

  // useState(async()=>{
  //   console.log(mark)
  //   setMarkValue(mark)
  //   setNegativeMarkValue(negativeMark)
  // },[mark, negativeMark, render])

  return (
    <div className="flex flex-col md:flex-row mt-4 gap-4 mb-4">
      <div className="w-full">
        <p>Marks {errors&& (
          <span className="text-red-1 text-sm">{errors[`questions.${indexEachQuestion}.mark`]}</span>
        )}</p>
        <input value={mark} type="number" className=" w-full form border rounded p-2" placeholder="0" onChange={(e) => {
          setMark(indexEachQuestion, e.target.value)
        }} />
      </div>
      <div className="w-full">
        <p>Negative Marking {errors && (
          <span className="text-red-1 text-sm">{errors[`questions.${indexEachQuestion}.negative_mark`]}</span>
        )}</p>
        <input value={negativeMark} type="number" className="w-full form border rounded p-2" placeholder="0" onChange={(e) => setNegativeMark(indexEachQuestion, e.target.value)} />
      </div>
    </div>
  )
}