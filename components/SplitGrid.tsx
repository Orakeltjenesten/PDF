import React, { ReactNode } from 'react';
import classnames from 'classnames';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";
import MaterialPaper from '@material-ui/core/Paper';
import { Card, FormLabel, Grid, Paper } from '@material-ui/core';
import PDFSplitDisplayEntry from './PDFSplitDisplayEntry';
import { UploadedFile } from '../hooks/UploadedFile';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      root: {
        flexGrow: 1,
      }
}));

export type SplitGridProps = {
  uploadedFiles: UploadedFile[]
  className?: string;
};

const SplitGrid = ({ uploadedFiles, className }: SplitGridProps) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2} alignItems="center" justifyContent="center">
      <Grid container item xs={12} spacing={2} alignItems="center" justifyContent="center">
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
