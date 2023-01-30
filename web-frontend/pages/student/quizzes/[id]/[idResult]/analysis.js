import LayoutTest from "../../../../../Layout/LayoutTest"
import apiStudentPage from "../../../../../action/student_page"
import { useState, useEffect } from "react";
import Card from '../../../../../components/Cards/Card'
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import LayoutTestResult from "../../../../../Layout/LayoutTest Result";

export default function Index() {
  const Router = useRouter()
  const { id } = Router.query
  const { idResult } = Router.query
  const [data, setData] = useState({
    data: []
  })
  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.showQuizResultRank(id, idResult)
        .then((res) => {
          console.log(data)
          setData(res.data.data)
        })
    }
    getData()
  }, [])

  return (
    <>
      <Card className="w-full mt-12">
        <div className=" text-center p-2 rounded font-bold text-xl">
          Quiz Result
        </div>
        <div className="flex flex-wrap md:min-w-max" >
          <div className="md:w-1/4" />
          <div className="flex w-full md:w-1/4">
            <div className="bg-blue-6 w-full rounded md:m-2 p-2 font-bold">
              <img src="/asset/icon/table/ic_trophy.svg" className="m-auto" />
              {data.rank === null && data.quiz.type === 'mixed' ? (
                <p className="text-center"></p>
              ) : (
                <p className="text-center">
                  You are
                  {data.rank === 1 && ' ' + data.rank + 'st'}
                  {data.rank === 2 && ' ' + data.rank + 'nd'}
                  {data.rank === 3 && ' ' + data.rank + 'rd'}
                  {data.rank !== 1 && data.rank !== 2 && data.rank !== 3 && ' ' + data.rank + 'st'} Rank</p>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/4 bg-blue-6 md:m-2 mt-2 ">
            <p className="font-bold mt-4 ml-4 ">Statistics</p>
            <div className="flex">
              <div className="flex w-full my-auto p-2 bg-blue-6 rounded m-2">
                <div className="w-full">
                  <div className="flex gap-4">
                    <Image src="/asset/icon/table/ic_correct.svg" height={28} width={28} alt="icon correct" />
                    <div>
                      <p className="text-black-4">Correct</p>
                      <p className="font-bold">{data?.correct}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Image src="/asset/icon/table/ic_incorrect.svg" height={28} width={28} alt="icon correct" />
                    <div>
                      <p className="text-black-4">Incorrect</p>
                      <p className="font-bold">{data?.incorrect}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex gap-4">
                    <Image src="/asset/icon/table/ic_score.svg" height={28} width={28} alt="icon correct" />
                    <div>
                      <p className="text-black-4">Score</p>
                      <p className="font-bold">{data?.score}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Image src="/asset/icon/table/ic_accuracy.svg" height={28} width={28} alt="icon correct" />
                    <div>
                      <p className="text-black-4">Accuracy</p>
                      <p className="font-bold">{data?.accuracy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:w-1/4" />
        </div>
        {data.rank === null && data.quiz.type === 'mixed' && (
          <p className="text-center my-4 font-bold">Ranking will appear the next day after taking the quiz</p>
        )}
        {data.data.length > 0 && (
          <><p className="text-center font-bold text-xl mt-4">Table of Ranking</p>
            <div className="flex overflow-auto  md:px-32">
              <table className="table min-w-full mx-auto divide-y divide-gray-200 text-sm">
                <thead className="bg-black-9" >
                  <th
                    scope="col"
                    className="px-6 h-12 text-left tracking-wider"
                  >
                    Rank
                  </th>
                  <th scope="col" className="text-left px-6 tracking-wider h-12">
                    Name
                  </th>
                  <th scope="col" className="text-left px-6 tracking-wider h-12">
                    Correct
                  </th>
                  <th scope="col" className="text-left px-6 tracking-wider h-12">
                    Incorrect
                  </th>
                  <th scope="col" className="text-left px-6 tracking-wider h-12">
                    Accuracy
                  </th>
                  <th scope="col" className="text-left px-6 tracking-wider h-12">
                    Score
                  </th>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.data.map((item, index) => {
                    const myRank = item.id === data.id ? true : false
                    return (
                      <tr key={index} className={`${myRank ? 'text-blue-1  font-bold' : ''} `}>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{index + 1}</div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.user.name} </div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.correct}</div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.incorrect} </div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div> {item.accuracy}</div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.score} </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

          </>
        )}
        <div className="flex flex-row-reverse">
          <Link href={`/student/quizzes/${id}/${idResult}`}>
            <a>
              <button className={`text-blue-1 flex bg-white inline-block border  mt-4 border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >Back to Quiz</button>
            </a>
          </Link>
        </div>
      </Card>
    </>
  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
Index.layout = LayoutTestResult