import React, { ReactNode } from 'react';
import classnames from 'classnames';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";
import MaterialPaper from '@material-ui/core/Paper';
import { Card, FormLabel, Grid } from '@material-ui/core';

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
  files: File[]
  className?: string;
};

const SplitGrid = ({ files, className }: SplitGridProps) => {
  const classes = useStyles();
  return (
    <Grid container className={classnames(classes.root, className)} spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={2}>
          {files.map((file) => (
            <Grid key={file.name} item>
              <Card className={classes.paper} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SplitGrid;
