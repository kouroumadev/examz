import React, { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'
export default function Card({ children, ArrowColor, count = 0 }) {

  const listRef = useRef(null);

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        top: 0,
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        top: 0,
        left: -300,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className='flex'>
      {count > 4 && (
        <div className="h-full my-auto z-100">
          <AiFillLeftCircle size={32} color={ArrowColor} className='absolute z-100    hidden md:flex  cursor-pointer'
            onClick={scrollLeft} />
        </div>
      )}
      <div className="flex  pl-3 w-full">
        <div className='flex overflow-x-scroll md:overflow-x-hidden' ref={listRef}>
          {children}
        </div>
      </div>
        {count > 4 && (
          <div className="flex -ml-4 my-auto z-100 bg-red-300 h-full">
            <AiFillRightCircle size={32} color={ArrowColor} className='my-auto  absolute   hidden z-100  md:flex cursor-pointer'
              onClick={scrollRight} />
          </div>
        )}
    </div>
  )
}