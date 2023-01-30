import Link from "next/link";
import Footer from "../../components/footer/footer"
import Header from '../../components/Navbar/header';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Card from "../../components/Cards/Card";
import apiLanding from "../../action/landingPage";
import Button from "../../components/Button/button";

function UpcomingExam() {
  const Router = useRouter()
  const { id } = Router.query
  const [activeSection, setActiveSection] = useState()
  const [indexActiveSection, setIndexActiveSection] = useState(0)
  const [data, setData] = useState({
    sections:[{
      questions:[]
    }]
  })
  const [isEmpty, setIsEmpty] = useState()
  useEffect(() => {
    const getPrevious = async () => {
      await apiLanding.showPrev(id)
        .then((res) => {
          console.log(res.data.data)
          setActiveSection(res.data.data.sections[0].name)
          setData(res.data.data)
          if (res.data.data.length === 0) {
            setIsEmpty(true)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    getPrevious()
  }, [])
  return (
    <div className="bg-black-7">
      <Header />
      <div className="px-4 md:px-32 mt-12 md:pt-12">
      <div className="flex  gap-4 bg-white rounded-lg pt-4 px-4 mb-4 ">
        {data.sections.map((item, index) => (
          <div key={index} className={` ${activeSection === item.name ? 'text-blue-1 border-b-2 border-blue-1 font-bold' : 'text-black-5'} cursor-pointer pb-4`} onClick={() => {
            setActiveSection(item.name)
            setIndexActiveSection(index)
          }}>
            {item.name}
          </div>
        ))}
      </div>
      <Card title={data.name} >
        {data.sections[indexActiveSection].questions.map((item, index) => (
          <div key={index}>
            {item.type === 'paragraph' && (
              <>
                <div className="flex">
                  {index + 1}.
                  <div className="text-container" dangerouslySetInnerHTML={{ __html: item?.paragraph }} />
                </div>
                <div className="text-container ml-3" dangerouslySetInnerHTML={{ __html: item?.instruction }} />
              </>
            )}
            {item.items.map((itemQuestion, indexQuestion) => {
              const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
              return (
                <div key={indexQuestion}>
                  <div className={`flex ${item.type === 'paragraph' && 'ml-4'} mt-2 `}>
                    {item.type === 'paragraph' ? indexQuestion + 1 : index + 1}.
                    <div className="text-container " dangerouslySetInnerHTML={{ __html: itemQuestion.question }} />
                  </div>
                </div>
              )
            })}
            <div className="border-b my-4" />
          </div>
        ))}
        <div className="flex flex-row-reverse ">
          <Link href="/prev-paper">
            <a>
              <Button title={`Back to List Prev Paper`} />
            </a>
          </Link>
        </div>
      </Card>
    </div>
    <div className="my-4"/>
      <Footer />
    </div>
  )
}

export default UpcomingExam