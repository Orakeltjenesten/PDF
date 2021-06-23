import { PDFDocument } from "pdf-lib";
import React, { SyntheticEvent } from "react";

export class SavePDFButton extends React.Component<{text: string, files?: File[]}, {}> {
    constructor(props: {text: string, files: File[]}) {
      super(props);
      this.getDownload = this.getDownload.bind(this);
    }

    async assemblePDF(files : File[]) {
      let pdfs : PDFDocument[] = await Promise.all(files.map(async (file) => PDFDocument.load(await file.arrayBuffer()))); 
      const merged = await PDFDocument.create();
      for (let i=0; i < pdfs.length; i++) {
        let pages = await merged.copyPages(pdfs[i], pdfs[i].getPageIndices());
        for (let j=0; j < pages.length; j++) {
          merged.addPage(pages[j]);
        }
      }
      
      return merged.save({addDefaultPage: false});
    }
  
    async getDownload(e : SyntheticEvent) {
      e.preventDefault();
      let url: string;
      let name: string;
  
      if (this.props.files == null || this.props.files.length == 0) {
        alert("No files were uploaded.")
        return
      } else {
        let pdfList : PDFDocument[] = [];
        const merged : Uint8Array = await this.assemblePDF(this.props.files);
        url = window.URL.createObjectURL(new Blob([merged]));
        name = "merged.pdf"
      }
  
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none;");
  
      // Set its download and href attributes accordingly to filename and URL of file
      a.download = name!;
      a.href = url!;
      a.click();
      a.remove();
  
    }
  
    render() {
      return <input className="button" type="button" value={this.props.text} onClick={this.getDownload} />;
    }
  
  }