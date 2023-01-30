import LayoutTest from "../../../../../Layout/LayoutTest"
import apiStudentPage from "../../../../../action/student_page"
import { useState, useEffect } from "react";
import Card from '../../../../../components/Cards/Card'
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import LayoutTestResult from "../../../../../Layout/LayoutTest Result";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Index() {
  const Router = useRouter()
  const { id } = Router.query
  const { idResult } = Router.query
  const [dataChart, setDataChart] = useState([])
  const [data, setData] = useState()
  useEffect(async () => {
    const getData = async () => {
      await apiStudentPage.showPracticeResultAnalysis(id, idResult)
        .then((res) => {
          console.log(res.data.data)
          setData(res.data.data)
          const level = []
          const score = []
          const percentage = []
          res.data.data.sections.map((item) => {
            level.push(item.created_at)
            score.push(item?.details?.easy)
            score.push(item?.details?.medium)
            score.push(item?.details?.hard)
            percentage.push(item?.percentage?.easy)
            percentage.push(item?.percentage?.medium)
            percentage.push(item?.percentage?.hard)
          })
          const temp = res.data.data.sections
          temp.map((item) => {
            item.bar = {
              options: {
                chart: {
                  id: "basic-bar"
                },
                xaxis: {
                  categories: ['Easy', 'Medium', 'Hard']
                }
              },
              series: [{
                name: "series-1",
                data: [item.details.easy, item.details.medium, item.details.hard]
              }]
            }
            item.pie = {

              series: [item.percentage.easy, item.percentage.medium, item.percentage.hard],
              options: {
                chart: {
                  width: 380,
                  type: 'pie',
                },
                legend: {
                  position: 'bottom'
                },
                labels: ['Easy', 'Medium', 'Hard'],
                responsive: [{
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                }]
              },
            };
          })
          setDataChart([...temp])
        })
    }
    getData()
  }, [])

  return (
    <>
      <Card className="w-full mt-12">
        <div className="bg-black-9 text-center p-2 rounded font-bold">
          Test Result
          <div className="font-bold text-blue-1 text-2xl">{data?.score}/{data?.practice?.total_score}</div>
        </div>
        {dataChart.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row">
            <div className="text-center mx-auto ">
              <Chart
                options={item.pie.options}
                series={item.pie.series}
                type="pie"
                width={250}
                height={250}

              />
              {item.name}
            </div>
            <div className="w-full">
              <Chart
                options={item.bar.options}
                series={item.bar.series}
                type="bar"
                height={250}

              />
            </div>
          </div>
        ))}
        <div className="flex flex-row-reverse">
          <Link href={`/student/practice/${id}/${idResult}`}>
            <a>
              <button className={`text-blue-1 flex bg-white inline-block border  mt-4 border-blue-1 py-2 px-4 font-semibold text-sm rounded hover:bg-blue-6 hover:filter hover:drop-shadow-xl`} >Back to Practice Result</button>
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