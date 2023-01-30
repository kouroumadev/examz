import React from "react";
import Button from "../Button/button";
import Image from 'next/image'
import Link from "next/link";
import {
  useDisclosure
} from '@chakra-ui/react'
import { ModalLogin } from "../Modal/ModalLogin";

export default function CardExams({ data = false, url = false }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <div>
      <div className="flex-nowrap w-64  mr-4 mt-4 bg-white rounded-lg pt-4 px-4">
        <div className="flex flex-row gap-4">
          <img className='w-9 h-9 my-auto' src="/asset/icon/ic_a+_yellow.png" alt="icon paper" />
          <div className='w-full'>
            <div className='flex justify-between'>
              {data?.type === 'live' ? (
                <p className="font-bold self-center">{data?.name.length > 18 ? data?.name.substring(0, 18) + "..." : data?.name} {data?.type === 'live' && (<img className='inline ml-2' src="/asset/icon/ic_live_text.png" />)}{data?.exam?.type === 'live' && (<img className='inline ml-2' src="/asset/icon/ic_live_text.png" />)}</p>
              ) : (
                <p className="font-bold self-center">{data?.name.length > 15 ? data?.name.substring(0, 15) + "..." : data?.name} </p>
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
        {url.split("/")[url.split("/").length - 1] !== 'undefined' ? (
          <>
            {data.start_exam === 1 || data.start_exam === 0 ? (
              <>
                {data.start_exam === 1 ? (<Link href={url} >
                  <a>
                    <Button title={`${data?.has_unfinished === 1 ? 'Continue' : 'Start'} Exam`} className="w-full my-4" />
                  </a>
                </Link>
                ) : (
                  <Link href='#' >
                    <a>
                      <button className="bg-black-6 mt-4 mb-4 text-center text-black-2 py-2 px-4 font-semibold text-sm rounded cursor-default  w-full">Already Taken</button>
                    </a>
                  </Link>
                )}
              </>
            ) : (
              <Link href='#' >
                <a>
                  <button className="bg-black-6 mt-4 mb-4 text-center text-black-2 py-2 px-4 font-semibold text-sm rounded cursor-default  w-full">Cooming Soon</button>
                </a>
              </Link>
            )}
          </>
        ) : (
          <div onClick={onOpen}>
            <Button title="Start Exam" className="w-full my-2" />
          </div>
        )}
        <ModalLogin isOpen={isOpen} onClose={onClose} />
        {/* <p className="text-black-3 text-sm text-center my-4">200 Student are writing this exam</p> */}
      </div>
    </div>
  )
}