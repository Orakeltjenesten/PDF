import React from "react";
import { DragDropContext, DropResult} from 'react-beautiful-dnd';
import { Droppable } from "react-beautiful-dnd";
import styles from '../styles/Home.module.css'
import PDFDisplayEntry from "./PDFDisplayEntry";
import { FileContext } from "../hooks/FileContext";
import { createStyles, Grid } from "@material-ui/core";
import { UploadedFile } from "../hooks/UploadedFile";
import { makeStyles } from "@material-ui/styles";

export const PDFListDisplay = () => {

  return (
    <FileContext.Consumer>
    {(fileStore) => (
      <DragDropContext onDragEnd={(result: DropResult) => {fileStore?.reorderFiles(result.source.index, result.destination?.index)}}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
            {fileStore?.files.map((uploadedFile : UploadedFile, index : number) => (
              <PDFDisplayEntry index={index} uploadedFile={uploadedFile} key={uploadedFile.uuid} />
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