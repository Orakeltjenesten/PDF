import { ReactNode, useState } from 'react';
import classnames from 'classnames';
import { useCallback } from 'react';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';


//Material UI
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/styles';
import Paper from './Paper';
import React from 'react';
import { SignalWifi4BarLockSharp } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      uploadContainer: {
        maxWidth: theme.breakpoints.values.lg,
      }
}));

export type UploadedFile = {
  file: File;
  errors: FileError[];
};


const UploadBox = () => {
  const classes = useStyles();
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <Paper className={classes.uploadContainer}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Typography variant="h2">
            <a>
              {
                isDragActive ? "Drop some files here, or click to select files" : "Drag some files here, or click to select files"
              }
            </a>
          </Typography>
        </div>
    </Paper>
  )
};

export default UploadBox;
