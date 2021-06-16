import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeMaker } from '../hooks/ThemeContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import {getTheme} from '../containers/theme';
import Topbar from '../components/Topbar';


export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeMaker>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Topbar variant='dynamic'/>
        <Component {...pageProps} />
      </ThemeMaker>

    </>
  );
}
