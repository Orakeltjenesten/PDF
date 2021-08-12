import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf'
import { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles, withStyles, WithStyles } from "@material-ui/styles";
import { FileContext, assemblePDF } from "../hooks/FileContext";
import { UploadedFile } from "../hooks/UploadedFile";
import useTranslation from 'next-translate/useTranslation';
import { VariableSizeList } from 'react-window';
import { setLineWidth } from "pdf-lib";

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      controls : {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: '6px',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '4px',
        width: '50px',
        border: '1px solid black',
        background: 'white',
        color: 'black'
      },

      previewText : {
        border: '1px solid black',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '12px',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '4px',
        width: '100%',
        fontSize: '22px',
        backgroundColor: 'white',
        color: 'black',
        maxWidth: '90%'
      },

      hidden : {
        display: 'none'
      },

      pageLoading : {
        position: 'absolute',
        zIndex: -100
      },
      documentView : {
        maxHeight: '80vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
    
      pdfPage : {
        position: 'relative',
        margin: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '3px',
      },
    
      outer : {
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        height: '80vh',
        ['@media (min-width:1000px)']: {
          width: '80%',
          maxWidth: '600px'
        },
        ['@media (max-width:1000px)']: { 
          maxWidth: '100%',
          width: '80%',
          height: '40vh'
        }
      }
}));



const PreviewControls = (props: {page: number}) => {
  const classes = useStyles({});
    return (
      <div className={classes.controls}>
        {props.page+1}
      </div>
    )
}



interface PDFPreviewProps {
  files: UploadedFile[] | undefined,
  currentPage: number | undefined
}

const PDFPreview = (props: PDFPreviewProps) => {
  // loads something necessary to render pdf
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`; 
  const scroller = React.createRef<VariableSizeList>();
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
    if (props.currentPage != null && scroller.current != null) {
      scroller.current!.scrollToItem(props.currentPage, "center");
    } 
  }, [props.currentPage])

  useEffect(() => {
    if (outerBox.current != null) {
    setWidth(outerBox.current.offsetWidth);
    }
  }, [outerBox])

  
  return (
        <div className={classes.outer} id="pdfOuter" ref={outerBox}>
          <Document className={classes.documentView} loading={t("loading")} file={mergedPDF != null ? mergedPDF.file : null} noData="">
          <VariableSizeList ref={scroller} height={window.innerHeight * 0.8} width={width} itemSize={(i) => {return (width-32)*pageSizes[i]+8}} itemCount={numberPages}>
              { ({style, index}) => (
                <div style={style}>
                <Page className={classes.pdfPage} pageNumber={index+1} key={index} width={width-32}> 
                <PreviewControls page={index} />
                </Page>
                </div>
            )}
            </VariableSizeList>
          </Document>
        </div>
  )
}

  export default PDFPreview;