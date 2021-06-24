import React from "react";
import { DragDropContext, DropResult} from 'react-beautiful-dnd';
import { Droppable } from "react-beautiful-dnd";
import { PersonalVideoRounded } from "@material-ui/icons";
import styles from '../styles/Home.module.css'
import PDFDisplayEntry from "./PDFDisplayEntry/PDFDisplayEntry";
import FileContextWrapper, { FileContext } from "./FileContextWrapper";


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
        {(context) => (
          <DragDropContext onDragEnd={(result: DropResult) => {this.onDragEnd(result, context)}}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div className={styles.pdfList}
                ref={provided.innerRef} 
                {...provided.droppableProps}
                id="entries">
                {this.pdfList(context)}
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