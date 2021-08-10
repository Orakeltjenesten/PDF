import Head from 'next/head';
import classnames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import { FileContext, useFileContext } from '../hooks/FileContext';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import useTranslation from 'next-translate/useTranslation';
import SplitGrid from '../components/SplitGrid';
import MuiContainer from '@material-ui/core/Container';
import { UploadedFile } from '../hooks/UploadedFile';
import { PDFDocument, PDFPage } from 'pdf-lib';
import MasonryGrid from '../components/MasonaryGrid';
import PageCard from '../components/PageCard';
import { fileSave } from 'browser-fs-access';
import { useHorizontalScroll } from '../hooks/HorizontalScroll';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      container: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
      },
      list: {
        display: 'flex',
        width: '100vw',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        padding: theme.spacing(6, 6, 0, 6),
      },
      dragEntry: {
          width: '300px',
      },
      dragging: {
          backgroundColor: theme.palette.transparent.background,
      }
    })
  );


export default function Home() {
    const { t } = useTranslation("common");
    const classes = useStyles();
    const fileContext = useFileContext();
    const [pages, setPages] = useState<UploadedFile[]>([]);
    const theme = useTheme();
    const scrollRef = useHorizontalScroll();

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
                    <div ref={scrollRef}>
                        <Box component="div" id="horizontalScroll" ref={provided.innerRef} {...provided.droppableProps} className={classes.list}>
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
                    </div>
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
