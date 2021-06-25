import { ReactNode } from 'react';
import classnames from 'classnames';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";
import MaterialPaper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
  main: {
    overflow: 'hidden',
    ...theme.palette.transparent,
  },
  blurred: {
    ...theme.palette.blurred,
  },
  padding: {
    padding: theme.spacing(3),
  },
  noBorder: {
    border: 'none',
  },
}));

export type PaperProps = {
  children: ReactNode;
  shadow?: boolean;
  blurred?: boolean;
  noPadding?: boolean;
  className?: string;
};

const Paper = ({ shadow, noPadding, blurred = false, children, className }: PaperProps) => {
  const classes = useStyles();
  return (
    <MaterialPaper
      className={classnames(classes.main, !noPadding && classes.padding, shadow && classes.noBorder, blurred && classes.blurred, className)}
      elevation={shadow ? 2 : 0}>
      {children}
    </MaterialPaper>
  );
};

export default Paper;
