import Image from "next/image"
import Link from "next/link"

export function TitleSection({ dataExams, id, type }) {
  return (
    <div className="flex justify-between">
      <h1 className="font-bold text-xl my-auto ">List of test sessions <span className="text-blue-1">{dataExams.name}</span> </h1>
      <Link href={`edit/${id}`}>
        <a >
          <div className="flex  border border-blue-1 hover:bg-blue-6  rounded p-2">
            <div className="m-auto text-blue-1">
              <Image src="/asset/icon/table/fi_edit_blue.svg" className="mr-4 my-auto" height={12} width={12} />
              <span className="ml-2">
                Edit {type}
              </span>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}
