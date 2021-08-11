import classnames from 'classnames';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

// Material UI Components
import { makeStyles, createStyles }  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { Box} from '@material-ui/core';
import { UploadedFile } from '../hooks/UploadedFile';
import PageCard from '../components/PageCard';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      list: {
        display: 'flex',
        width: '100vw',
        overflowX: 'hidden',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        padding: theme.spacing(6, 6, 0, 6),
        '&:hover': {
            overflowX: 'auto',
        }
      },
      dragging: {
          background: 'none',
      },
    })
  );

interface PageCardDroppableProps {
    reorderFiles: (from: number, to: number) => void;
    horizontalScrollId: string;
    handleWheelEvent: (e: any) => void;
    pages: UploadedFile[];
    setSplitAt: (index: number, split: boolean) => void;
}

export const PageCardDroppable = (props: PageCardDroppableProps) => {
    const {reorderFiles, horizontalScrollId, handleWheelEvent, pages, setSplitAt} = props;

    const classes = useStyles({});

    return (
    <DragDropContext onDragEnd={(result: DropResult) => {reorderFiles(result.source.index, result.destination!.index)}}>
        <Droppable droppableId="droppable" direction="horizontal">
            {(provided) => (
            <Box id={horizontalScrollId} onWheel={handleWheelEvent} ref={provided.innerRef} {...provided.droppableProps} className={classes.list}>
                {pages.map((page, index) => (
                    <Draggable draggableId={page.name} index={index} key={page.name} >
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} className={classnames(snapshot.isDragging && classes.dragging)}>
                                <PageCard setSplitAt={setSplitAt} index={index} file={page} pageNumber={1} last={snapshot.isDragging || index === pages.length-1}/>
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </Box>
            )
            }
        </Droppable>
    </DragDropContext>
    );
}