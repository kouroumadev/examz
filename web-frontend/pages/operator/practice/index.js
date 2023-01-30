import IndexPractice from "../../../components/Practice";
import Layout from "../../../Layout/Layout";

export default function Create() {
  return <IndexPractice/>
}


export async function getServerSideProps(context) {
  return { props: {} }
}

Create.layout = Layout