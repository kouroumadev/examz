import React, { useEffect, useState } from "react";
import Datetime from 'react-datetime'
import Image from "next/image";
import moment from 'moment';
var yesterday = moment().subtract(1, 'day');
var valid = function (current) {
  return current.isAfter(yesterday);
};

const datetimePlaceholder = { placeholder: "Select Time " };

export function Time({ setDate = false, data = false }) {
  const [value, setValue] = useState(new Date())
  const changeData = () => {
    console.log(value)
    const format = 'HH:mm'
    const dateTime = moment(value).format(format)
    if (setDate !== false) {
      setDate(dateTime)
    }
  }
  useEffect(() => {
    const format = 'HH:mm'
    if (data !== false) {
      const dateTime = moment(data).format(format)
      setDate(dateTime)
    } else {
      const dateTime = moment(value).format(format)
      setDate(dateTime)
    }
  }, [])

  return (
    <Datetime inputProps={data !== false ? {placeholder: data }: datetimePlaceholder} dateFormat={false} defaultValue={data} renderInput={renderInput} isValidDate={valid} onChange={(e) => {
      if (setDate !== false) {
        setDate(e.format("HH:mm"))
      }
    }} />
    // <Datetime inputProps={datetimePlaceholder} dateFormat={false} renderInput={renderInput} isValidDate={valid} value={data !== false ? data : value} onChange={() => {
    //   setValue()
    //   changeData()
    //   // set
    // }} />
  )
}

function renderInput(props, openCalendar, closeCalendar) {
  return (
    <div className="flex justify-between w-full h-9 justify-content border p-1  text-sm rounded">
      <input {...props} className="text-sm w-full" />
      <div className="cursor-pointer my-auto" onClick={openCalendar}><Image src="/asset/icon/table/fi_clock.svg" className="my-auto" height={12} width={12} /></div>
    </div>
  );
}
