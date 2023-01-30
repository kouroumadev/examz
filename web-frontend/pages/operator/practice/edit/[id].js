import Layout from "../../../../Layout/Layout";
import { useRouter } from "next/router";
import EditPractice from "../../../../components/Practice/edit";

export default function Edit() {
  const Router = useRouter()
  const { id } = Router.query
  return <EditPractice role="operator" id={id} />
}


// This also gets called at build time
export async function getServerSideProps(context) {
  return { props: {} }
}

Edit.layout = Layout