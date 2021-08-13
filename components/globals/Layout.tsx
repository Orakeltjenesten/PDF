import React, { ReactNode } from "react";

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles';
import { Theme } from "@material-ui/core/styles";

//Project Components
import Footer from "../Footer";
import Topbar from "./Topbar"

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      wrapper: {
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.background.default,
        minHeight: '100vh',
      },
      offset: theme.mixins.toolbar,
    })
    
);
export default function Layout({children} : {children: ReactNode}) {
    const classes = useStyles();
  return (
    <>
    <div className={classes.wrapper}>
      <Topbar variant='dynamic'/>
      <div className={classes.offset}/>
      {children}
      <Footer />
    </div>
    </>
  )
}