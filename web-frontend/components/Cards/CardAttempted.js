import React from "react";
import Button from "../Button/button";
import Image from 'next/image'
import Link from "next/link";

export default function CardAttempted({ type = false, data, url = '#', score = '#', status, isStart }) {
  return (
    <div>

      <div className="flex-nowrap w-64  mr-4 mt-4 bg-white rounded-lg pt-4 px-4">
        <div className="flex flex-row gap-4">
          <img className='w-9 h-9 my-auto' src="/asset/icon/ic_a+_yellow.png" alt="icon paper" />
          <div className='w-full'>
            <div className='flex justify-between'>
              <p className="font-bold self-center">{data?.name.length > 15 ? data?.name.substring(0, 15) + "..." : data?.name} {data?.type === 'live' && (<img className='inline ml-2' src="/asset/icon/ic_live_text.png" />)} </p>
            </div>
            <p className="text-black-3 text-sm">By <span className='text-blue-1'>{data?.institute === null ? 'Examz' : data?.institute?.name}</span></p>
          </div>
        </div>
        <div className="flex flex-col mt-4 text-sm">
          <div className="flex gap-2 text-black-3 gap-4">
            <Image height={16} width={16} src="/asset/icon/ic_clock.svg" alt="icon paper" />
            <span>{data?.duration} mins duration </span>
          </div>
          {type === 'exam' && (
            <div className="flex gap-2 text-black-3 gap-4">
              <Image height={16} width={16} src="/asset/icon/ic_volume.svg" alt="icon paper" />
              <span>{data?.total_section} Section</span>
            </div>
          )}
          <div className="flex gap-2 text-black-3 gap-4">
            <img src="/asset/icon/ic_date.svg" alt="icon paper" className="z-0 " />
            {type === 'practice' ? (
              <span>{data?.start_date ? data?.start_date : '-'}</span>
            ) : (
              <span>{data?.started ? data?.started : '-'}</span>
            )}
          </div>
        </div>
        {status !== 'process' ? (
          <Link href={score} >
            <a>
              <button className={`bg-white text-blue-1 border w-full border-blue-1 mt-2 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`}>View Score</button>
            </a>
          </Link>
        ) : (
          <div className={`bg-white text-black-6 border text-center  w-full border-black-6 mt-2 py-2 px-4 font-semibold text-sm rounded `}>View Score</div>
        )}
        {isStart === 0 ? (
          <Link href='#' >
            <a>
              <button className="bg-black-6 mt-4 mb-4 text-center text-black-2 py-2 px-4 font-semibold text-sm rounded cursor-default  w-full">Already Taken</button>
            </a>
          </Link>
        ) : (
          <Link href={url} >
            <a>
              <Button title={`${status === 'process' ? 'Continue' : 'Re-Attempt'}`} className="w-full my-4" />
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}