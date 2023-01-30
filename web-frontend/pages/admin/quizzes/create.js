import CreateQuiz from "../../../components/Quizzes/create";
import Layout from "../../../Layout/Layout";

export default function Create() {
  return <CreateQuiz role="admin" />
}


export async function getServerSideProps(context) {
  return { props: {} }
}

Create.layout = Layout