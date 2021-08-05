import React, { useContext, useEffect, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf'
import { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles, withStyles, WithStyles } from "@material-ui/styles";
import { FileContext, assemblePDF } from "../hooks/FileContext";
import { PDFDocument } from "pdf-lib";
import { FlutterDashTwoTone } from "@material-ui/icons";
import { UploadedFile } from "../hooks/UploadedFile";
import { getTypographyUtilityClass } from "@material-ui/core";
import useTranslation from 'next-translate/useTranslation';

const styles =(theme: Theme) => 
  createStyles({
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
    alignItems: 'center',
    height: '80vh',
    ['@media (min-width:1000px)']: { // eslint-disable-line no-useless-computed-key
      width: '90%',
      maxWidth: '700px'
    },
    ['@media (max-width:1000px)']: { // eslint-disable-line no-useless-computed-key
      maxWidth: '100%'
    },
  }

});

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
      }
    }));



const PreviewControls = (props: {page: number}) => {
  const classes = useStyles({});
    return (
      <div className={classes.controls}>
        {props.page}
      </div>
    )
}

const PreviewText = (props: {text: string}) => {
  const classes = useStyles({});
  return (
    <div className={classes.previewText}>
        {props.text}
    </div>
  )
}

const PageLoading = (props: {}) => {
  const { t } = useTranslation("common");
  const classes = useStyles({});
  return (
    <div className={classes.pageLoading}>
        {t("loading")}
    </div>
  )
}



interface PDFPreviewProps extends WithStyles<typeof styles> {
  files: UploadedFile[] | undefined,
  currentPage: number | undefined
}

const PDFPreview = (props: PDFPreviewProps) => {
  const { t } = useTranslation("common");
  let outerBox = React.createRef<HTMLDivElement>();
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  const [mergedPDF, setMergedPDF] = useState<UploadedFile | undefined>(undefined);
  const [numberPages, setNumberPages] = useState(-1);
  
  async function makePreview() {
    let file : UploadedFile = (await assemblePDF(props.files!))!
    setMergedPDF(file);
    setNumberPages(file.getPageCount());
  }

  useEffect(() => {
    if (props.files != null) {
      makePreview();   
    }
  }, [props.files])

  useEffect(() => {
    if (props.currentPage != null) {
      if (outerBox.current != null) {
        let outer: HTMLDivElement = outerBox.current;
        let doc: HTMLDivElement = (outer.firstChild as HTMLDivElement);
        doc!.children.item(props.currentPage)?.scrollIntoView();
      }
    }
  }, [props.currentPage])

    const {classes} = props;
    return (
      <FileContext.Consumer> 
      { (context: any) => (
      <div className={classes.outer} id="pdfOuter" ref={outerBox}>
        
        <Document className={classes.documentView} loading={t("loading")} file={mergedPDF != null ? mergedPDF.file : null} noData="">
          {mergedPDF != null && numberPages > 0 ? Array.from(Array(numberPages).keys()).map( (i) => {
          return <Page className={classes.pdfPage} pageNumber={i+1} key={i} width={document.getElementById("pdfOuter")!.offsetWidth-32}> 
            <PageLoading />
            <PreviewControls page={i+1} />
          </Page>
        }) : <div />}
        
        </Document>
        </div>
      )}
        </FileContext.Consumer>
  )
}

  export default withStyles(styles)(PDFPreview);