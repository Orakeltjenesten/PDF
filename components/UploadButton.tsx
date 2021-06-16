import React, { SyntheticEvent } from "react";

export class UploadButton extends React.Component<{text: string, updateFiles: (files: File[]) => void}, {}> {
    constructor(props: {text: string, updateFiles: (files: File[]) => void}) {
      super(props);
    }
  
    triggerUpload(e : SyntheticEvent) {
      e.preventDefault();
      (document.getElementById('file1') as HTMLElement).click();
    }
  
    handleFiles(handledFiles: FileList | null) {
      if (handledFiles != null) {
        this.props.updateFiles(Array.from(handledFiles));
      }
    }
  
    render() {
      return (
      <div>
        <input className="hidden" onChange={(e) => this.handleFiles(e.target.files)} type="file" id="file1" multiple accept=".pdf"/>
  
        <input className="button" type="button" value={this.props.text} onClick={this.triggerUpload}/>
      </div>
      )
    }
  }