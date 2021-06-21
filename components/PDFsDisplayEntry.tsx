import React from "react";
import styles from '../styles/PDFsDisplayEntry.module.css'
import { Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import classNames from "classnames";
import { red } from "@material-ui/core/colors";
import { WithStyles } from "@material-ui/styles";

interface PDFsDisplayEntryProps {file : File, index: number, clickDeleteEntry : (file : File) => void, updateSelected : (file: File) => void, split : (file : File) => void};

const PDFsDisplayEntry = (props: PDFsDisplayEntryProps) => {


    function download() {
      let url = window.URL.createObjectURL(props.file);
      let name = props.file.name;
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none;");
  
      // Set its download and href attributes accordingly to filename and URL of file
      a.download = name;
      a.href = url!;
      a.click();
      a.remove();
    }

    function getColor(file: File) {
      if ((file as any).lastModifiedDate == null) {
        return "0";
      }
      return '#' + (file as any).lastModifiedDate.toString(16);
    }



    return (
      <Draggable draggableId={props.file.name} index={props.index} key={props.file.name}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.dragHandleProps} 
          {...provided.draggableProps} className={`${styles.entry} ${snapshot.isDragging ? styles.entryDrag : ''}`}>
          <div className={styles.text} onClick={(e) => (props.updateSelected(props.file))}>
            <span title={props.file.name}>{props.file.name}</span>
          </div>
          <div className={styles.controls}> 
            <button style={{backgroundColor: getColor(props.file)}} className={styles.downloadButton} onClick={download}>⬇️</button>
            <button className={styles.splitButton} onClick={(e) => (props.split(props.file))}>✂️</button>
            <button className={styles.deleteButton} onClick={(e) => (props.clickDeleteEntry(props.file))}>🗑</button>
          </div>
        </div>
        )}
      
      </Draggable>
    );
  }

export default PDFsDisplayEntry;