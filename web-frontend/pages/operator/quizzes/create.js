import CreateQuiz from "../../../components/Quizzes/create";
import Layout from "../../../Layout/Layout";

export default function Create() {
  return <CreateQuiz role="operator" />
}


export async function getServerSideProps(context) {
  return { props: {} }
}

Create.layout = Layout