import React from "react";
import { DragDropContext, DropResult} from 'react-beautiful-dnd';
import { Droppable } from "react-beautiful-dnd";
import PDFDisplayEntry from "./PDFDisplayEntry";
import { FileContext } from "../hooks/FileContext";
import { UploadedFile } from "../hooks/UploadedFile";

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