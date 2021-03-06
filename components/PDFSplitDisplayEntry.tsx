import React, { useEffect } from 'react';

import { Document, Page, pdfjs } from 'react-pdf'
import { UploadedFile } from '../hooks/UploadedFile';
import useTranslation from "next-translate/useTranslation";

// Material UI Components
import { Checkbox, Grid} from '@material-ui/core';
import CallSplitIcon from '@material-ui/icons/CallSplit';


interface PDFsDisplayEntryProps {uploadedFiles: UploadedFile[], uploadedFile : UploadedFile, index: number};

const PDFSplitDisplayEntry = (props: PDFsDisplayEntryProps) => {
  const { t } = useTranslation("common");
  function download() {
    let url = window.URL.createObjectURL(props.uploadedFile.file);
    let name = props.uploadedFile.file.name;
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none;");

    // Set its download and href attributes accordingly to filename and URL of file
    a.download = name;
    a.href = url!;
    a.click();
    a.remove();
  }
  
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, [])


  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item xs={12} sm={10}>
        <Document loading={t("loading")} file={props.uploadedFile.file} noData="">
          <Page pageNumber={1}/>
        </Document>
      </Grid>
      { (props.index != props.uploadedFiles.length-1) &&
      <Grid item xs={12} sm={2}>
        <Checkbox checkedIcon={<CallSplitIcon />} />
      </Grid>
      }
    </Grid>
  );
}

export default PDFSplitDisplayEntry;