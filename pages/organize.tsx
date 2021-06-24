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

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      container: {
        [theme.breakpoints.down('xl')]: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        },
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
      listView: {
        borderRight: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1',
        maxHeight: '80vh'
      },
      pdfPreview: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1',
          height: '80vh'
      },
    }
));

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
              
              <div className={classes.listView}>
                <UploadButton text="+" />
                <PDFsDisplay/>
                <input type="button" className="button" value="Toggle preview" onClick={(e) => {e.preventDefault(); setTogglePreview(!togglePreview)}} />
              </div>
              <div className={classes.pdfPreview}>
                {togglePreview && <PDFPreview files={fileStore?.files}/>}
              </div>
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
