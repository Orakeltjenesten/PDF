import React from 'react';
import Link from 'next/link';

// Material UI Components
import { makeStyles, createStyles }  from '@material-ui/styles/';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { Theme } from "@material-ui/core/styles";

// Project components
import LanguageSettings from './LanguageSettings';
import ThemeSettings from './ThemeSettings'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
  sidebar: {
    background: theme.palette.colors.topbar,
    width: '100vw',
    overflow: 'auto',
    display: 'grid',
    gridTemplateRows: '1fr',
    height: 'calc(100%)',
  },
  root: {
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  text: {
    color: theme.palette.getContrastText(theme.palette.colors.topbar),
    fontSize: '2rem',
    textTransform: 'none',
  },
  bottomButton: {
    height: 70,
    borderRadius: 0,
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
  },
  classNameIcon: {
    fontSize: '3rem',
  },
}));

type SidebarItemProps = {
  text: string;
  to: string;
};

const SidebarItem = ({ text, to }: SidebarItemProps) => {
  const classes = useStyles();
  return (
      <Link href={to}>
        <Button
            className={classes.text}
            fullWidth
            variant='text'>
            {text}
        </Button>
      </Link>
  );
};

export type IProps = {
  items: Array<SidebarItemProps>;
  onClose: () => void;
  open: boolean;
};

const Sidebar = ({ items, onClose, open }: IProps) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Drawer anchor='top' classes={{ paper: classes.sidebar }} onClose={onClose} open={open} style={{ zIndex: theme.zIndex.drawer}}>
      <div className={classes.root}>
        {items.map((item, i) => (
          <SidebarItem key={i} {...item} />
        ))}
        <div className={classes.icon}>
          <LanguageSettings className={classes.text} classNameIcon={classes.classNameIcon} />
        </div>
        <div className={classes.icon}>
          <ThemeSettings className={classes.text} classNameIcon={classes.classNameIcon} />
        </div>
      </div>
    </Drawer>
  );
};

export default Sidebar;
