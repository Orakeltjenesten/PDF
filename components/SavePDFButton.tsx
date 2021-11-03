import React, { SyntheticEvent } from "react";

import { PDFDocument } from "pdf-lib";
import useTranslation from 'next-translate/useTranslation';
import { FileContext, assemblePDF } from "../hooks/FileContext";

// Material UI Components
import { Button } from "@material-ui/core";


interface SavePDFButtonProps {
  text: string
}

export const SavePDFButton = (props: SavePDFButtonProps) => {
  const { t } = useTranslation("common");
  
  
  async function getDownload(e : SyntheticEvent, context: any) {
    e.preventDefault();
    let url: string;
    let name: string | null;

    if (context.files == null || context.files.length == 0) {
      alert(t("no_files_error"))
      return
    } else {
      let pdfList : PDFDocument[] = [];
      const merged : Blob = (await assemblePDF(context.files))!.file;
      url = window.URL.createObjectURL(merged);
      //name = prompt("Name you file!")! + ".pdf"
    }

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none;");

    // Set its download and href attributes accordingly to filename and URL of file
    name = prompt("Save file as ")
    a.download =  name != null ? name : "merged" + ".pdf"
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