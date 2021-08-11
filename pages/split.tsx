import Head from 'next/head';
import classnames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import { assemblePDF, FileContext, useFileContext } from '../hooks/FileContext';
import styles from '../styles/Home.module.css'

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import useTranslation from 'next-translate/useTranslation';
import { Box, Button, Container, Grid, Typography, useTheme } from '@material-ui/core';
import MuiContainer from '@material-ui/core/Container';
import { UploadedFile } from '../hooks/UploadedFile';
import { PDFDocument, PDFPage } from 'pdf-lib';
import PageCard from '../components/PageCard';
import { fileSave } from 'browser-fs-access';
import { useHorizontalScroll } from '../hooks/HorizontalScroll';
import { LegendToggleTwoTone } from '@material-ui/icons';
import { useAlert } from '../hooks/AlertContext';


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
      list: {
        display: 'flex',
        width: '100vw',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        padding: theme.spacing(6, 6, 0, 6),
      },
      dragging: {
          //backgroundColor: theme.palette.transparent.background,
          background: 'none'
      },
      splitPanel: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
      }
    })
  );


export default function Home() {
    const { t } = useTranslation("common");
    const classes = useStyles();
    const fileContext = useFileContext();
    const [pages, setPages] = useState<UploadedFile[]>([]);
    const [splitIndexes, setSplitIndexes] = useState<number[]>([0]);
    const theme = useTheme();
    const scrollRef = useHorizontalScroll();
    const {showPopup} = useAlert();

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
            <main className={styles.main}>
                <MuiContainer>
                    <Typography align='center' color='inherit' variant='h2'>
                        {t("split")}
                    </Typography>
                </MuiContainer>

                <div className={classes.splitPanel}>
                    <DragDropContext onDragEnd={(result: DropResult) => {reorderFiles(result.source.index, result.destination!.index)}}>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided) => (
                            <div ref={scrollRef}>
                                <Box component="div" alignItems="center" id="horizontalScroll" ref={provided.innerRef} {...provided.droppableProps} className={classes.list}>
                                    {pages.map((page, index) => (
                                        <Draggable draggableId={page.uuid} index={index} key={page.uuid} >
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} className={classnames(snapshot.isDragging && classes.dragging)}>
                                                    <PageCard index={index} setSplitAt={setSplitAt} file={page} pageNumber={1} last={snapshot.isDragging || index === pages.length-1} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            </div>
                            )
                            }
                        </Droppable>
                    </DragDropContext>
                    <Button onClick={downloadSplits}>{t("download_splits")}</Button>
                    
                </div>
                <footer className={styles.footer}>
                    {t("with_love")}
                </footer>
            </main>
            
        </>
    )
}
