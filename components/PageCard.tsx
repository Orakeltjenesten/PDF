import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardActionArea, CardContent, CardMedia, Divider } from '@material-ui/core';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";
import { UploadedFile } from '../hooks/UploadedFile';
import { useTheme } from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      root: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        boxShadow: 'none',
        borderRadius: '0',
        display: 'flex',
      },
      fullHeight: {
        height: '100%',
      },
      gutterBottom: {
        marginBottom: theme.spacing(3),
      },
      splitContainer: {
        height: '70%',
      },
      divider: {
        borderRight: '4px dashed',
      },
      selected: {
        background: 'none',
      },
      halfWidth: {
        height: '40%',
      }
      
}));

export type PageProps = {
  file: UploadedFile;
  pageNumber: number;
  last?: boolean;
  fullHeight?: boolean;
  gutterBottom?: boolean;
};

const PageCard = ({file, pageNumber, last, fullHeight, gutterBottom}: PageProps) => {
  const classes = useStyles();
  const [hover, setHover] = useState<boolean>(false);
  const [size, setSize] = useState<number>(200);
  const [selected, setSelected] = useState<boolean>(false);
  const theme = useTheme();

  const toggleSelected = () => {
    setSelected(!selected);
  }

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, [])

  return (
    <Card className={classnames(classes.root, fullHeight && classes.fullHeight, gutterBottom && classes.gutterBottom, selected && classes.selected)}>
        <CardMedia>
          <Document file={file.file} noData="">
              <Page width={250} pageNumber={pageNumber}/>
          </Document>
        </CardMedia>
        {!last && 
          <CardActionArea onClick={toggleSelected} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <CardContent className={classnames(classes.splitContainer, (hover || selected) && classes.halfWidth)}>
              <Divider orientation='vertical' className={classnames(classes.divider)} />
            </CardContent>
          </CardActionArea>
        }
    </Card>
  )
}

export default PageCard;