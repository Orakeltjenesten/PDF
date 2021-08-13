import classnames from 'classnames';
import { DragDropContext, Draggable, DraggableProps, DraggableProvided, DraggableRubric, DraggableStateSnapshot, DragStart, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';

// Material UI Components
import { makeStyles, createStyles }  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { Box} from '@material-ui/core';
import { UploadedFile } from '../hooks/UploadedFile';
import PageCard from '../components/PageCard';
import React, { useRef } from 'react';
import { areEqual, VariableSizeList, FixedSizeList } from 'react-window';
import memoize from 'memoize-one';
import { ResetTvOutlined } from '@material-ui/icons';

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
        },
        [theme.breakpoints.up('lg')]:  {
            maxHeight: 600,
        },
        [theme.breakpoints.down('lg')]: {
            maxHeight: 500,
        },
      },
      dragging: {
          background: 'none',
      },
      placeholder: {
          height: 400,
          width: 400,
          backgroundColor: 'green',
      }
    })
  );

interface PageCardDroppableProps {
    reorderFiles: (from: number, to: number) => void;
    horizontalScrollId: string;
    handleWheelEvent: (e: any) => void;
    pages: UploadedFile[];
    setSplitAt: (index: number, split: boolean) => void;
    moveSplitTo: (from: number, to: number) => void;
    splits: number[];
}


interface ColumnProps {
    data: ItemDataProps;
    index: number;
    style: React.CSSProperties;
}

interface ItemDataProps {
    pages: UploadedFile[];
    setSplitAt: (index: number, split: boolean) => void; 
    splits: number[];
}

const Column = React.memo(function Column(props: ColumnProps) {

    const { data, index, style} = props;
    const {pages, setSplitAt, splits} = data;
    const page = pages[index];
    const classes = useStyles();

    return (
      <Draggable draggableId={page.uuid} index={index} key={page.uuid} >
        {(drProvided, snapshot) => (
        <div ref={drProvided.innerRef} {...drProvided.draggableProps} {...drProvided.dragHandleProps} style={Object.assign({}, style, drProvided.draggableProps.style)} className={classnames(snapshot.isDragging && classes.dragging)}>
          <PageCard splits={splits} setSplitAt={setSplitAt} index={index} file={page} pageNumber={1} last={snapshot.isDragging || index === pages.length-1}/>
        </div>
        )}
      </Draggable>
    );
  }, areEqual);

export const PageCardDroppable = (props: PageCardDroppableProps) => {
    const {reorderFiles, horizontalScrollId, handleWheelEvent, pages, setSplitAt, moveSplitTo, splits} = props;
    const classes = useStyles({});
    const createItemData = memoize((props: ItemDataProps) => ({pages, setSplitAt, splits}));
    const itemData = createItemData({pages, setSplitAt, splits});
    const listRef = useRef<any>();
    return (
    <DragDropContext 
    onDragEnd={(result: DropResult) => {
        if (result.destination && result.destination.index !== result.source.index) {
            reorderFiles(result.source.index, result.destination!.index);
            moveSplitTo(result.source.index, result.destination!.index);
            if (listRef.current != null) {
                for (let i=Math.min(result.source.index, result.destination.index); i < Math.max(result.source.index, result.destination.index); i++) {
                    listRef.current.resetAfterIndex(i);
                }
            }
        }
    }}>
        <Box id={horizontalScrollId} onWheel={handleWheelEvent} className={classes.list}>
            <Droppable 
                droppableId="droppable"
                direction="horizontal"
                mode="virtual"
                renderClone={(provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => (
                    <Box ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} className={classnames(classes.dragging)}>
                        <PageCard splits={splits} setSplitAt={setSplitAt} index={rubric.source.index} file={pages[rubric.source.index]} pageNumber={1} last={snapshot.isDragging || rubric.source.index === pages.length-1}/>
                    </Box>
            )}>
                {(provided) => (
                    <VariableSizeList<ItemDataProps>
                        layout="horizontal"
                        outerRef={provided.innerRef} 
                        itemData={itemData}
                        height={600} 
                        width={window.innerWidth} 
                        itemSize={(i) => ((pages[i].getPage(0).getWidth()) / pages[i].getPage(0).getHeight() * 600 + 50)} 
                        itemCount={pages.length}
                        ref={listRef}
                    >
                        {Column}
                    </VariableSizeList>
                )
                }
            </Droppable>
        </Box>
    </DragDropContext>
    );
}