import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { ThemeMaker } from '../hooks/ThemeContext';

import {getTheme} from '../containers/theme';
import Topbar from '../components/Topbar';
import { CssBaseline } from '@material-ui/core';
import { FileContextWrapper } from '../hooks/FileContext';
import '/language/i18n'
export default function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <>
      <ThemeMaker>
        <CssBaseline />

        <Topbar variant='dynamic'/>
        <FileContextWrapper>
          <Component {...pageProps} />
        </FileContextWrapper>
      </ThemeMaker>

    </>
  );
}
