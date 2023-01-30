import React from "react";
import Button from "../Button/button";
import Image from 'next/image'
import Link from 'next/link'

export default function CardPaper({ data }) {
  return (
    <div>
      <div className="flex-nowrap w-64  mr-4 mt-4 bg-white mt-4 rounded-lg pt-4 px-4">
        <div className="flex flex-row gap-4">
          <img className='w-9 h-9 my-auto' src="/asset/icon/ic_a+_yellow.png" alt="icon paper" />
          <div className='w-full'>
            <div className='flex justify-between'>
              {data?.type === 'live' ? (
                <p className="font-bold self-center">{data?.name.length > 18 ? data?.name.substring(0, 18) + "..." : data?.name}</p>
              ) : (
                <p className="font-bold self-center">{data?.name.length > 15 ? data?.name.substring(0, 18) + "..." : data?.name} </p>
              )}
            </div>
            <p className="text-black-3 text-sm">By <span className='text-blue-1'>{data?.institute === null ? 'Examz' : data?.institute?.name}</span></p>
          </div>
        </div>
        <div className="flex flex-col mt-4 text-sm">
          <div className="flex gap-2 text-black-3 gap-4">
            <Image height={16} width={16} src="/asset/icon/ic_clock.svg" alt="icon paper" />
            <span>{data?.duration} mins duration </span>
          </div>
          <div className="flex gap-2 text-black-3 gap-4">
            <Image height={16} width={16} src="/asset/icon/ic_volume.svg" alt="icon paper" />
            <span>{data?.total_section} Section</span>
          </div>
          <div className="flex gap-2 text-black-3 gap-4">
            <Image height={16} width={16} src="/asset/icon/ic_date.svg" alt="icon paper" />
            <span>{data?.started ? data?.started : '-'}</span>
          </div>
        </div>
        <Link href={`/prev-paper/${data?.slug}`} >
          <a>
            <Button title="See Detail" className="w-full my-2" />
          </a>
        </Link>
      </div>
    </div>
  )
}