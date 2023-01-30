import Link from 'next/link'

function ResetPasswordSuccess() {

  return (
    <div className="flex flex-col items-center text-center justify-center align-middle p-12">
      <h1>Reset Password Success</h1>
      <Link href='/'>
        <a className="text-blue-1">Click to Login</a>
      </Link>
    </div>
  )
}

export default ResetPasswordSuccess