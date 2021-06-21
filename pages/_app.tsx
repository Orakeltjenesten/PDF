import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeMaker } from '../hooks/ThemeContext';

import {getTheme} from '../containers/theme';
import Topbar from '../components/Topbar';
import { CssBaseline } from '@material-ui/core';


export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <ThemeMaker>
        <CssBaseline />
        <Topbar variant='dynamic'/>

        <Component {...pageProps} />
     
      </ThemeMaker>

    </>
  );
}
