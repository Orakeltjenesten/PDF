import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardActionArea, CardContent, CardMedia, Divider } from '@material-ui/core';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";
import { UploadedFile } from '../hooks/UploadedFile';
import { useTheme } from '@material-ui/core';
import { useAlert } from '../hooks/AlertContext';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      root: {
        background: 'none',
        boxShadow: 'none',
        borderRadius: '0',
        display: 'flex',
      },
      backgroundColoring: {
        backgroundColor: 'rgba(220, 220, 220, 1)',
      },
      fullHeight: {
        height: '100%',
      },
      gutterBottom: {
        marginBottom: theme.spacing(3),
      },
      splitContainer: {
        display: 'flex',
        justifyContent: 'center',
        height: '70%',
        width: theme.spacing(6),
      },
      splitContainerSelected: {
        width: theme.spacing(12),
      },
      divider: {
        borderRight: '4px dashed',
      },
      dividerSelected: {
        borderRight: 'none',
      },
      selected: {
        background: 'none',
      },
      splitContainerHover: {
        height: '40%'
      }
      
}));

export type PageProps = {
  index: number;
  file: UploadedFile;
  pageNumber: number;
  last?: boolean;
  fullHeight?: boolean;
  gutterBottom?: boolean;
  setSplitAt: (index: number, split: boolean) => void;
  splits: number[];
}

const PageCard = ({index, file, pageNumber, last, fullHeight, gutterBottom, setSplitAt, splits}: PageProps) => {
  const classes = useStyles();
  const [hover, setHover] = useState<boolean>(false);
  const [size, setSize] = useState<number>(window.innerHeight * 0.6);
  const [selected, setSelected] = useState<boolean>(false);
  const theme = useTheme();
  
  window.addEventListener('resize', () => {
    if(window.innerWidth > theme.breakpoints.values.lg){
      setSize(window.innerHeight * 0.6);
    }
    else if(window.innerWidth > theme.breakpoints.values.sm){
      setSize(window.innerHeight * 0.6);
    }
  }); 

  useEffect(() => {
      setSelected(splits.includes(index+1));
  }, [splits]);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  return (
    <Card className={classnames(classes.root, fullHeight && classes.fullHeight, gutterBottom && classes.gutterBottom, selected && classes.selected, !last && classes.backgroundColoring)}>
        <CardMedia>
          <Document file={file.file} noData="">
              <Page height={size} pageNumber={pageNumber}/>
          </Document>
        </CardMedia>
        {!last && 
          <CardActionArea onClick={() => {setSplitAt(index, !selected);}} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <CardContent className={classnames(classes.splitContainer, hover && classes.splitContainerHover, selected && classes.splitContainerSelected)}>
              <Divider orientation='vertical' className={classnames(classes.divider, selected && classes.dividerSelected)} />
            </CardContent>
          </CardActionArea>
        }
    </Card>
  )
}

export default PageCard;