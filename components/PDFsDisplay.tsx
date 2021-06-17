import React from "react";
import { PDFsDisplayEntry } from "./PDFsDisplayEntry";
import { DragDropContext, DropResult} from 'react-beautiful-dnd';
import { Droppable } from "react-beautiful-dnd";
import { PersonalVideoRounded } from "@material-ui/icons";


export class PDFsDisplay extends React.Component<{files : File[], reorder : (from: number, to: number) => void, deleteEntry : (file: File) => void, updateSelected : (file: File) => void}, {}> {
    constructor(props: {files : File[], reorder : (from: number, to: number) => void, deleteEntry : (file: File) => void, updateSelected : (file: File) => void}) {
      super(props);
    }
    pdfList() {
      return this.props.files.map((file : File, index : number) => 
      <PDFsDisplayEntry index={index} file={file} clickDeleteEntry={this.props.deleteEntry} updateSelected={this.props.updateSelected} />
      )
    }

    onDragEnd = (result: DropResult) => {
      if (result.destination) {
        this.props.reorder(result.source.index, result.destination.index);
      }
    };
  
    render() {
      return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
            ref={provided.innerRef} 
            {...provided.droppableProps}
            id="entries">
            {this.pdfList()}
            {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext> 
      )
    }
      
      
}