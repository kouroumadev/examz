import Link from "next/link"

export function TitleButton({ title, url, isLive = false, count = 0 }) {
  return (
    <div className='flex justify-between pl-4'>
      <div className="flex">
        {isLive && (<img src="/asset/icon/ic_live_transparent.png" alt="icon live" className='w-8 h-8 mr-2' />)}
        <span className="text-2xl mr-2">{title}</span>
      </div>
      {count > 4 && (
        <Link href={url}>
          <a className='inline-block text-blue-1 hover:text-yellow-1 mt-2'>
            See All
          </a>
        </Link>
      )}
    </div>
  )
}
