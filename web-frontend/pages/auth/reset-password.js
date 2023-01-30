import { useRouter } from 'next/router'
import { useEffect } from 'react'
import apiAuth from '../api/auth'
import { useState } from 'react'

function ResetPassword() {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [password_confirmation, setPasswordConfirmation] = useState()
  const router = useRouter()
  const token = router.asPath.replace('/auth/reset-password?token=', '')

  const onReset = async () =>{
    const data = {email, password, password_confirmation, token}
    await apiAuth.resetPassword(data)
      .then(() => {
        window.location.href = '/auth/reset-password-success'
      })
  }
  return (
    <div className="flex justify-center">
      <div className="my-40 bg-black-6 m-auto self-center flex flex-col md:w-1/2  rounded-lg m-4 p-4 md:m-24">
        <h1 className="text-xl text-center">Reset Password</h1>
        <p className="mt-4">Email</p>
        <input type="text" className="p-4 border rounded-xl " placeholder="Input Your Email" onChange={(data) => setEmail(data.target.value)} />
        <p className="mt-4">Password</p>
        <input type="password" placeholder="Input Password" className="p-4 border rounded-xl" onChange={(data) => setPassword(data.target.value)} />
        <p className="mt-4">Password Confirmation</p>
        <input type="password" placeholder="Input Password" className="p-4 border rounded-xl" onChange={(data) => setPasswordConfirmation(data.target.value)} />
        <button className="bg-yellow-1 text-white p-2 mt-4 rounded-xl" onClick={() => onReset()}>Submit</button>
      </div>
    </div>
  )
}

export default ResetPassword