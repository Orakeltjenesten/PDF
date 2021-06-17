import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { SyntheticEvent } from 'react'
import {PDFDocument, StandardFonts, toUint8Array} from 'pdf-lib'
import { fileSave } from 'browser-fs-access'
import React from 'react'
import { PDFsDisplay } from '../components/PDFsDisplay'
import { SavePDFButton } from '../components/SavePDFButton'
import { UploadButton } from '../components/UploadButton'
import { PDFPreview } from '../components/PDFPreview'


class MainFrame extends React.Component<{}, {files: File[], selectedURL: string}> {
  constructor(props: {}) {
    super(props);
    this.state = {files : [], selectedURL: ""}
    this.deleteEntry = this.deleteEntry.bind(this);
    this.moveEntryOneUp = this.moveEntryOneUp.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
    this.updateSelected = this.updateSelected.bind(this);
  }

  updateFiles(newFiles : File[]) {
    this.setState(
      {
        files: newFiles
      }
    );
  }

  async getURL(file: File) {
    if (file != null) {
        let saved : Uint8Array = toUint8Array(await file.arrayBuffer());
        let url = window.URL.createObjectURL(new Blob([saved]));
        return url;
    }
    return "";

}

  async updateSelected(newFile : File) {
    let url : string = await this.getURL(newFile);
    this.setState( 
      {
        selectedURL : url
      }
    )
  }

  moveEntryOneUp(file: File) {
    let newFiles = Array.from(this.state.files); // Copy the array, as arrays should not be changed directly
    for (let i =0; i<newFiles.length; i++) {
      if (file === newFiles[i]) {
        if (i == 0) {
          let f: File = newFiles.splice(0,1)[0]
          newFiles.push(f);
        } else {
          newFiles.splice(i-1, 0, newFiles.splice(i, 1)[0]);
        }
        break;
      }
    }
    this.setState( { // End by updating state with the modified array
      files : newFiles
    })
  }

  deleteEntry(file: File) {
    let newFiles = Array.from(this.state.files);
    for (let i=0; i<newFiles.length; i++) {
      if (file === newFiles[i]) {
        newFiles.splice(i, 1); 
        break;
      }
    }
    this.setState( { // End by updating state with the modified array
      files : newFiles
    })
  }

  render() {
    return (
      <div className={styles.mainFrame}>
        <div className={styles.listView}>
          <UploadButton text="Upload PDFs" updateFiles={this.updateFiles} />
          <PDFsDisplay moveEntryOneUp={this.moveEntryOneUp} deleteEntry={this.deleteEntry} updateSelected={this.updateSelected} files={this.state.files} />
          <SavePDFButton text="Download" files={this.state.files}/>
        </div>
        {
        (this.state.selectedURL != "") &&
        <div className={styles.preview}><PDFPreview url={this.state.selectedURL} /></div>
        }
      </div>
    )
  }
}




export default function Home() {
  return (
    <>
      <Head>
        <title>PDF MERGER</title>
        <meta name="PDF Merger" content="Merging PDF" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.header}>
          <h1>
            PDF Merger
          </h1>
        </div>

        <MainFrame/>

      
      
        <footer className={styles.footer}>
            Laget med kjærlighet i Trondheim
        </footer>
      </main>
    </>
  )
}
