import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import { FileContext, FileContextWrapper } from "../hooks/FileContext";

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import MuiContainer from '@material-ui/core/Container';
import UploadButton from '../components/UploadButton';
import { PDFsDisplay } from '../components/PDFsDisplay';
import { SavePDFButton } from '../components/SavePDFButton';
import PDFPreview from '../components/PDFPreview';
import { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';




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
        padding: 0
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
  const classes = useStyles();
  const [togglePreview, setTogglePreview] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>PDF TOOL</title>
        <meta name="PDF Merger" content="Merging PDF" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.header}>
          <h1>
            ORGANIZE
          </h1>
        </div>
        <FileContext.Consumer>
          {(fileStore) => (
            
            <MuiContainer className={classes.container} maxWidth={false}>
              
                <Grid container wrap="nowrap" direction="column" spacing={1} className={classes.listView}>
                  <Grid item style={{overflowY: 'auto'}}><PDFsDisplay/></Grid>
                  <Grid item>{fileStore!.files!.length > 0 ? <SavePDFButton text="Merge" files={fileStore?.files}/> : <h2>Upload some files to get started!</h2>}</Grid>
                  <Grid item><Button variant="contained" onClick={(e) => {e.preventDefault(); setTogglePreview(!togglePreview)}}>Toggle preview</Button></Grid>
                </Grid>
                <MuiContainer className={classes.pdfPreview}>
                  {togglePreview && <PDFPreview files={fileStore?.files}/>}
                </MuiContainer>
              </MuiContainer>
          )
          }
        </FileContext.Consumer>

      
      
        <footer className={styles.footer}>
            Laget med kjærlighet i Trondheim
        </footer>
      </main>
    </>
  )
}
