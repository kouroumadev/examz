import Image from "next/image"

export function HeaderInstruction({ itemSection, index }) {
  return (
    <div className="flex flex-col bg-black-8 rounded-lg mb-4 p-5">
      <div className="flex">
        <div className="font-bold w-full">
          Section {index + 1}
          <p className="flex gap-1 mt-1 font-normal">
            <Image src="/asset/icon/table/ic_section.svg" width={16} height={16} alt="icon name section" className="my-auto" />
            {itemSection?.name}</p>

        </div>
        <div className="w-full font-bold">
          Duration
          <p className="flex gap-1 font-normal mt-1" >
            <Image src="/asset/icon/table/ic_timer.svg" width={16} height={16} alt="icon timer" className="my-auto" />
            {itemSection?.duration} Minute</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="font-bold"> Instruction </p>
        <div className="text-container" dangerouslySetInnerHTML={{ __html: itemSection?.instruction }} />
      </div>
    </div>
  )
}
