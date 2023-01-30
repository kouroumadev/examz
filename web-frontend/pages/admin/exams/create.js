import CreateExam from "../../../components/ViewExam/CreateExam";
import Layout from "../../../Layout/Layout";

export default function Create() {
  return <CreateExam role="admin" />
}


export async function getServerSideProps(context) {
  return { props: {} }
}

Create.layout = Layout