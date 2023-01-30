import { useRouter } from 'next/router'
import { useEffect } from 'react'
import apiAuth from '../../api/auth'
import { loginFacebook } from '../../../action/auth/authAction'
import { connect, useDispatch } from "react-redux";

function Facebook(props) {
  const router = useRouter()
  const path = router.asPath.replace('/auth/login/facebook', '')
  useEffect(async () => {
    props.loginFacebook(path)
  }, [])

  return (
    <div className="text-center mt-12">
      Loading ...
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: '',
});

export default connect(mapStateToProps, {loginFacebook})(Facebook);
