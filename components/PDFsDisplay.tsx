import React from "react";
import { PDFsDisplayEntry } from "./PDFsDisplayEntry";

export class PDFsDisplay extends React.Component<{files : File[], moveEntryOneUp : (file: File) => void, deleteEntry : (file: File) => void, updateSelected : (file: File) => void}, {}> {
    constructor(props: {files : File[], moveEntryOneUp : (file: File) => void, deleteEntry : (file: File) => void, updateSelected : (file: File) => void}) {
      super(props);
    }
    
  
  
    pdfList() {
      return this.props.files.map((file : File) => 
      <PDFsDisplayEntry file={file} clickEntryOneUp={this.props.moveEntryOneUp} clickDeleteEntry={this.props.deleteEntry} updateSelected={this.props.updateSelected} />
      )
    }
  
    render() {
      return <div id="entries">
        {this.pdfList()}
      </div>
    }
  }