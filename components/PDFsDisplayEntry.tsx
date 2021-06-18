import React from "react";
import styles from '../styles/PDFsDisplayEntry.module.css'
import { Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import classNames from "classnames";

export class PDFsDisplayEntry extends React.Component<{file : File, index: number, clickDeleteEntry : (file : File) => void, updateSelected : (file: File) => void, split : (file : File) => void}, {}> { 
    constructor(props: {file : File, index: number, clickDeleteEntry : (file : File) => void, notifySelected : (file:File) => (void), updateSelected : (file: File) => void, split : (file : File) => void}) {
      super(props);
      this.download = this.download.bind(this);
    }



    download() {
      let url = window.URL.createObjectURL(this.props.file);
      let name = this.props.file.name;
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none;");
  
      // Set its download and href attributes accordingly to filename and URL of file
      a.download = name;
      a.href = url!;
      a.click();
      a.remove();
    }


    render() {
    return (
      <Draggable draggableId={this.props.file.name} index={this.props.index} key={this.props.file.name}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} className={`${styles.entry} ${snapshot.isDragging ? styles.entryDrag : ''}`} >
          <div className={styles.text} onClick={(e) => (this.props.updateSelected(this.props.file))}>
            <span title={this.props.file.name}>{this.props.file.name}</span>
          </div>
          <div className={styles.controls}> 
            <button id="downloadButton" onClick={this.download}>DL</button>
            <button id="splitButton" onClick={(e) => (this.props.split(this.props.file))}>Split</button>
            <button id="deleteEntryButton" onClick={(e) => (this.props.clickDeleteEntry(this.props.file))}>Remove</button>
          </div>
        </div>
        )}
      
      </Draggable>
    );
    }
  }