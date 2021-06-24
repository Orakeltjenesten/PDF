import React from "react";
import { DragDropContext, DropResult} from 'react-beautiful-dnd';
import { Droppable } from "react-beautiful-dnd";
import styles from '../styles/Home.module.css'
import PDFDisplayEntry from "./PDFDisplayEntry/PDFDisplayEntry";
import { FileContext } from "../hooks/FileContext";


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
        context.reorder(result.source.index, result.destination.index);
      }
    };
  
    render() {
      return (
        <FileContext.Consumer>
        {(fileStore) => (
          <DragDropContext onDragEnd={(result: DropResult) => {fileStore?.reorderFiles(result.source.index, result.destination?.index)}}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div className={styles.pdfList}
                ref={provided.innerRef} 
                {...provided.droppableProps}
                id="entries">
                {this.pdfList(fileStore)}
                {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext> 
      )
        }
        </FileContext.Consumer>
      )
    }
      
      
}