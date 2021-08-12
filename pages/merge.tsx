import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import { FileContext, useFileContext } from "../hooks/FileContext";

// Material UI Components
import { makeStyles, createStyles } from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import MuiContainer from '@material-ui/core/Container';
import { PDFListDisplay } from '../components/PDFListDisplay';
import { SavePDFButton } from '../components/SavePDFButton';
import PDFPreview from '../components/PDFPreview';
import { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import { PageTitle } from '../components/PageTitle';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      display: 'grid',
      gap: theme.spacing(2),
      gridTemplateColumns: '1fr 1fr',
      [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr',
      },
    },
    listView: {
      borderRight: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
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
        {fileContext.files.length > 0 ? <>
          <Grid container wrap="nowrap" direction="column" spacing={1} className={classes.listView}>
            <Grid item style={{ overflowY: 'auto' }}><PDFListDisplay /></Grid>
            <Grid item> <SavePDFButton text={t("merge")} /></Grid>
            <Grid item><Button variant="contained" onClick={(e) => { e.preventDefault(); setTogglePreview(!togglePreview) }}>{t("toggle_preview")}</Button></Grid>
          </Grid>
          <MuiContainer className={classes.pdfPreview}>
            {togglePreview && <PDFPreview currentPage={fileContext.focusedPage} files={fileContext.files} />}
          </MuiContainer>
        </> : <h2>{t("upload_some_files")}</h2>}
      </main>
    </>
  )
}
