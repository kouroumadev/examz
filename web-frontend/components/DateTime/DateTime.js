import React, { useState } from "react";
import Datetime from 'react-datetime'
import Image from "next/image";
import moment from 'moment';
var yesterday = moment().subtract(1, 'day');
var valid = function (current) {
  return current.isAfter(yesterday);
};

const datetimePlaceholder = { placeholder: "Select Time and Date" };

export function MyDTPicker({ setDate = false, data = false }) {
  return (
    <Datetime inputProps={data !== false ? {placeholder: data }: datetimePlaceholder} dateFormat="YYYY-MM-DD HH:mm" defaultValue={data} renderInput={renderInput} isValidDate={valid} onChange={(e) => {
      if (setDate !== false) {
        setDate(e.format("YYYY-MM-DD HH:mm"))
      }
    }} />
  )
}

function renderInput(props, openCalendar, closeCalendar) {
  return (
    <div className="flex w-full justify-between justify-content border p-2 text-sm rounded-lg">
      <input {...props} />
      <div className="cursor-pointer" onClick={openCalendar}><Image src="/asset/icon/table/fi_calendar.svg" height={16} width={16} /></div>
    </div>
  );
}
