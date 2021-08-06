import { Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import { FileContext, getPage } from "../hooks/FileContext";
import React from 'react';
import { createStyles, IconButton, ListItem, ListItemSecondaryAction, ListItemText, Theme } from '@material-ui/core';
import MuiContainer from '@material-ui/core/Container';
import GetAppIcon from '@material-ui/icons/GetApp';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import DeleteIcon from '@material-ui/icons/Delete';
import { PDFDocument } from 'pdf-lib';
import { UploadedFile } from '../hooks/UploadedFile';
import PDFPreview from './PDFPreview';
import { makeStyles, WithStyles } from '@material-ui/styles';


interface PDFsDisplayEntryProps {uploadedFile : UploadedFile, index: number};

const PDFSplitDisplayEntry = (props: PDFsDisplayEntryProps) => {
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

          <MuiContainer>
              <PDFPreview files={[props.uploadedFile]} currentPage={0}></PDFPreview>
          </MuiContainer>
    );
  }

export default PDFSplitDisplayEntry;