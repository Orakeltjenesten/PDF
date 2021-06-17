import React from "react";
import styles from '../styles/PDFsDisplayEntry.module.css'

export class PDFsDisplayEntry extends React.Component<{file : File, clickEntryOneUp : (file : File) => void, clickDeleteEntry : (file : File) => void, updateSelected : (file: File) => void}, {}> { 
    constructor(props: {file : File, clickEntryOneUp : (file : File) => void, clickDeleteEntry : (file : File) => void, notifySelected : (file:File) => (void), updateSelected : (file: File) => void}) {
      super(props);
    }
    render() {
    return (
      <button className={styles.entry} onClick={(e) => (this.props.updateSelected(this.props.file))}>
        <div className={styles.text}>
          <span title={this.props.file.name}>{this.props.file.name}</span>
        </div>
        <div className={styles.controls}> 
          <button id="moveEntryUpButton" onClick={(e) => (this.props.clickEntryOneUp(this.props.file))}>^</button>
          <button id="deleteEntryButton" onClick={(e) => (this.props.clickDeleteEntry(this.props.file))}>x</button>
        </div>
      </button>
    );
    }
  }