import Layout from "../../../../Layout/Layout";
import { useState, useEffect } from "react";
import apiQuiz from "../../../../action/quiz";
import { useRouter } from "next/router";
import Card from "../../../../components/Cards/Card";
import Button from "../../../../components/Button/button";
import Link from "next/link";

export default function View() {
  const Router = useRouter()
  const { id } = Router.query
  const [dataExams, setDataExams] = useState({
    questions: [{
      options: []
    }]
  })
  const getDetail = async () => {
    await apiQuiz.detailsectionQuestion(id)
      .then((result) => {
        setDataExams(result.data.data)
        console.log(result.data.data)
      })
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <div className="mt-12">
      <Card title={dataExams.name} >
        {dataExams.questions.map((item, index) => {
          const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
          return (
            <div key={index}>
              <div className={`flex ${item.type === 'paragraph' && 'ml-4'}`}>
                {item.type === 'paragraph' ? index + 1 : index + 1}.
                <div className="text-container" dangerouslySetInnerHTML={{ __html: item.question }} />
              </div>
              {item.options.map((itemOptions, indexOption) => (
                <div key={indexOption} className='ml-3'>
                  <span className="m-auto">{alphabet[indexOption]}. </span>
                  {itemOptions.title}
                </div>
              ))}
              <p className={`ml-3 text-blue-1 font-bold `}>Answer :

                {item.options.map((itemOptions, indexOption) => {
                  return (
                    <span key={indexOption}> {itemOptions.correct === 1 && alphabet[indexOption]}</span>
                  )
                })}
              </p>
            </div>
          )
        })}
        <div className="flex flex-row-reverse ">
          <Link href="/admin/quizzes">
            <a>
              <Button title={`Back to List Quizzes`} />
            </a>
          </Link>
        </div>
      </Card>
    </div>
  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
View.layout = Layout