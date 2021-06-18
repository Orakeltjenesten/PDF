import { PDFDocument, toUint8Array } from "pdf-lib";
import React from "react";
import styles from '../styles/PDFPreview.module.css'
import { Document, Page, pdfjs } from 'react-pdf'
import { fileSave } from "browser-fs-access";
import { ThirtyFpsSelect } from "@material-ui/icons";



class PreviewControls extends React.Component<{prev : () => void, next : () => void, page : number}, {}> {
  render() {
    return (
      <div className={styles.controls}>
        {this.props.page}
      </div>
    )
  }
}

class PreviewText extends React.Component<{file : File | undefined}, {}>{
  render() {
    return (
      <div className={`${styles.previewText} ${this.props.file == null? styles.hidden : styles.previewText}`}>
          Preview
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

    pages() {
      
      
      }


    render() {
      return (
        <div className={styles.outer}>
          <Document className={styles.documentView} file={this.props.file} onLoadSuccess={(pdf) => (this.setState({ numberPages : pdf.numPages}))} noData="">
            
            {Array.from(Array(this.state.numberPages).keys()).map( (i) => {
            return <Page className={styles.pdfPage} pageNumber={i+1}>
              
              <PreviewControls page={i+1} prev={() => {this.incrementPage(-1)}} next={() => {this.incrementPage(1)}} />
            </Page>
          })}
          
          </Document>
          <PreviewText file={this.props.file} />
          </div>
      ) 
    }
  }