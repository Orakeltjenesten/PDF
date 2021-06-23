import styles from '../../styles/PDFsDisplayEntry.module.css'
import { Draggable, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import { FileContext } from "../../hooks/FileContext";

interface PDFsDisplayEntryProps {file : File, index: number};

const PDFDisplayEntry = (props: PDFsDisplayEntryProps) => {
    function download() {
      let url = window.URL.createObjectURL(props.file);
      let name = props.file.name;
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none;");
  
      // Set its download and href attributes accordingly to filename and URL of file
      a.download = name;
      a.href = url!;
      a.click();
      a.remove();
    }

    function getColor(file: File) {
      if ((file as any).lastModifiedDate == null) {
        return "0";
      }
      return '#' + (file as any).lastModifiedDate.toString(16);
    }

    return (
      <FileContext.Consumer>
        {(fileStore) => (
          <Draggable draggableId={props.file.name} index={props.index} key={props.file.name}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.dragHandleProps} 
              {...provided.draggableProps} className={`${styles.entry} ${snapshot.isDragging ? styles.entryDrag : ''}`}>
              <div className={styles.text}>
                <span title={props.file.name}>{props.file.name}</span>
              </div>
              <div className={styles.controls}> 
                <button style={{backgroundColor: getColor(props.file)}} className={styles.downloadButton} onClick={download}>⬇️</button>
                <button className={styles.splitButton} onClick={(e) => (fileStore?.splitFile(props.file))}>✂️</button>
                <button className={styles.deleteButton} onClick={(e) => (fileStore?.deleteFile(props.file))}>🗑</button>
              </div>
            </div>
          )}
          </Draggable>
        )}
        </FileContext.Consumer>
    );
  }

export default PDFDisplayEntry;