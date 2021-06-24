import Head from 'next/head';
import React, { useState } from 'react';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { FileContext } from '../hooks/FileContext';
import MuiContainer from '@material-ui/core/Container';
import { PDFsDisplay } from '../components/PDFsDisplay';
import { SavePDFButton } from '../components/SavePDFButton';
import PDFPreview from '../components/PDFPreview';


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
          flex: '1'
      },
    }
));


export default function Home() {
    const classes = useStyles();

    const [mergedFile, setUploadedFiles] = useState<File[]>([]);

    return (
        <>
            <Head>
                <title>PDF Application - Merge</title>
                <meta name="PDF Application" content="Merge"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <div className={styles.header}>
                    <h1>MERGE</h1>
                </div>


                <FileContext.Consumer>
                    {(fileStore) => (
                    <MuiContainer className={classes.container} maxWidth={false}>
                        <div className={classes.listView}>
                            <PDFsDisplay />
                            <SavePDFButton text="Merge" files={fileStore?.files}/>
                        </div>
                        <div className={classes.pdfPreview}>
                            <PDFPreview files={fileStore?.files}/>
                        </div>
                    </MuiContainer>
                    )
                }
        </FileContext.Consumer>

            </main>
        </>
    )
}
