import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiAccount from "../../../../../action/account";

export default function Verify() {
  const Router = useRouter()
  const rt = Router.asPath.split("/")
  const token = rt[4] + "/" + rt[5]
  const [isLoading, setIsLoading] = useState(true)
  useEffect(async () => {
    console.log(token)
    await apiAccount.verify(token)
      .then((res) => {
        if (res.data.status) {
          setIsLoading(false)
        }
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <div>
      <div className="text-center my-24 text-sm">
        {isLoading ? (
          <div> Loading ... </div>
        ) : (
          <>
            <p className="p-2 text-green-1 font-bold">Successfully Verified Email</p>
            <Link href="/landing" >
              <a className="text-white p-2 rounded bg-blue-1 hover:bg-blue-2">Please Login to Continue your Account</a>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}