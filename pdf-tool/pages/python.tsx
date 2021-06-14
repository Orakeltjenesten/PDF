import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function FanPage() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Test Project</title>
          <meta name="Test Project" content="Test creation" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main className={styles.main}>
          <h1 className={styles.title}>
            This is a test app.
          </h1>
  
          <p className={styles.description}>
            Some cool programmer hacks for python.
          </p>


          <div className={styles.grid}>
            <a className={styles.card}>
                <h2>Cool python hack!</h2>
                <p>Instead of writing a million lines of code, you can use a for loop!</p>
            </a>


            <a className={styles.card}>
                <h2>Cool python hack 2!</h2>
                <p>You can use print() to print text to console!</p>
            </a>

            <a className={styles.card}>
                <h2>Cool python hack 3!</h2>
                <p>Write lines using a keyboard.</p>
            </a>

            <a className={styles.card}>
                <h2>Cool python hack 4!</h2>
                <p>Run a python file with <code>python file.py</code></p>
            </a>

        

            <Link href="/">
            <a className={styles.card}>
              <h2>Home &rarr;</h2>
              <p>Exit this page, go back home. Return to start.</p>
            </a>
            </Link>
          </div>
        </main>
  
        <footer className={styles.footer}>
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel" width={60} height={16} />
            </span>
        </footer>
      </div>
    )
  }
  