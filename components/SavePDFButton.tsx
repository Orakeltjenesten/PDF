import { ThemeContext } from "@emotion/react";
import { Button } from "@material-ui/core";
import { PDFDocument } from "pdf-lib";
import React, { SyntheticEvent } from "react";
import { FileContext, assemblePDF } from "../hooks/FileContext";
import { UploadedFile } from "../hooks/UploadedFile";


interface SavePDFButtonProps {
  text: string
}

export const SavePDFButton = (props: SavePDFButtonProps) => {

    async function getDownload(e : SyntheticEvent, context: any) {
      e.preventDefault();
      let url: string;
      let name: string;
  
      if (context.files == null || context.files.length == 0) {
        alert("No files were uploaded.")
        return
      } else {
        let pdfList : PDFDocument[] = [];
        const merged : Blob = (await assemblePDF(context.files))!.file;
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
  
  return <FileContext.Consumer>
    {(context) => (
      <Button variant="contained" onClick={(e) => getDownload(e, context)}>{props.text}</Button>
    )
    }
  </FileContext.Consumer>
      
  
  }