import React from "react";
import { DragDropContext, DropResult} from 'react-beautiful-dnd';
import { Droppable } from "react-beautiful-dnd";
import styles from '../styles/Home.module.css'
import PDFDisplayEntry from "./PDFDisplayEntry/PDFDisplayEntry";
import { FileContext } from "../hooks/FileContext";
import { Grid } from "@material-ui/core";
import { UploadedFile } from "../hooks/UploadedFile";


export const PDFsDisplay = () => {
  
  function pdfList(context: any) {
    return context.files.map((uploadedFile : UploadedFile, index : number) => 
    <PDFDisplayEntry index={index} uploadedFile={uploadedFile} key={uploadedFile.name} />
    )
  }
  const onDragEnd = (result: DropResult, context: any) => {
    if (result.destination) {
      context.reorderFiles(result.source.index, result.destination.index);
    }
  };

  return (
    <FileContext.Consumer>
    {(fileStore) => (
      <DragDropContext onDragEnd={(result: DropResult) => {fileStore?.reorderFiles(result.source.index, result.destination?.index)}}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
            {fileStore?.files.map((uploadedFile : UploadedFile, index : number) => (
              <PDFDisplayEntry index={index} uploadedFile={uploadedFile} key={uploadedFile.file.name} />
            ))}
            {provided.placeholder}
            </div>
          )
          }
        </Droppable>
      </DragDropContext> 
  )
    }
    </FileContext.Consumer>
  )
}