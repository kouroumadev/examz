import Layout from "../../../Layout/Layout";
import { useEffect, useState } from 'react'
import { Select } from '@chakra-ui/react'
import { useRouter } from "next/router";
import apiStudent from "../../../action/student";
import Card from "../../../components/Cards/Card";
import { BackButton } from "../../../components/Button/button";
import dynamic from 'next/dynamic';
import Image from "next/image";
import instance from "../../../action/instance";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Section({ data }) {
  const Router = useRouter()
  const { id } = Router.query
  const [viewGraph, setViewGraph] = useState(false)
  const [avatar, setAvatar] = useState('/asset/img/blank_profile.png')
  const [dataStudent, setDataStudent] = useState({
    enrollments: [{
      branch: {}
    }]
  })
  const [dataChart, setDataChart] = useState({})

  useEffect(() => {
    const getDataGraph = async () => {
      await apiStudent.graph()
        .then((res) => {
          if (res.data.data.length > 0) {
            setViewGraph(true)
          }
          const date = []
          const score = []
          res.data.data.map((item) => {
            date.push(item.created_at)
            score.push(item.score)
          })
          const data = {
            options: {
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: date
              }
            },
            series: [
              {
                name: "series-1",
                data: score
              }
            ]
          }
          setDataChart(data)
        })
    }
    getDataGraph()
  }, [])

  const getDetail = async () => {
    await apiStudent.detail(id)
      .then((result) => {
        setDataStudent(result.data.data)
        if (result.data.data.avatar !== null) {
          setAvatar(instance.pathImg + result.data.data.avatar)
        }
      })

  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <div className="mt-12">
      <div className="text-sm">
        <BackButton url="/staff/student" />
      </div>
      <Card>
        <div className="flex gap-4">
          <div className="flex">
            <div className=" relative">
              <Image loader={() => avatar} className="rounded-full w-12 h-12 object-cover" src={avatar} alt="photo profile" height={40} width={40} />
            </div>
          </div>
          <div className="flex md:gap-12 gap-4">
            <div className="my-auto">
              <p className="font-bold">{dataStudent.name}</p>
              <p>{dataStudent.email}</p>
            </div>
            <div className="my-auto">
              <p className="font-bold">Phone</p>
              <p>{dataStudent.phone}</p>
            </div>
            <div className="my-auto md:flex-row bg-red-900 hidden">
              <p className="font-bold">Branch</p>
              <p>{dataStudent.enrollments[0].branch?.name}</p>
            </div>
          </div>
        </div>

        {viewGraph && (
          <>
            <p className="my-4 font-bold text-xl">Graph Performance</p>
            <div className="flex gap-4 md:w-1/2 h-full  ">
              <Select placeholder='All Test' className="h-full" size="md">
                <option value='live'>Test 1</option>
                <option value='mixed'>Test 2</option>
              </Select>
              <Select placeholder='All Date' className="h-full" size="md" >
              </Select>
            </div>
            <Chart
              options={dataChart?.options}
              series={dataChart?.series}
              type="bar"
              height={360}
            />
          </>
        )
        }
      </Card>
    </div>
  )
}


// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}

Section.layout = Layout