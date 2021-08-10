import { classes } from "istanbul-lib-coverage"
import Topbar from "./Topbar"

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Theme } from "@material-ui/core/styles";
import { ReactNode } from "react";

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      wrapper: {
        background: theme.palette.background.default,
      },
    })
);
export default function Layout({children} : {children: ReactNode}) {
    const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Topbar variant='dynamic'/>
      <main>{children}</main>
    </div>
  )
}