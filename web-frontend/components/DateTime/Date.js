import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

export default function DatePicker2({data = false, setData = false }) {
  const [date, setDate] = useState(new Date());
  const [updateData, setUpdateData] = useState()
  useEffect(() => {
    console.log(date)
    if(!data){
      setData(convert(date))
    } else {
      setData(convert(data))
    }
    console.log(date)
    data !== false && setUpdateData(data)
  }, [data])

  useEffect(() => {
    console.log(date)
    if(!data){
      setData(convert(date))
    } else {
      setData(convert(data))
    }
    console.log(date)
    data !== false && setUpdateData(data)
  }, [])
  return (
    <DatePicker dateFormat="yyyy/MM/dd" className="w-full" placeholderText={updateData !== '' ? updateData : data !== false && data} selected={data === false && date} onChange={e => {
      setUpdateData(convert(e))
      setDate(e)
      setData(convert(e))
    }} />
  );
}