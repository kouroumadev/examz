import React from "react";
import Image from 'next/image'
import Link from "next/link";
import instance from "../../action/instance";
import { useEffect } from "react";

export default function CardNews({ cover = "/asset/img/coverNews.png", dataNews, url = '#' }) {
  const date = new Date(dataNews?.updated_at)
  if (dataNews?.image !== null) {
    cover = instance.pathImg + dataNews?.image
  }
  return (
    <>
      <Link href={url}>
        <a>
          <div className="text-sm m-2 bg-white md:inline-block w-56 rounded-lg hidden cursor-pointer hover:bg-black-7 border">
            <Image loader={() => cover} src={cover} height={128} width={240} alt="cover news" />
            <p className="font-bold px-4 mt-2 text-sm text-wrap">{dataNews?.title.length > 24 ? dataNews?.title.substring(0, 24) + "..." : dataNews?.title}</p>
            <p className="text-black-5 px-4 mb-4">Posted on {date.toDateString()}</p>
          </div>
        </a>
      </Link>
      <Link href={url}>
        <a>
          <div className="flex m-2 ccc text-sm min-w-1/3 bg-white rounded-lg border md:hidden p-2">
            <Image loader={() => cover} src={cover} height={150} width={200} className="object-cover" alt="cover news" />
            <div className="my-auto">
              <p className="font-bold px-4 mt-2">{dataNews?.title.length > 24 ? dataNews?.title.substring(0, 24) + "..." : dataNews?.title}</p>
              <p className="text-black-5 px-4 mb-4">Posted on {date.toDateString()}</p>
            </div>
          </div>
        </a>
      </Link>
    </>
  )
}

export function CardNews2({ cover = "/asset/img/coverNews.png", dataNews, url = '#' }) {
  const date = new Date(dataNews?.updated_at)
  if (dataNews?.image !== null) {
    cover = instance.pathImg + dataNews?.image
  }
  return (
    < >
      <Link href={url}>
        <a>
          <div className="text-sm w-56 m-2 bg-white md:inline-block rounded-lg hidden cursor-pointer hover:bg-black-7 border">
            <Image loader={() => cover} src="/asset/img/coverNews.png" height={128} width={240} alt="cover news" />
            <p className="font-bold px-4 mt-2">{dataNews?.title.length > 24 ? dataNews?.title.substring(0, 24) + "..." : dataNews?.title}</p>
            <p className="text-black-5 px-4 mb-4">Posted on {date.toDateString()}</p>
          </div>
        </a>
      </Link>
      <Link href={url}>
        <a>
          <div className="flex m-2 w-80 ccc text-sm bg-white rounded-lg border md:hidden p-2">
            <Image loader={() => cover} src="/asset/img/coverNews.png" height={150} width={200} className="object-cover" alt="cover news" />
            <div className="my-auto">
              <p className="font-bold px-4 mt-2">{dataNews?.title.length > 24 ? dataNews?.title.substring(0, 24) + "..." : dataNews?.title}</p>
              <p className="text-black-5 px-4 mb-4">Posted on {date.toDateString()}</p>
            </div>
          </div>
        </a>
      </Link>
    </>
  )
}