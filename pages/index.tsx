import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { SyntheticEvent } from 'react'
let file1 : File;
let file2 : File;

function UploadFirstPDFButton(text : String) {
  async function fileUpload(e: SyntheticEvent) {
    e.preventDefault();
    try {
    let fileHandle = await window.showOpenFilePicker();
    file1 = await fileHandle[0].getFile();
    } catch (error) {
      
    }
  }
  return (
    <button className={styles.upload} onClick={fileUpload}>{text}</button>
  )
}

function UploadSecondPDFButton(text: String) {

  async function fileUpload(e: SyntheticEvent) {
    e.preventDefault();
    try {
    let fileHandle = await window.showOpenFilePicker();
    file2 = await fileHandle[0].getFile();
    const writable = await saveLocation();
    await writable.write("Hello, test!")
    await writable.close();
    } catch (error) {

    }
  }

  async function saveLocation() {
    const options = {
      types: [
        {
        description: 'PDF',
        accept: {
          'pdf/document': ['.pdf'],
        },
      },
    ],
  }

    let saveHandle = await window.showSaveFilePicker(options);
    return await saveHandle.createWritable();
  }


  return (
    <button className={styles.upload} onClick={fileUpload}>{text}</button>
  )


  
}


export default function Home() {
  return (
    <body>
      <Head>
        <title>Merge 2 PDFs</title>
        <meta name="Test Project" content="Test creation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>
          Merge two PDFs.
        </h1>


        {UploadFirstPDFButton("Upload PDF1")}
        {UploadSecondPDFButton("Upload PDF2")}
      </main>

      
      

      <footer className={styles.footer}>
          Laget med kjærlighet i Trondheim
      </footer>
    </body>
  )
}