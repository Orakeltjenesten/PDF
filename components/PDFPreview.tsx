import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf'
import { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles, withStyles, WithStyles } from "@material-ui/styles";
import { FileContext, assemblePDF } from "../hooks/FileContext";
import { UploadedFile } from "../hooks/UploadedFile";
import useTranslation from 'next-translate/useTranslation';
import Paper from "./Paper";
import { VariableSizeList as List } from 'react-window';
import { setLineWidth } from "pdf-lib";

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      root : {
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100%',
      },
      controls : {
        position: 'absolute',
        justifyContent: 'center',
        bottom: theme.spacing(1),
        padding: theme.spacing(1,2),
        backgroundColor: 'white',
        color: 'black',
      },
      documentView : {
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      pdfPage : {
        margin: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '3px',
      },
}));



const PreviewControls = (props: {page: number}) => {
  const classes = useStyles({});
    return (
      <Paper className={classes.controls} noPadding>
        {props.page+1}
      </Paper>
    )
}



interface PDFPreviewProps {
  files: UploadedFile[] | undefined,
  currentPage: number | undefined
}

const PDFPreview = (props: PDFPreviewProps) => {
  // loads something necessary to render pdf
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`; 

  const [mergedPDF, setMergedPDF] = useState<UploadedFile | undefined>(undefined);
  const [numberPages, setNumberPages] = useState(0);
  const [pageSizes, setPageSizes] = useState(new Array<number>());
  const [width, setWidth] = useState(0);
  const classes = useStyles({});
  const { t } = useTranslation("common");
  let outerBox = React.createRef<HTMLDivElement>();

  async function makePreview() {
    let file : UploadedFile = (await assemblePDF(props.files!))!
    let newPageSizes : number[] = [];
    for (let i=0; i < file.getPageCount(); i++) {
      newPageSizes.push( (file.getPage(i).getHeight()) / file.getPage(i).getWidth() );
    }
    console.log(newPageSizes);
    setPageSizes(newPageSizes);
    setMergedPDF(file);
    setNumberPages(file.getPageCount());
  }

  useEffect(() => { // re-renders the preview when the order of files update
    if (props.files != null) {
      makePreview();   
    }
  }, [props.files])

  useEffect(() => { // changes the focused page; snaps to the file that is clicked on
    if (props.currentPage != null) {
      if (outerBox.current != null) {
        let outer: HTMLDivElement = outerBox.current;
        let doc: HTMLDivElement = (outer.firstChild as HTMLDivElement);
        doc!.children.item(props.currentPage)?.scrollIntoView();
      }
    }
  }, [props.currentPage])

  useEffect(() => {
    if (outerBox.current != null) {
    setWidth(outerBox.current.offsetWidth);
    }
  }, [outerBox])

  
  return (
        <div className={classes.root} id="pdfOuter" ref={outerBox}>
          <Document className={classes.documentView} loading={t("loading")} file={mergedPDF != null ? mergedPDF.file : null} noData="">
          <List height={window.innerHeight * 0.8} width={width} itemSize={(i) => {return (width-32)*pageSizes[i]+8}} itemCount={numberPages}>
              { ({style, index}) => (
                <div style={style}>
                <Page className={classes.pdfPage} pageNumber={index+1} key={index} width={width-32}> 
                <PreviewControls page={index} />
                </Page>
                </div>
            )}
            </List>
          </Document>
        </div>
  )
}

  export default PDFPreview;