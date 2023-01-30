import Layout from "../../../../Layout/Layout";
import { useState, useEffect } from "react";
import apiExam from "../../../../action/exam";
import { useRouter } from "next/router";
import SectionQuestion from "../../../../components/ViewExam/SectionQuestion";

export default function View() {
  const Router = useRouter()
  const { id } = Router.query
  const [dataExams, setDataExams] = useState({
    sections: [{
      questions: [{
        items: [{
          options: []
        }]
      }]
    }]
  })
  const [activeSection, setActiveSection] = useState()
  const [indexActiveSection, setIndexActiveSection] = useState(0)
  const getDetail = async () => {
    await apiExam.detailsectionQuestion(id)
      .then((result) => {
        setDataExams(result.data.data)
        setActiveSection(result.data.data.sections[0].name)
      })
  }


  useEffect(() => {
    getDetail()
  }, [])

  return (
    <div className="mt-12">
      <SectionQuestion dataExams={dataExams} indexActiveSection={indexActiveSection} urlBack="/operator/exams" type="Exams" setActiveSection={(data) => setActiveSection(data)} setIndexActiveSection={(data) => setIndexActiveSection(data)} activeSection={activeSection} />
    </div>
  )
}

// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}
View.layout = Layout