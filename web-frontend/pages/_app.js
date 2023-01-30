import React from "react";
import '../styles/globals.css'
import '../styles/Landing.css'
import '../styles/Calendar.css'
import { Provider } from "react-redux";
import { store } from "./../redux/store";
import { ChakraProvider } from '@chakra-ui/react'
import 'react-quill/dist/quill.snow.css'
import 'quill/dist/quill.snow.css';
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker.css";

import "katex/dist/katex.min.css";
import "mathquill/build/mathquill.css";
import "mathquill4quill/mathquill4quill.css";
import "react-quill/dist/quill.snow.css";

function MyApp({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <Provider store={store}>
      <ChakraProvider>
        <React.Fragment>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </React.Fragment>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
