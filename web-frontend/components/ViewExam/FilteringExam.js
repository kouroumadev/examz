import React from "react";
import {
  Select
} from '@chakra-ui/react'

export default function FilteringExams({ search, setSearch, setType, setStatus }) {
  return (
    <div className="flex md:flex-row flex-col gap-4 mb-4">
      <input type="text" className=" border rounded w-full md:w-1/2 p-2 text-sm" value={search} placeholder="Search Exam" onChange={(e) => {
        setSearch(e.target.value)
      }} />
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2 h-full  ">
        <div className="w-full rounded py-2 pl-2 border">
          <Select placeholder='All Type' size="sm" variant="unstyled" onChange={(e) => {
            setType(e.target.value)
          }}>
            <option value='live'>Live</option>
            <option value='standard'>Standard</option>
          </Select>
        </div>
        <div className="w-full rounded py-2 pl-2 border">
          <Select placeholder='All Status' size="sm" variant="unstyled" onChange={(e) => {
            setStatus(e.target.value)
          }}>
            <option value='waiting'>Waiting</option>
            <option value='published'>Published</option>
            <option value='draft'>Draft</option>
            <option value='completed'>Completed</option>
          </Select>
        </div>
      </div>
    </div>
  )
}