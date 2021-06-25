import styles from '../../styles/PDFsDisplayEntry.module.css'
import { Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import { FileContext } from "../../hooks/FileContext";
import React from 'react';
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import DeleteIcon from '@material-ui/icons/Delete';
import { PDFDocument } from 'pdf-lib';

interface PDFsDisplayEntryProps {file : File, index: number};

const PDFDisplayEntry = (props: PDFsDisplayEntryProps) => {
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
      <FileContext.Consumer>
        {(fileStore) => (
          <Draggable draggableId={props.file.name} index={props.index} key={props.file.name}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.dragHandleProps} 
            {...provided.draggableProps} className={`${styles.entry} ${snapshot.isDragging ? styles.entryDrag : ''}`}>
            <ListItem ContainerComponent="div">
              <ListItemText primary={props.file.name} title={props.file.name} style={{paddingRight: '120px'}}/>
              <ListItemSecondaryAction>
                  <IconButton onClick={download}><GetAppIcon /></IconButton>
                  <IconButton onClick={(e) => (fileStore?.splitFile(props.file))}><CallSplitIcon /></IconButton>
                  <IconButton onClick={(e) => (fileStore?.deleteFile(props.file))}><DeleteIcon /></IconButton>
                </ListItemSecondaryAction> 
                
            </ListItem>
            
            </div>
          )}
          </Draggable>
        )}
        </FileContext.Consumer>
    );
  }

export default PDFDisplayEntry;