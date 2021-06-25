import React, { ReactNode, useState } from 'react';
import classnames from 'classnames';
import { useCallback } from 'react';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';
import Paper from './Paper';
import { FileContext } from "../hooks/FileContext";

//Material UI
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/styles/';
import FileIcon from '@material-ui/icons/DescriptionOutlined';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      upload: {
        [theme.breakpoints.down('lg')]: {
          width: '100%',
        },
        [theme.breakpoints.up('lg')]: {
          width: theme.breakpoints.values.lg,
        },
      },
      container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing(10,5),
        overflow: 'hidden',
        height: theme.spacing(40),
        border: theme.spacing(.5) + ' dashed ' + theme.palette.colors.topbar,
        '&:hover': {
          cursor: 'pointer',
        }
      },
      active: {
        background: theme.palette.colors.topbar,
      },
}));

export type UploadedFile = {
  file: File;
  errors: FileError[];
};


const UploadBox = () => {
  const classes = useStyles();
  const onDrop = useCallback((acceptedFiles, fileRecetions) => {
    console.log(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
        <div {...getRootProps()} className={classes.upload}>
          <Paper className={classnames(isDragActive ? classes.active : undefined, classes.container)}>
            <input {...getInputProps()} />
            <FileIcon fontSize='large'/>
            <Typography variant="h3" textAlign="center">
                {
                  isDragActive ? "Drop your files here" : "Drag files here, or click to select files"
                  }
              </Typography>
          </Paper>
        </div>
  )
};

export default UploadBox;
