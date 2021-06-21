import { PDFDocument } from "pdf-lib";
import React, { SyntheticEvent } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { FileContext } from "./FileContextWrapper";

export class UploadButton extends React.Component<{text: string, updateFiles: (files: File[]) => void}, {}> {
    constructor(props: {text: string, updateFiles: (files: File[]) => void}) {
      super(props);
    }
  
    triggerUpload(e : SyntheticEvent) {
      e.preventDefault();
      (document.getElementById('file1') as HTMLElement).click();
    }
  
    async handleUpload(e: React.FormEvent<HTMLInputElement>, context : any) {
      e.preventDefault();
      const files : (FileList | null) = (e.target as HTMLInputElement).files;
      if (files != null) {
        for (let i=0; i < files.length; i++) {
          let file : (File | null) = files.item(i);
          if (file == null) {
            alert("Invalid input");
            return;
          }
          let pdf = await PDFDocument.load(await file.arrayBuffer());
          if (pdf.getPageCount() == 0) {
            alert("Invalid input: " + file.name);
            return;
          }
        }


        context.updateFiles(Array.from(files));
      } else {
        alert("Invalid input");
        return;
      }
      (e.target as HTMLInputElement).value = "";
    }
  
    render() {
      return (
        <FileContext.Consumer>
        {(context) => (
          <div>
            <input className="hidden" onChange={(e) => this.handleUpload(e, context)} type="file" id="file1" multiple accept=".pdf"/>
            <input className="button" type="button" value={this.props.text} onClick={this.triggerUpload}/>
          </div>
      )
        }
        </FileContext.Consumer>
      )
    }
  }