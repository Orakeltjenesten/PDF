import { ThemeContext } from "@emotion/react";
import { PDFDocument } from "pdf-lib";
import React, { SyntheticEvent } from "react";
import { FileContext } from "../hooks/FileContext";

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
  
    async getDownload(e : SyntheticEvent, context: any) {
      e.preventDefault();
      let url: string;
      let name: string;
  
      if (context.files == null || context.files.length == 0) {
        alert("No files were uploaded.")
        return
      } else {
        let pdfList : PDFDocument[] = [];
        const merged : Uint8Array = await this.assemblePDF(context.files);
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
      return <FileContext.Consumer>
        {(context) => (
          <input className="button" type="button" value={this.props.text} onClick={(e) => this.getDownload(e, context)} />
      )
        }
      </FileContext.Consumer>
      
      
    }
  
  }