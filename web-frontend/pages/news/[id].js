import Link from "next/link"
import { FaAngleLeft } from "react-icons/fa";
import Card from "../../components/Cards/Card";
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import instance from "../../action/instance";
import apiLanding from "../../action/landingPage";
import Header from "../../components/Navbar/header";
import Footer from "../../components/footer/footer";

export default function ReadNews() {
  const Router = useRouter()
  const { id } = Router.query
  const [dataNews, setDataNews] = useState([])
  const [date, setDate] = useState()
  const [cover, setCover] = useState("/asset/img/coverNews.png")
  const [tags, setTags] = useState([])
  useEffect(() => {
    const getData = async () => {
      await apiLanding.showNews(id)
        .then((res) => {
          const date = new Date(res.data.data.updated_at)
          setDate(date)
          setDataNews(res.data.data)
          if (res.data.data.tags !== 'null') {
            console.log("ada tag")
            const str = res.data.data.tags.replace(/['"]+/g, '').slice(1)
            const myArr = str.slice(0, str.length - 1).split(", ")
            var arr = []
            for (let i = 0; i < myArr.length; i++) {
              arr.push(myArr[i])
            }
            setTags(arr)
          }
          if (res.data.data?.image !== null) {
            setCover(instance.pathImg + res.data.data.image)
          }
          console.log(tags)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    getData()
  }, [])
  const dummy = [1, 2, 3]
  return (
    <>
    <Header/>
      <div className="mt-16  md:mt-24">
        <Link href="/landing">
          <a className="flex gap-4 text-blue-1 m-4 hover:text-blue-2">
            <FaAngleLeft className="my-auto" />
            <span>Back</span>
          </a>
        </Link>
        <Card title={dataNews.title} >
          <div className="flex gap-4 mb-4">
            <span className="text-blue-1 font-bold" >By {dataNews?.user?.name}</span>
            <span>Updated {date?.toDateString()} </span>
          </div>
          <div>

          </div>
          <img src={cover} className="max-w-lg mx-auto" />

          <div className="text-container mt-4" dangerouslySetInnerHTML={{ __html: dataNews?.description }} />
          <p className="mt-4 font-bold">Tags</p>
          <div className="flex gap-2 mt-2">
            {tags.map((item, index) => (
              <div key={index} className="text-blue-1 p-2 rounded bg-blue-6 inline-block">{item}</div>
            ))}
          </div>
          {/* <p className="mt-4 font-bold">Featured News</p> */}
          {/* <CardNews /> */}
        </Card>
      </div>
      <Footer/>
    </>
  )
}