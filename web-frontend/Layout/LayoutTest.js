import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// components
import AdminNavbar from "../components/Navbar/AdminNavbar";
import privateRoute from '../redux/privateRoute'
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";

function LayoutTest(props) {
  const Router = useRouter()
  const [goAway, setGoAway] = useState("");

  const browserTabcloseHandler = e => {
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = "";
  };

  useEffect(() => {
    if (window) {
      Router.beforePopState(({ as }) => {

        // window.onpopstate = () => { 
        history.go(1);
        // };
        // if (componentShouldBeSavedAsDraft(componentData)) {
        // const result = window.confirm("are you sure you want to leave?");
        // console.log(result)
        // if (result) {
        //   window.history.pushState("/", "");
        //   Router.back()
        // } else {
        //   window.history.pushState(Router.asPath, Router.asPath);
        // }
        // return result;
      });

      const isPractice = Router.pathname.indexOf('practice') !== -1
      if(!isPractice){
        window.onbeforeunload = browserTabcloseHandler;
      } 

    }
    // Router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      if (window) {
        window.onbeforeunload = null;
      }
      Router.beforePopState(() => {
        return true;
      });
    };
  }, [goAway]); // this fixed the issue

  useEffect(() => {
    if (Router.asPath === '/exams') {
      window.onpopstate = () => {
        history.go(1);
      };
    }
  }, [Router]);
  return (
    <>
      <div className="wrapper bg-black-8 min-h-screen">
        <div className="hidden md:flex">
          <AdminNavbar user={props.auth.isAuthenticated ? props.auth.user.user.name : ''} avatar={props.auth.isAuthenticated && props.auth.user.user.avatar} isTest={true} />
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

const withAuth = privateRoute(LayoutTest)

withAuth.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps)(withAuth);
