import { useEffect } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, registerUser } from '../action/auth/authAction'
import role from './../redux/role'

function Index(props) {
  useEffect(() => {
    if (!props.auth.isAuthenticated) {
      window.location.href = '/landing'
    } else {
      if (props.auth.user.user.roles[0].name === role.admin)
        window.location.href = '/admin/dashboard'
      else if (props.auth.user.user.roles[0].name === role.instituteAdmin)
        window.location.href = '/institute/home'
      else if (props.auth.user.user.roles[0].name === role.operator)
        window.location.href = '/operator/exams'
      else if (props.auth.user.user.roles[0].name === role.staff)
        window.location.href = '/staff/home'
      else if (props.auth.user.user.roles[0].name === role.student)
        window.location.href = '/student/home'
    }
  }, [])
  return (
    <div className='text-center mt-12'>
      Loading...
    </div>
  )
}

Index.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser, registerUser })(Index);