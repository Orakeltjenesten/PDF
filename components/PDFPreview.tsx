import { PDFDocument, toUint8Array } from "pdf-lib";
import React from "react";
import styles from '../styles/PDFPreview.module.css'
import { Document, Page, pdfjs } from 'react-pdf'
import { fileSave } from "browser-fs-access";



class PreviewControls extends React.Component<{prev : () => void, next : () => void}, {}> {
  render() {
    return (
      <div className={styles.controls}>
        <button onClick={this.props.prev}>prev</button>
        <button onClick={this.props.next}>next</button>
      </div>
    )
  }
}





export class PDFPreview extends React.Component<{file : File | undefined}, {pageNumber : number, numberPages : number}> {
    constructor(props: {file : File, numberPages : number}) {
        super(props);
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        this.state = {
          pageNumber: 1,
          numberPages: 0
        }
    }

    componentDidUpdate(prevProps : any) {
      if (this.props.file != prevProps.file) {
        this.setState({
          pageNumber: 1
        }
        )
      }
    }

    async incrementPage(amount: number) {
      if (this.props.file == null) {
        return
      }

      if (this.state.pageNumber + amount > 0 && this.state.pageNumber + amount <= this.state.numberPages) {
        this.setState({
          pageNumber : this.state.pageNumber + amount
        })
    }
    }
    render() {
      return (
      <Document className={styles.documentView} file={this.props.file} onLoadSuccess={(pdf) => (    this.setState({ numberPages : pdf.numPages})   )}> 
      
        <Page className={styles.pdfPage} pageNumber={this.state.pageNumber} height={1100}>
          <PreviewControls prev={() => {this.incrementPage(-1)}} next={() => {this.incrementPage(1)}} />
        </Page>
      
      
      </Document>
      )
    }
  }