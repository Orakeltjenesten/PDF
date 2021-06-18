import React from "react";
import styles from '../styles/PDFsDisplayEntry.module.css'
import { Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import classNames from "classnames";

export class PDFsDisplayEntry extends React.Component<{file : File, index: number, clickDeleteEntry : (file : File) => void, updateSelected : (file: File) => void, split : (file : File) => void}, {}> { 
    constructor(props: {file : File, index: number, clickDeleteEntry : (file : File) => void, notifySelected : (file:File) => (void), updateSelected : (file: File) => void, split : (file : File) => void}) {
      super(props);
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
            <button id="splitButton" onClick={(e) => (this.props.split(this.props.file))}>Split</button>
            <button id="deleteEntryButton" onClick={(e) => (this.props.clickDeleteEntry(this.props.file))}>Remove</button>
          </div>
        </div>
        )}
      
      </Draggable>
    );
    }
  }