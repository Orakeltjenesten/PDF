import React, { ReactNode } from 'react';
import classnames from 'classnames';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";
import MaterialPaper from '@material-ui/core/Paper';
import { Card, FormLabel, Grid } from '@material-ui/core';
import PDFSplitDisplayEntry from './PDFSplitDisplayEntry';
import { UploadedFile } from '../hooks/UploadedFile';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      root: {
        flexGrow: 1,
      },
      paper: {
        height: 140,
        width: 100,
      },
}));

export type SplitGridProps = {
  uploadedFiles: UploadedFile[]
  className?: string;
};

const SplitGrid = ({ uploadedFiles, className }: SplitGridProps) => {
  const classes = useStyles();
  return (
    <Grid container className={classnames(classes.root, className)} spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={2}>
          {uploadedFiles.map((uploadedFile) => (
            <Card className={classes.paper}>
              <PDFSplitDisplayEntry uploadedFile={uploadedFile} index={0}></PDFSplitDisplayEntry>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SplitGrid;
