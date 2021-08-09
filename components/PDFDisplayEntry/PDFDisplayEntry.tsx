import styles from '../../styles/PDFsDisplayEntry.module.css'
import { Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import { FileContext, getPage } from "../../hooks/FileContext";
import React from 'react';
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import DeleteIcon from '@material-ui/icons/Delete';
import { PDFDocument } from 'pdf-lib';
import { UploadedFile } from '../../hooks/UploadedFile';

interface PDFsDisplayEntryProps {uploadedFile : UploadedFile, index: number};

const PDFDisplayEntry = (props: PDFsDisplayEntryProps) => {
  
    function download() {
      let url = window.URL.createObjectURL(props.uploadedFile.file);
      let name = props.uploadedFile.file.name;
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none;");
  
      // Set its download and href attributes accordingly to filename and URL of file
      a.download = name;
      a.href = url!;
      a.click();
      a.remove();
    }

    return (
      <FileContext.Consumer>
        {(fileStore) => (
          <Draggable draggableId={props.uploadedFile.uuid} index={props.index} key={props.uploadedFile.uuid}>
          {(provided, snapshot) => (
            <div onClick={(e) => {fileStore!.setPage(getPage(fileStore!.files, props.index))}} ref={provided.innerRef} {...provided.dragHandleProps} 
            {...provided.draggableProps} className={`${styles.entry} ${snapshot.isDragging ? styles.entryDrag : ''}`}>
            <ListItem ContainerComponent="div">
              <ListItemText primary={props.uploadedFile.name} title={props.uploadedFile.name} style={{paddingRight: '120px'}}/>
              <ListItemSecondaryAction>
                  <IconButton onClick={download}><GetAppIcon /></IconButton>
                  <IconButton onClick={(e) => (fileStore?.splitFile(props.uploadedFile))}><CallSplitIcon /></IconButton>
                  <IconButton onClick={(e) => (fileStore?.deleteFile(props.uploadedFile))}><DeleteIcon /></IconButton>
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