import { toUint8Array } from "pdf-lib";
import React from "react";
import styles from '../styles/Home.module.css'
import { Document, Page, pdfjs } from 'react-pdf'

export class PDFPreview extends React.Component<{url : string}, {}> {
    constructor(props: {url : string}) {
        super(props);
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    }
    
    render() {
      return <Document className={styles.documentView} file={this.props.url}> 
      
      <Page pageNumber={1}/>
      
      
      </Document>
    }
  }