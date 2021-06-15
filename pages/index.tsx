import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { SyntheticEvent } from 'react'
import {PDFDocument, StandardFonts} from 'pdf-lib'
import { fileSave } from 'browser-fs-access'
import React from 'react'
let entryText : string;

class PDFsDisplayEntry extends React.Component<any> { // possibly replace any with function callback in props
  constructor(props: {}) {
    super(props);
  }
  render() {
  return (
    <div>
      <div className={styles.PDFDisplayEntryText}></div>
      <div className={styles.PDFDisplayEntryControls}> 
        <button id="moveEntryUpButton" onClick={(e) => (this.props.clickEntryOneUp(this.props.file))}> </button>
        <button id="deleteEntryButton" onClick={(e) => (this.props.clickDeleteEntry(this.props.file))}></button>
      </div>
    </div>
  );
  }
}

class PDFsDisplay extends React.Component<{}, {files : File[]}> {
  constructor(props: {}) {
    super(props);
    this.state = {files: []};
    this.moveEntryOneUp = this.moveEntryOneUp.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
  }
  
  moveEntryOneUp(name : string) {
    for (let i=0; i<this.state.files.length; i++) {
      if (name.includes(this.state.files[i].name)) {
        if (i == 0) {
          let f : File = this.state.files.splice(0,1)[0]
          this.state.files.push(f);
        } else {
          this.state.files.splice(i-1, 0, this.state.files.splice(i, 1)[0]);
        }
        break;
      }
    }
  }

  deleteEntry(name: string) {
    for (let i=0; i<this.state.files.length; i++) {
      if (name.includes(this.state.files[i].name)) {
        this.state.files.splice(i, 1);
        break;
      }
    }
  }
/*
  makeEntry(file : File) : PDFsDisplayEntry {
    var div = document.createElement("div");
  
    var upButton = document.createElement("button");
    upButton.onclick = (e) => moveOneUp(text);
    upButton.innerText = "^"
  
    var delButton = document.createElement("button");
    delButton.onclick = (e) => deleteEntry(text);
    delButton.innerText = "X";
  
    var textDiv = document.createElement("div");
    textDiv.innerText = text;
  
    var buttons = document.createElement("div");
    textDiv.style.flex = "5 1 0";
    buttons.style.flex = "1 1 0"
    textDiv.style.whiteSpace = "nowrap"
    textDiv.style.overflow = "hidden";
    textDiv.style.textOverflow = "ellipsis"
    
    buttons.style.justifyContent = "right";
    buttons.appendChild(upButton);
    buttons.appendChild(delButton);
  
    div.appendChild(textDiv);
    div.appendChild(buttons);
  
    document.getElementById("entries")!.appendChild(div);
  }
  */


  pdfList() {
    return this.state.files.map((file) => 
    <PDFsDisplayEntry clickEntryOneUp={this.moveEntryOneUp} clickDeleteEntry={this.deleteEntry} />
    )
  }

  render() {
    return <div id="entries" className={styles.entries}>
      {this.pdfList()}
    </div>
  }
}


function UploadButton(text : string) {

  function triggerUpload(e: SyntheticEvent){
    e.preventDefault();
    // Click the hidden element. This is necessary to change styling and text of the button.
    (document.getElementById('file1') as HTMLElement).click()

  }

  function handleFiles(handledFiles: FileList | null) {
    if (handledFiles != null) {
      files = Array.from(handledFiles);
    }
  }

  return (
    <div>
    <input className={styles.hidden} onChange={(e) => handleFiles(e.target.files)} type="file" id="file1" multiple accept=".pdf"/>

    <input className={styles.upload} type="button" value={text} onClick={triggerUpload}/>
    </div>
  )
}

function SavePDFButton(text: string) {

  async function assemblePDF(pdfs : PDFDocument[]) {
    
    const merged = await PDFDocument.create();
    pdfs.forEach(async (pdf) => (await merged.copyPages(pdf, pdf.getPageIndices()))
    .forEach((page) => merged.addPage(page))
    );
    
    return merged.save({addDefaultPage: false});
  }

  async function getDownload(e : SyntheticEvent) {
    e.preventDefault();
    let url: string;
    let name: string;
    renderEntries();

    if (files == null || files.length == 0) {
      alert("No files were uploaded.")
      return
    } else {
      let pdfList : PDFDocument[] = [];
      for (let i=0; i<files.length; i++) {
          let pdf = await PDFDocument.load(await files[i].arrayBuffer());
          pdfList.push(pdf);
      }
      const merged : Uint8Array = await assemblePDF(pdfList);
      url = window.URL.createObjectURL(new Blob([merged]));
      name = "merged.pdf"
    }

    // Create a ghost 'a'-element
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none;");

    // Set its download and href attributes accordingly to filename and URL of file
    a.download = name!;
    a.href = url!;
    a.click();

    a.remove();
    renderEntries();
  }


  return (
    <input className={styles.upload} type="button" value={text} onClick={getDownload} />
  )
}


export default function Home() {
  return (
    <body>
      <Head>
        <title>PDF MERGER</title>
        <meta name="Test Project" content="Test creation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>
          PDF Merger
        </h1>


        {UploadButton("Upload PDFs")}

        <div id="entries" className={styles.entries}>
          
        </div>

        {SavePDFButton("Merge")}
      </main>

      
      

      <footer className={styles.footer}>
          Laget med kjærlighet i Trondheim
      </footer>
    </body>
  )
}
