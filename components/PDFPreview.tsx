import { toUint8Array } from "pdf-lib";
import React from "react";
import styles from '../styles/Home.module.css'
import { Document, pdfjs } from 'react-pdf'

export class PDFPreview extends React.Component<{file : File}, {}> {
    constructor(props: {file : File}) {
        super(props);
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    }
    
    render() {
      return <Document file={this.props.file} />
    }
  }