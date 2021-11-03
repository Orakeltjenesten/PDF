import Head from 'next/head'
import React, { useState } from 'react'
import useTranslation from 'next-translate/useTranslation';

// Material UI Components
import { makeStyles, createStyles } from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import MuiContainer from '@material-ui/core/Container';
import { Button, Grid, Typography } from '@material-ui/core';

//Project components
import { PageTitle } from '../components/PageTitle';
import { useFileContext } from "../hooks/FileContext";
import { PDFListDisplay } from '../components/PDFListDisplay';
import { SavePDFButton } from '../components/SavePDFButton';
import PDFPreview from '../components/PDFPreview';
import Link from 'next/link';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      [theme.breakpoints.down('xl')]: {
          paddingRight: theme.spacing(2),
          paddingLeft: theme.spacing(2),
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    listView: {
      borderRight: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    },
    wrapper: {

    },
    pdfPreview: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0
    },
  })
);

export default function Home() {

  const { t } = useTranslation("common");
  const classes = useStyles();
  const [togglePreview, setTogglePreview] = useState<boolean>(true);
  const fileContext = useFileContext();

  return (
    <>
      <Head>
        <title>{t("merge_title")}</title>
        <meta name={t("meta_name")} content={t("merge")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageTitle text="merge" />
      <main className={classes.root}>
        <MuiContainer maxWidth='xl'>
          {fileContext.files.length > 0 ?
          <Grid container className={classes.wrapper}>
            <Grid container item xs={12} lg={6} spacing={1} alignItems='center' justifyContent='center' direction='column'>
              <Grid item xs={12} style={{ overflowY: 'auto', maxHeight: '400px', borderBottom: '5px dashed'}}><PDFListDisplay /></Grid>
              <Grid item> <SavePDFButton text={t("merge")} /></Grid>
              <Grid item><Button variant="contained" onClick={(e) => { e.preventDefault(); setTogglePreview(!togglePreview) }}>{t("toggle_preview")}</Button></Grid>
            </Grid>
            <Grid item xs={12} lg={6} style={{ overflowY: 'auto', maxHeight: '600px', borderBottom: '5px dashed'}}>
              <MuiContainer className={classes.pdfPreview}>
                {togglePreview && <PDFPreview currentPage={fileContext.focusedPage} files={fileContext.files} />}
              </MuiContainer>
            </Grid>
          </Grid>
          : <Link href="upload"><Button>{t("upload_some_files")}</Button></Link>}
        </MuiContainer>
      </main>
    </>
  )
}
