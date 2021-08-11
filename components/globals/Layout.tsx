import { classes } from "istanbul-lib-coverage"
import Topbar from "./Topbar"

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Theme } from "@material-ui/core/styles";
import { ReactNode } from "react";
import useTranslation from "next-translate/useTranslation";
import { autocompleteClasses } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      wrapper: {
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.background.default,
        height: '100vh',
      },
      offset: theme.mixins.toolbar,
      
      footer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4px',
        marginTop: 'auto',
      }
      
    })
    
);
export default function Layout({children} : {children: ReactNode}) {
    const classes = useStyles();
    const {t} = useTranslation("common");
  return (
    <div className={classes.wrapper}>
      <Topbar variant='dynamic'/>
      <div className={classes.offset}></div>
      <main>{children}</main>

      <footer className={classes.footer}>
        {t("with_love")}
      </footer>
    </div>
  )
}