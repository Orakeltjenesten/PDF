import { Draggable } from "react-beautiful-dnd";
import { FileContext, getPage } from "../hooks/FileContext";
import React from 'react';
import { UploadedFile } from '../hooks/UploadedFile';
import classnames from 'classnames';


// Material UI Components
import { createStyles, makeStyles } from '@material-ui/styles';
import {IconButton, ListItem, ListItemSecondaryAction, ListItemText, Theme} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import DeleteIcon from '@material-ui/icons/Delete';
import useTranslation from "next-translate/useTranslation";


const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    entry : {
      borderRadius: "7px",
      maxWidth: "500px",
      padding: "0px",
      margin: "3px",
      textAlign: "center",
      fontWeight: "bold",
      position: "relative",
      '&:hover': {
        backgroundColor: "lightcoral"
    }
    },
    entryDrag : {
      backgroundColor: "lightcoral"
    }
}));


interface PDFsDisplayEntryProps {uploadedFile : UploadedFile, index: number};

const PDFDisplayEntry = (props: PDFsDisplayEntryProps) => {
    const classes = useStyles();
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
    const {t} = useTranslation("common");
    return (
      <FileContext.Consumer>
        {(fileStore) => (
          <Draggable draggableId={props.uploadedFile.uuid} index={props.index} key={props.uploadedFile.uuid}>
          {(provided, snapshot) => (
            <div onClick={(e) => {fileStore!.setPage(getPage(fileStore!.files, props.index))}} ref={provided.innerRef} {...provided.dragHandleProps} 
            {...provided.draggableProps} className={classnames(classes.entry, snapshot.isDragging && classes.entryDrag)}>
            <ListItem ContainerComponent="div">
              <ListItemText primary={props.uploadedFile.name} title={props.uploadedFile.name} style={{paddingRight: '120px'}}/>
              <ListItemSecondaryAction>
                <IconButton title={t("download_this")} onClick={download}><GetAppIcon /></IconButton>
                <IconButton title={t("split_pages")} onClick={(e) => (fileStore?.splitFile(props.uploadedFile))}><CallSplitIcon /></IconButton>
                <IconButton title={t("delete_this")} onClick={(e) => (fileStore?.deleteFile(props.uploadedFile))}><DeleteIcon /></IconButton>
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