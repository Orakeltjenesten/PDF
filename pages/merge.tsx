import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import { FileContext } from "../hooks/FileContext";

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import MuiContainer from '@material-ui/core/Container';
import { PDFListDisplay } from '../components/PDFListDisplay';
import { SavePDFButton } from '../components/SavePDFButton';
import PDFPreview from '../components/PDFPreview';
import { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';




const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      container: {
        [theme.breakpoints.down('xl')]: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        },
        display: 'flex',
        flexDirection: 'column',
        ['@media (min-width:1000px)']: { // eslint-disable-line no-useless-computed-key
          flexDirection: 'row'
        },
        justifyContent: 'space-evenly',
        maxHeight: '80vh'
      },
      listView: {
        borderRight: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1',
        maxHeight: '80vh',
        padding: 0,
        ['@media (max-width:1000px)']: { // eslint-disable-line no-useless-computed-key
          height: '40vh'
        },
      },
      pdfPreview: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1',
          height: '80vh',
          margin: '5px',
          padding: 0
      },
    })
  );

export default function Home() {

  const { t} = useTranslation("common");
  const classes = useStyles();
  const [togglePreview, setTogglePreview] = useState<boolean>(true);
  return (
    <>
      <Head>
        <title>{t("merge_title")}</title>
        <meta name={t("meta_name")} content={t("meta_description")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.header}>
          <h1>
            {t("merge")}
          </h1>
        </div>

        <FileContext.Consumer>
          {(fileStore) => (
            
            <MuiContainer className={classes.container} maxWidth={false}>
              
                <Grid container wrap="nowrap" direction="column" spacing={1} className={classes.listView}>
                  {fileStore!.files!.length > 0 ? <>
                    <Grid item style={{overflowY: 'auto'}}><PDFListDisplay/></Grid>
                    <Grid item> <SavePDFButton text={t("merge")} /></Grid>
                    <Grid item><Button variant="contained" onClick={(e) => {e.preventDefault(); setTogglePreview(!togglePreview)}}>{t("toggle_preview")}</Button></Grid>
                  </> : <h2>{t("upload_some_files")}</h2>}
                </Grid>
                <MuiContainer className={classes.pdfPreview}>
                  {togglePreview && <PDFPreview currentPage={fileStore?.focusedPage} files={fileStore?.files}/>}
                </MuiContainer>
              </MuiContainer>
          )
          }
        </FileContext.Consumer>

      
      
        <footer className={styles.footer}>
            {t("with_love")}
        </footer>
      </main>
    </>
  )
}
