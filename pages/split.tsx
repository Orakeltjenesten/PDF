import Head from 'next/head';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import { FileContext, useFileContext } from '../hooks/FileContext';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import useTranslation from 'next-translate/useTranslation';
import { Box, Container, Grid, Typography, useTheme } from '@material-ui/core';
import SplitGrid from '../components/SplitGrid';
import MuiContainer from '@material-ui/core/Container';
import { UploadedFile } from '../hooks/UploadedFile';
import { PDFDocument, PDFPage } from 'pdf-lib';
import MasonryGrid from '../components/MasonaryGrid';
import PageCard from '../components/PageCard';
import { fileSave } from 'browser-fs-access';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      container: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
      },
      dragging: {
          backgroundColor: 'grey',
      }
    })
  );


export default function Home() {
    const { t } = useTranslation("common");
    const classes = useStyles();
    const fileContext = useFileContext();
    const [pages, setPages] = useState<UploadedFile[]>([]);
    const theme = useTheme();

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

    const reorderFiles = (source: number, target?: number) => {
        if(target){
            if(source >= 0 && source < pages.length && target >= 0 && target < pages.length){
                let newFiles = Array.from(pages); // Copy the array, as arrays should not be changed directly
                let [deleted] = newFiles.splice(source, 1);
                newFiles.splice(target, 0, deleted);
                setPages(newFiles);
              }
        }
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
            <Box className={classes.container} display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center">
                <DragDropContext onDragEnd={(result: DropResult) => {reorderFiles(result.source.index, result.destination?.index)}}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {pages.map((page, index) => (
                                <Draggable draggableId={page.name} index={index} key={page.name} >
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} className={classnames(snapshot.isDragging && classes.dragging)}>
                                            <PageCard file={page} pageNumber={1} gutterBottom />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                        )
                        }
                    </Droppable>
                </DragDropContext>
            </Box>
            <footer>
                {t("with_love")}
            </footer>
            
        </>
    )
}
