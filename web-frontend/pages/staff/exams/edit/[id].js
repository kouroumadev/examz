import EditExam from "../../../../components/ViewExam/EditExam";
import Layout from "../../../../Layout/Layout";
import { useRouter } from "next/router";

export default function Edit() {
  const Router = useRouter()
  const { id } = Router.query
  return <EditExam role="staff" id={id} />
}


// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}

Edit.layout = Layout