import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

import { FileContext, useFileContext } from '../hooks/FileContext';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import useTranslation from 'next-translate/useTranslation';
import { Container, Grid } from '@material-ui/core';
import SplitGrid from '../components/SplitGrid';
import MuiContainer from '@material-ui/core/Container';
import { UploadedFile } from '../hooks/UploadedFile';
import { PDFDocument, PDFPage } from 'pdf-lib';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      container: {
        [theme.breakpoints.down('xl')]: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        },
        maxHeight: '80vh'
      }
    })
  );


export default function Home() {
    const { t } = useTranslation("common");
    const classes = useStyles();
    const fileContext = useFileContext();
    const [pages, setPages] = useState<UploadedFile[]>([]);

    async function appendSplittedPages(files: UploadedFile[]) {
        let newPages: UploadedFile[] = [];
        for (let i=0; i < files.length; i++) {
            newPages = newPages.concat(await splitToPages(files[i]));
        }
        setPages( pages.concat(newPages));
    }

    async function splitToPages(uploadedFile: UploadedFile) {
        let document: PDFDocument = uploadedFile.PDF;
        let file : File = uploadedFile.file;
        let splits : UploadedFile[] = [];
        let pageDoc : PDFDocument;
        let blob : any;
        if (document.getPageCount() == 1) {
            return [uploadedFile]
        }

        for (let i = 0; i < document.getPageCount(); i++) {
            pageDoc = await PDFDocument.create();
            let p : PDFPage[] = await pageDoc.copyPages(document, [i]);
            pageDoc.addPage(p[0]);

            blob = new Blob([await pageDoc.save()]);
            blob.name = "Page " + (i+1).toString() + " of " + file.name;
            splits.push(new UploadedFile(blob, pageDoc));
        }
        return splits;
    }

    useEffect(() => {
        let globalFiles = fileContext.files;
        appendSplittedPages(globalFiles);

    }, [fileContext.files]) // runs when fileContext.files updates


    return (
        <>
            <Head>
                <title>{t("split_title")}</title>
                <meta name={t("meta_name")} content="Split"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>

                <div className={styles.header}>
                    <h1>
                        {t("split")}
                    </h1>
                </div>

                <MuiContainer className={classes.container} maxWidth={false}>
                    <SplitGrid uploadedFiles={pages} />
                </MuiContainer>
        
                <footer className={styles.footer}>
                    {t("with_love")}
                </footer>
            </main>
            
        </>
    )
}
