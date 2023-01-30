import Link from "next/link"
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from 'next/router'

function Button({ title, action = false, className, href = false }) {
  return (
    <>
      {!href ? (
        <button className={`bg-blue-1 text-white py-2 px-4 font-semibold text-sm rounded hover:bg-blue-2 hover:filter hover:drop-shadow-xl ${className}`} onClick={() => action !== false && action()}>{title}</button>
      ) : (
        <Link href={href}>
          <a className="flex text-white border-2 rounded-lg h-full px-4">
            <span className="m-auto">
              {title}
            </span>
          </a>
        </Link>
      )}
    </>
  )
}

export function BackButton({url}){
  const router = useRouter()
  return(
    <div onClick={() => router.back()} className="cursor-pointer">
      <a className="flex gap-4 text-blue-1 mb-4 hover:text-blue-2">
        <FaAngleLeft className="my-auto" />
        <span>Back</span>
      </a>
    </div>

  )
}

export default Button