import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { SyntheticEvent } from 'react'
import {PDFDocument, StandardFonts} from 'pdf-lib'
let currentFile : File;


function UploadButton(text : String) {

  function triggerUpload(e: SyntheticEvent){
    e.preventDefault();
    // Click the hidden element. This is necessary to change styling and text of the button.
    (document.getElementById('file1') as HTMLElement).click()

  }

  function handleFiles(files: FileList) {
    let firstFile : File | null = files.item(0);
    if (firstFile != null) {
      currentFile = firstFile;
    }
  }

  return (
    <div>
    <input className={styles.hidden} onChange={(e) => handleFiles(e.target.files)} type="file" id="file1" multiple/>

    <input className={styles.upload} type="button" value="Upload" onClick={triggerUpload} />
    </div>
  )
}

function SavePDFButton(text: String) {

  async function savePDF(e: SyntheticEvent) {
    e.preventDefault();
    /*try {
    
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const first = await PDFDocument.load(await file1.arrayBuffer());
    const second = await PDFDocument.load(await file2.arrayBuffer());

    const copiedFirst = await pdfDoc.copyPages(first, first.getPageIndices())
    const copiedSecond = await pdfDoc.copyPages(second, second.getPageIndices());

    copiedFirst.forEach((page) => pdfDoc.addPage(page));
    copiedSecond.forEach((page) => pdfDoc.addPage(page));

    const writable = (await saveLocation())
    writable.write(await pdfDoc.save());

    writable.close();

    } catch (error) {
      console.log(error);
    }*/
  }

  async function getDownload(e : SyntheticEvent) {
    e.preventDefault();

    
    let url: string;
    let name: string;

    if (currentFile == null) {
      // Create a test file
      let blob = new Blob(["You had not uploaded a file, so this empty one was returned."]);
      url = window.URL.createObjectURL(blob);
      name = "empty.txt"
    } else {
      // Embed the current file in a URL
      url = window.URL.createObjectURL(currentFile);
      name = "your_file_as_text.txt"
    }

    // Create a ghost 'a'-element
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none;");

    // Set its download and href attributes accordingly to filename and URL of file
    a.download = name;
    a.href = url;
    a.click();

    a.remove();
  }


  return (
    <input className={styles.upload} type="button" value="Save" onClick={getDownload} />
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


        {UploadButton("Upload PDF1")}
        {SavePDFButton("Save")}
      </main>

      
      

      <footer className={styles.footer}>
          Laget med kjærlighet i Trondheim
      </footer>
    </body>
  )
}
