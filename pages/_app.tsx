import type { AppProps } from 'next/app'
import React, { useEffect } from 'react';

//Material UI components
import { CssBaseline } from '@material-ui/core';

//Project Components
import { ThemeMaker } from '../hooks/ThemeContext';
import { FileContextWrapper } from '../hooks/FileContext';
import Layout from '../components/globals/Layout';
import { AlertContextWrapper } from '../hooks/AlertContext';
import { PopupNotification } from '../components/PopupNotification';

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
        <AlertContextWrapper>
          <FileContextWrapper>
            <PopupNotification />
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </FileContextWrapper>
        </AlertContextWrapper>
        
      </ThemeMaker>

    </>
  );
}
