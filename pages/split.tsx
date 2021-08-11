import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { assemblePDF, useFileContext } from '../hooks/FileContext';

// Material UI Components
import { makeStyles, createStyles }  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import useTranslation from 'next-translate/useTranslation';
import { Box, Button, Typography } from '@material-ui/core';
import { UploadedFile } from '../hooks/UploadedFile';
import { PDFDocument, PDFPage } from 'pdf-lib';
import { useAlert } from '../hooks/AlertContext';
import { PageCardDroppable } from '../containers/PageCardDroppable';
import { PageTitle } from '../components/PageTitle';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      wrapper: { 
          overflowX: 'auto',
          whiteSpace: 'nowrap',
      },
      splitContent: {
        [theme.breakpoints.down('xl')]: {
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
        },
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'space-between',
        justifyContent: 'center',
      },
      downloadButton: {
          marginTop: theme.spacing(3),
      },
    })
  );


export default function Home() {
    const { t } = useTranslation("common");
    const classes = useStyles();
    const fileContext = useFileContext();
    const [pages, setPages] = useState<UploadedFile[]>([]);
    const {showPopup} = useAlert();
    const [splitIndexes, setSplitIndexes] = useState<number[]>([0]);

    async function appendSplittedPages(files: UploadedFile[]) {
        let newPages: UploadedFile[] = [];
        for (let i=0; i < files.length; i++) {
            newPages = newPages.concat(await splitToPages(files[i]));
        }
        setPages(newPages);
        setSplitIndexes([0, newPages.length]);
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

    function setSplitAt(splitIndex: number, split: boolean) {
        splitIndex += 1;
        let newSplits: number[];
        if (split) {
            newSplits = Array.from(splitIndexes);
            !newSplits.includes(splitIndex) && newSplits.push(splitIndex);
        } else {
            newSplits = Array.from(splitIndexes);
            newSplits = newSplits.filter((num: number) => (num != splitIndex));
        }
        newSplits.sort();
        setSplitIndexes(newSplits);
    }

    async function downloadSplits() {
        let sliceFrom: number;
        let sliceTo: number;
        let downloadableFile: Blob;
        let url: string;
        let name: string;
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none;");
        for (let i=0; i < splitIndexes.length - 1; i++) {
            sliceFrom = splitIndexes[i];
            sliceTo = splitIndexes[i+1];
            if (sliceTo - sliceFrom == 1) {
                downloadableFile = pages[sliceFrom]!.file;
                name = "page " + sliceTo.toString() + ".pdf";
            } else {
                downloadableFile = (await assemblePDF(pages.slice(sliceFrom, sliceTo)))!.file;
                name = "pages " + (sliceFrom+1).toString() + "-" + (sliceTo).toString() + ".pdf";
            }
            url = window.URL.createObjectURL(downloadableFile);
            // Set its download and href attributes accordingly to filename and URL of file
            a.download = name;
            a.href = url!;
            a.click();
        }
        a.remove();
        showPopup(t("split_files_downloaded"), 'success');
    }

    useEffect(() => {
        let globalFiles = fileContext.files;
        appendSplittedPages(globalFiles);

    }, [fileContext.files]) // runs when fileContext.files updates

    const horizontalScrollId = 'horizontalScroll';
    const handleWheelEvent = (e: any) => {
        e.preventDefault()
        var container = document.getElementById(horizontalScrollId)
        if(container){
            var containerScrollPosition = container.scrollLeft;
            container.scrollTo({
                top: 0,
                left: containerScrollPosition + (e.deltaY * 3),
                behavior: 'smooth',
            })
        }
    };

    const reorderFiles = (source: number, target: number) => {
        let newFiles = Array.from(pages); // Copy the array, as arrays should not be changed directly
        let [deleted] = newFiles.splice(source, 1);
        newFiles.splice(target, 0, deleted);
        setPages(newFiles);
    }
    return (
        <>
            <Head>
                <title>{t("split_title")}</title>
                <meta name={t("meta_name")} content="Split"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            
            <Box className={classes.splitContent}>
                <PageTitle text="split" />
                {(fileContext.files.length > 0) ? (<>
                
                <PageCardDroppable reorderFiles={reorderFiles} handleWheelEvent={handleWheelEvent} horizontalScrollId={horizontalScrollId} pages={pages} setSplitAt={setSplitAt}></PageCardDroppable>
                
                <Button onClick={downloadSplits} className={classes.downloadButton}>{t("download_splits")}</Button>
                </>) : <h2>{t("upload_some_files")}</h2>}
            </Box>
            
        </>
    )
}
