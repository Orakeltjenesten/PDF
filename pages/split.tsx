import Head from 'next/head';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useFileContext } from '../hooks/FileContext';

// Material UI Components
import { makeStyles, createStyles }  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import useTranslation from 'next-translate/useTranslation';
import { Box, Typography } from '@material-ui/core';
import { UploadedFile } from '../hooks/UploadedFile';
import { PDFDocument, PDFPage } from 'pdf-lib';
import PageCard from '../components/PageCard';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      container: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
      },
      list: {
        display: 'flex',
        width: '100vw',
        overflowX: 'hidden',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        padding: theme.spacing(6, 6, 0, 6),
        '&:hover': {
            overflowX: 'auto',
        }
      },
      dragEntry: {
          width: '300px',
      },
      dragging: {
          backgroundColor: theme.palette.transparent.background,
      },
      wrapper: { 
          overflowX: 'auto',
          whiteSpace: 'nowrap',
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
        setPages(newPages);
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
            <Typography align='center' color='inherit' variant='h2'>
                {t("split")}
            </Typography>
            <DragDropContext onDragEnd={(result: DropResult) => {reorderFiles(result.source.index, result.destination!.index)}}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided) => (
                    <Box id={horizontalScrollId} onWheel={handleWheelEvent} ref={provided.innerRef} {...provided.droppableProps} className={classes.list}>
                        {pages.map((page, index) => (
                            <Draggable draggableId={page.name} index={index} key={page.name} >
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} className={classnames(classes.dragEntry, snapshot.isDragging && classes.dragging)}>
                                        <PageCard file={page} pageNumber={1} last={index === pages.length-1}/>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                    )
                    }
                </Droppable>
            </DragDropContext>
            <footer>
                {t("with_love")}
            </footer>
            
        </>
    )
}
