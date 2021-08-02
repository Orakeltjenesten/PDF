import { ThemeContext } from "@emotion/react";
import { Button } from "@material-ui/core";
import { PDFDocument } from "pdf-lib";
import React, { SyntheticEvent } from "react";
import { FileContext, assemblePDF } from "../hooks/FileContext";
import { UploadedFile } from "../hooks/UploadedFile";

export class SavePDFButton extends React.Component<{text: string, files?: UploadedFile[]}, {}> {
    constructor(props: {text: string, files: UploadedFile[]}) {
      super(props);
      this.getDownload = this.getDownload.bind(this);
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
        const merged : Blob = await assemblePDF(context.files);
        url = window.URL.createObjectURL(merged);
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
          <Button variant="contained" onClick={(e) => this.getDownload(e, context)}>{this.props.text}</Button>
      )
        }
      </FileContext.Consumer>
      
      
    }
  
  }