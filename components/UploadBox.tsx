import { ReactNode, useState } from 'react';
import classnames from 'classnames';
import { useCallback } from 'react';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';


//Material UI
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
}));

export type UploadedFile = {
  file: File;
  errors: FileError[];
};


const UploadBox = () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const onDrop = useCallback((accFiles:File[], rejFiles: FileRejection[]) => {
        const mappedAcc = accFiles.map(file => ({file, errors: []}));
        setFiles((curr) => [...curr, ...mappedAcc, ...rejFiles]);
    }, []);

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
      <div {...getRootProps}>
          <input {...getInputProps()}/>

          <Typography>{JSON.stringify(files)}</Typography>
      </div>
  );
};

export default UploadBox;
