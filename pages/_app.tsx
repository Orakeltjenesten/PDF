import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react';
import { ThemeMaker } from '../hooks/ThemeContext';

import Topbar from '../components/Topbar';
import { CssBaseline } from '@material-ui/core';
import { FileContextWrapper } from '../hooks/FileContext';
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  return (
    <>
      <ThemeMaker>
        <FileContextWrapper>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </FileContextWrapper>
      </ThemeMaker>

    </>
  );
}

export default MyApp;
