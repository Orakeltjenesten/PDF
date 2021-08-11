import React, { ReactNode } from 'react';
import classnames from 'classnames';
import Masonry from 'react-masonry-css';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";
import MaterialPaper from '@material-ui/core/Paper';
import { Card, FormLabel, Grid, Icon, Paper } from '@material-ui/core';
import PDFSplitDisplayEntry from './PDFSplitDisplayEntry';
import { UploadedFile } from '../hooks/UploadedFile';
import { PlaceOutlined, WbSunny } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      root: {
        flexGrow: 1,
      },
      container: {

      },
      item:{

      }
      
}));

export type SplitGridProps = {
  uploadedFiles: UploadedFile[]
  className?: string;
};

const SplitGrid = ({ uploadedFiles, className }: SplitGridProps) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} alignItems="center" justifyContent="center">
      <Grid container item xs={12} alignItems="center" justifyContent="center" className={classes.container}>
          {uploadedFiles.map((uploadedFile, index) => (
            <Grid key={uploadedFile.uuid} item>
              <PDFSplitDisplayEntry uploadedFiles={uploadedFiles} uploadedFile={uploadedFile} index={index}></PDFSplitDisplayEntry>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};

export default SplitGrid;
