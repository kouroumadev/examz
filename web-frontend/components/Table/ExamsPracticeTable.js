import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function ExamPracticeTable({ TableHead, list, type, onOpen, setSelectedData, onOpenPublish }) {
  return (<table className="table md:min-w-full overflow-auto divide-y divide-gray-200 text-sm">
    <thead className="bg-black-9" >
      {TableHead.map((item, index) => (
        <th key={index} scope="col" className="px-6 h-12 text- tracking-wider">
          {item}
        </th>
      ))}
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {list.map((item) => (
        <tr key={item.id} className="h-12">
          <td className="px-6 h-12 whitespace-nowrap text-center">
            <div>{item.name}</div>
          </td>
          <td className="px-6  h-12 whitespace-nowrap  text-center">
            <div>{type === 'exams' ? item.type : item.exam_type.name}</div>
          </td>
          <td className="px-6 h-12  whitespace-nowrap  text-center">
            {type === 'exams' && (
              <div>{item.start_date ? item.start_date + ' - ' + item.end_date : '-'}</div>
            )}
            {type === 'practice' && (
              <div>{item.start_date ? item.start_date : '-'}</div>
            )}
          </td>
          <td className="px-6 h-12 whitespace-nowrap text-center">
            <div>{item.items_count}</div>
          </td>
          <td className="h-12">
            <div className={`${item.status === 'draft' ? 'bg-black-8 text-black-3' : 'bg-green-2 text-green-1'} text-center w-24 flex-0 m-auto font-bold  rounded py-1 `}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </div>
          </td>
          <td className="md:pl-20 pl-4 h-12 min-w-max whitespace-nowrap flex  gap-2 my-auto text-sm font-medium flex  h-full">
            <div className="flex gap-2 flex-row mt-4">
              <Link href={`${type}/view/${item.id}`}>
                <a className="text-indigo-600 hover:text-indigo-900 m-auto">
                  <Image src="/asset/icon/table/fi_eye.svg" width={16} height={16} alt="icon edit" />
                </a>
              </Link>
              {item.status === 'draft' && (
                <>
                  {item.expired_draft === 0 ? (
                    <Link href={`${type}/${item.id}`}>
                      <a className="text-indigo-600 hover:text-indigo-900 m-auto">
                        <Image src="/asset/icon/table/fi_edit.svg" width={16} height={16} alt="icon edit" />
                      </a>
                    </Link>
                  ) : (
                    <Link href={`${type}/edit/${item.id}#draft`}>
                      <a className="text-indigo-600 hover:text-indigo-900 m-auto">
                        <Image src="/asset/icon/table/fi_edit.svg" width={16} height={16} alt="icon edit" />
                      </a>
                    </Link>
                  )}

                  <button className="text-indigo-600 hover:text-indigo-900 m-auto" onClick={() => {
                    setSelectedData(item.id),
                      onOpen()
                  }}>
                    <Image src="/asset/icon/table/fi_trash-2.svg" className="inline-block align-baseline " width={16} height={16} alt="icon deleted" />
                  </button>
                </>)}

              {item.status === 'waiting' && (
                <>
                  <button className="text-indigo-600 hover:text-indigo-900 m-auto" onClick={() => {
                    setSelectedData(item.id),
                      onOpenPublish()
                  }}>
                    <Image src="/asset/icon/table/ic_repeat.svg" className="inline-block align-baseline " width={16} height={16} alt="icon deleted" />
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table >
  )
}