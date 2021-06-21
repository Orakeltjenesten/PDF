import React from "react";
import { DragDropContext, DropResult} from 'react-beautiful-dnd';
import { Droppable } from "react-beautiful-dnd";
import { PersonalVideoRounded } from "@material-ui/icons";
import styles from '../styles/Home.module.css'
import PDFsDisplayEntry from "./PDFsDisplayEntry";


export class PDFsDisplay extends React.Component<{files : File[], reorder : (from: number, to: number) => void, deleteEntry : (file: File) => void, updateSelected : (file: File) => void, split : (file : File) => void}, {}> {
    constructor(props: {files : File[], reorder : (from: number, to: number) => void, deleteEntry : (file: File) => void, updateSelected : (file: File) => void, split : (file : File) => void}) {
      super(props);
    }
    pdfList() {
      return this.props.files.map((file : File, index : number) => 
      <PDFsDisplayEntry split={this.props.split} index={index} file={file} key={file.name} clickDeleteEntry={this.props.deleteEntry} updateSelected={this.props.updateSelected} />
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
            <div className={styles.pdfList}
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