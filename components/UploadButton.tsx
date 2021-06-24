import { PDFDocument } from "pdf-lib";
import React, { SyntheticEvent } from "react";
import { FileContext } from "../hooks/FileContext";


export type UploadButtonProps = {
  text: string;
};

const UploadButton = ({text}: UploadButtonProps) => {

  
  const triggerUpload = (e : SyntheticEvent) => {
    e.preventDefault();
    (document.getElementById('file1') as HTMLElement).click();
  }

  const handleUpload = async (e: React.FormEvent<HTMLInputElement>, uploadAction: ((files: File[]) => void) | undefined) => {
    e.preventDefault();
    console.log()
    const files : (FileList | null) = (e.target as HTMLInputElement).files;
    if (files != null) {
      for (let i=0; i < files.length; i++) {
        let file : (File | null) = files.item(i);
        if (file == null) {
          alert("Invalid input");
          return;
        }
        if (file.type == "application/pdf") {
          let pdf = await PDFDocument.load(await file.arrayBuffer());
          if (pdf.getPageCount() == 0) {
            alert("Invalid input: " + file.name);
            return;
          }
        } else if (file.type != "image/png" && file.type != "image/jpeg") {
          alert("Unsupported filetype.")
          return;
        }
      }
      if(uploadAction != undefined){
        uploadAction(Array.from(files));
      }
    } else {
      alert("Invalid input");
      return;
    }
    (e.target as HTMLInputElement).value = "";
  }

  return (
    <FileContext.Consumer>
    {(fileStore) => (
      <div>
        <input className="hidden" onChange={(e) => handleUpload(e, fileStore?.addFiles)} type="file" id="file1" multiple accept=".pdf, .png, .jpg"/>
        <input className="button" type="button" value={text} onClick={triggerUpload}/>
      </div>
  )
    }
    </FileContext.Consumer>
  )
}

export default UploadButton;