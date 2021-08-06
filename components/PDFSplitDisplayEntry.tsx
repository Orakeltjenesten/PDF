import React, { useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf'
import MuiContainer from '@material-ui/core/Container';
import { UploadedFile } from '../hooks/UploadedFile';
import useTranslation from "next-translate/useTranslation";
import { Card } from '@material-ui/core';


interface PDFsDisplayEntryProps {uploadedFile : UploadedFile, index: number};

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
        <Document loading={t("loading")} file={props.uploadedFile.file} noData="">
          <Page pageNumber={1} width={200}/>
        </Document>
  );
}

export default PDFSplitDisplayEntry;