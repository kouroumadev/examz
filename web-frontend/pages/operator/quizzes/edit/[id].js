import Layout from "../../../../Layout/Layout";
import { useRouter } from "next/router";
import EditQuiz from "../../../../components/Quizzes/edit";

export default function Edit() {
  const Router = useRouter()
  const { id } = Router.query
  return <EditQuiz role="operator" id={id} />
}


// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}

Edit.layout = Layout