import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { SyntheticEvent } from 'react'
import {PDFDocument, PDFPage, StandardFonts, toUint8Array} from 'pdf-lib'
import { fileSave } from 'browser-fs-access'
import React from 'react'
import { PDFsDisplay } from '../components/PDFsDisplay'
import { SavePDFButton } from '../components/SavePDFButton'
import { UploadButton } from '../components/UploadButton'
import { PDFPreview } from '../components/PDFPreview'
import { jssPreset } from '@material-ui/styles'
import { MainFrame } from '../components/MainFrame'



export default function Home() {
  return (
    <>
      <Head>
        <title>PDF TOOL</title>
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
