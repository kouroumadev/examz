import CreatePractice from "../../../components/Practice/create";
import Layout from "../../../Layout/Layout";

export default function Create() {
  return <CreatePractice role="operator"/>
}


export async function getServerSideProps(context) {
  return { props: {} }
}

Create.layout = Layout