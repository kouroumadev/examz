import React from "react";
import Button from "../Button/button";
import Image from 'next/image'
import Link from "next/link";
import { ModalLogin } from "../Modal/ModalLogin";
import {
  useDisclosure
} from '@chakra-ui/react'

export default function CardQuizzes({ url, data }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <div>
      <div className="flex-nowrap bg-white w-64  overflow-auto  mr-4 mt-4 rounded-lg p-4">
        <div className="flex flex-row gap-4">
          <img className='w-9 h-9 my-auto' src="/asset/icon/ic_quiz.png" alt="icon paper" />
          <div>
            {data?.type === 'live' ? (
              <p className="font-bold self-center">{data?.name.length > 18 ? data?.name.substring(0, 18) + "..." : data?.name} {data?.type === 'live' && (<img className='inline ml-2' src="/asset/icon/ic_live_text.png" />)}</p>
            ) : (
              <p className="font-bold self-center">{data?.name.length > 15 ? data?.name.substring(0, 18) + "..." : data?.name} </p>
            )}
            <p className="text-black-3 text-sm">By <span className='text-blue-1'>{data?.institute === null ? 'Examz' : data?.institute?.name}</span></p>
          </div>
        </div>
        <div className="flex flex-col mt-4 text-sm">
          <div className="flex gap-4 text-black-3">
            <Image height={16} width={16} src="/asset/icon/ic_clock.svg" alt="icon paper" />
            <span>{data?.duration} mins duration </span>
          </div>
          <div className="flex gap-4 text-black-3">
            <Image height={16} width={16} src="/asset/icon/ic_date.svg" alt="icon paper" />
            <span>{data?.started ? data?.started : '-'}</span>
          </div>
        </div>
        {url.split("/")[url.split("/").length - 1] !== 'undefined' ? (
          <>
            {data.start_quiz === 1 ? (
              <Link href={url} >
                <a>
                  <Button title={`${data?.has_unfinished === 1 ? 'Continue' : 'Start'} Quiz`} className="w-full mt-4" />
                </a>
              </Link>
            ) : (
              <Link href='#' >
                <a>
                  <button className="bg-black-6 mt-4  text-center text-black-2 py-2 px-4 font-semibold text-sm rounded cursor-default  w-full">Already Taken</button>
                </a>
              </Link>
            )}
          </>
        ) : (
          <div onClick={onOpen}>
            <Button title="Start Quiz" className="w-full mt-2" />
          </div>
        )}
        <ModalLogin isOpen={isOpen} onClose={onClose} />
      </div>
    </div>
  )
}