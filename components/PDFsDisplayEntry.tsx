import React from "react";
import styles from '../styles/PDFsDisplayEntry.module.css'
import { Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import classNames from "classnames";
import { red } from "@material-ui/core/colors";

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

    getColor(file: File) {
      if ((file as any).lastModifiedDate == null) {
        return "0";
      }
      return '#' + (file as any).lastModifiedDate.toString(16);
    }


    render() {
    return (
      <Draggable draggableId={this.props.file.name} index={this.props.index} key={this.props.file.name}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.dragHandleProps} 
          {...provided.draggableProps} className={`${styles.entry} ${snapshot.isDragging ? styles.entryDrag : ''}`}>
          <div className={styles.text} onClick={(e) => (this.props.updateSelected(this.props.file))}>
            <span title={this.props.file.name}>{this.props.file.name}</span>
          </div>
          <div className={styles.controls}> 
            <button style={{backgroundColor: this.getColor(this.props.file)}} className={styles.downloadButton} onClick={this.download}>⬇️</button>
            <button className={styles.splitButton} onClick={(e) => (this.props.split(this.props.file))}>✂️</button>
            <button className={styles.deleteButton} onClick={(e) => (this.props.clickDeleteEntry(this.props.file))}>🗑</button>
          </div>
        </div>
        )}
      
      </Draggable>
    );
    }
  }