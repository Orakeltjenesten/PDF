import React from "react";
import { DragDropContext, DropResult} from 'react-beautiful-dnd';
import { Droppable } from "react-beautiful-dnd";
import styles from '../styles/Home.module.css'
import PDFDisplayEntry from "./PDFDisplayEntry/PDFDisplayEntry";
import { FileContext } from "../hooks/FileContext";
import { Grid } from "@material-ui/core";
import { UploadedFile } from "../hooks/UploadedFile";


export class PDFsDisplay extends React.Component<{}, {}> {
    constructor(props: {}) {
      super(props);
    }
    pdfList(context: any) {
      return context.files.map((file : File, index : number) => 
      <PDFDisplayEntry index={index} file={file} key={file.name} />
      )
    }
    onDragEnd = (result: DropResult, context: any) => {
      if (result.destination) {
        context.reorderFiles(result.source.index, result.destination.index);
      }
    };
  
    render() {
      return (
        <FileContext.Consumer>
        {(fileStore) => (
          <DragDropContext onDragEnd={(result: DropResult) => {fileStore?.reorderFiles(result.source.index, result.destination?.index)}}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                {fileStore?.files.map((file : UploadedFile, index : number) => (
                  <PDFDisplayEntry index={index} file={file.file} key={file.file.name} />
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
      
      
}