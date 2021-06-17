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


class MainFrame extends React.Component<{}, {files: File[], selectedFile?: File}> {
  constructor(props: {}) {
    super(props);
    this.state = {files : [], selectedFile: undefined}
    this.deleteEntry = this.deleteEntry.bind(this);
    this.reorder = this.reorder.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
    this.updateSelected = this.updateSelected.bind(this);
  }

  updateFiles(newFiles : File[]) {

    let updatedFiles = Array.from(this.state.files);
    let contains = (file: File, files: File[]) => (files.filter( (file2: File) => (file2.name == file.name)).length > 0);
    updatedFiles = updatedFiles.concat(newFiles.filter((file: File) => (!contains(file, this.state.files))));

    if (updatedFiles.length != this.state.files.length + newFiles.length) {
      alert("It is not allowed to have multiple files with the same name.")
    }


    this.setState(
      {
        files: updatedFiles
      }
    );
  }


  async updateSelected(newFile : File | undefined) {
    this.setState( 
      {
        selectedFile : newFile!
      }
    )
    console.log(this.state);
  }

  reorder(from: number, to: number) {
    let newFiles = Array.from(this.state.files); // Copy the array, as arrays should not be changed directly
    let [deleted] = newFiles.splice(from, 1);
    newFiles.splice(to, 0, deleted);
    this.setState( { // End by updating state with the modified array
      files : newFiles
    })
  }

  deleteEntry(file: File) {
    if (this.state.selectedFile == undefined || this.state.selectedFile!.name == file.name) {
      this.updateSelected(undefined);
    }
    
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
          <PDFsDisplay reorder={this.reorder} deleteEntry={this.deleteEntry} updateSelected={this.updateSelected} files={this.state.files} />
          <SavePDFButton text="Download" files={this.state.files}/>
        </div>
        {
        <div className={styles.preview}><PDFPreview file={this.state.selectedFile}/></div>
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
