import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import MainFrame  from '../components/MainFrame'



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
