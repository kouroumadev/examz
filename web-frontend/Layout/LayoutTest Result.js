import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// components
import AdminNavbar from "../components/Navbar/AdminNavbar";
import privateRoute from '../redux/privateRoute'

function LayoutTestResult(props) {
  return (
    <>
      <div className="wrapper bg-black-8 min-h-screen">
        <div className="flex">
          <AdminNavbar user={props.auth.isAuthenticated ? props.auth.user.user.name : ''} avatar={props.auth.isAuthenticated && props.auth.user.user.avatar} />
        </div>
        <div className="flex">
          <div className="w-full md:p-4 pb-16 md:pt-8 grow">
            {props.children}
            {/* <FooterAdmin /> */}
          </div>
        </div>
      </div>
    </>
  )
}

const withAuth = privateRoute(LayoutTestResult)

withAuth.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps)(withAuth);
