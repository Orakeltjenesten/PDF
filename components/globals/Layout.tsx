import { classes } from "istanbul-lib-coverage"
import Topbar from "./Topbar"

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Theme } from "@material-ui/core/styles";
import React, { ReactNode } from "react";
import useTranslation from "next-translate/useTranslation";
import { autocompleteClasses, Divider } from "@material-ui/core";
import Footer from "../Footer";
import { Head } from "next/document";

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