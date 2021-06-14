import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { SyntheticEvent } from 'react'

function UploadFileButton() {
  async function fileUpload(e: SyntheticEvent) {
    e.preventDefault();
    let fileHandle = await window.showOpenFilePicker();
    const file = await fileHandle[0].getFile();
    alert(await file.text());

    let saveHandle = await window.showSaveFilePicker();

  }
  return (
    <button onClick={fileUpload}>Upload file</button>
  )
}


export default function Home() {
  return (
    <body>
      <Head>
        <title>Test Project</title>
        <meta name="Test Project" content="Test creation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>
          This is a test app.
        </h1>
      </main>

      {UploadFileButton()}
      

      <footer className={styles.footer}>
          Test site.
      </footer>
    </body>
  )
}
