import React, { ReactNode, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Document, Page, pdfjs } from 'react-pdf'
import Masonry, {MasonryProps} from 'react-masonry-css';
import { Card, CardActionArea, CardContent, CardMedia, Link, Typography, useTheme } from '@material-ui/core';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";
import { UploadedFile } from '../hooks/UploadedFile';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      root: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        boxShadow: 'none',
        borderRadius: '0',
        display: 'flex',
        width: '100%',
        maxWidth: '300px',
      },
      fullHeight: {
        height: '100%',
      },
      gutterBottom: {
        marginBottom: theme.spacing(3),
      },
      splitContainer: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      splitArea: {
        textAlign: 'center',
        transform: 'rotate(90deg)',
      },
      pdf: {
        width: '200px',
      },
      selected: {
        background: 'none',
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
  const [selected, setSelected] = useState<boolean>(false);

  const toggleSelected = () => {
    setSelected(!selected);
  }
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, [])

  return (
    <Card className={classnames(classes.root, fullHeight && classes.fullHeight, gutterBottom && classes.gutterBottom, selected && classes.selected)}>
        <Document className={classes.pdf} file={file.file} noData="">
            <Page width={200} pageNumber={pageNumber}/>
        </Document>
        {!last && 
          <CardActionArea onClick={toggleSelected} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <CardContent className={classnames(classes.splitContainer)}>
              <Typography className={classes.splitArea} variant='h5' noWrap>{(hover || selected) ? '---': '--------'}</Typography>
            </CardContent>
          </CardActionArea>
        }
    </Card>
  )
}

export default PageCard;