import React, { useMemo, useState, useEffect, Component } from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import ThemeSettings from './ThemeSettings';
import Sidebar from './Sidebar';
import Logo from './Logo';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Box } from '@material-ui/core';

// Assets/Icons
import MenuIcon from '@material-ui/icons/MenuRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      appBar: {
        boxSizing: 'border-box',
        backgroundColor: theme.palette.colors.topbar,
        color: theme.palette.text.primary,
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 1,
      },
      transparentAppBar: {
        backgroundColor: 'transparent',
      },
      backdrop: {
        ...theme.palette.blurred,
        ...theme.palette.transparent,
        backgroundColor: `${theme.palette.colors.topbar}bf`,
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
      },
      toolbar: {
        width: '100%',
        margin: 'auto',
        padding: theme.spacing(0, 2),
        display: 'grid',
        gridTemplateColumns: '120px 1fr auto',
        gap: theme.spacing(3),
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(0, 1),
          gridTemplateColumns: '80px 1fr',
        },
      },
    
      items: {
        display: 'grid',
        gap: theme.spacing(1),
        alignItems: 'self-start',
        gridAutoFlow: 'column',
        color: theme.palette.get<string>({ light: theme.palette.common.black, dark: theme.palette.common.white }),
        width: 'fit-content',
      },
      right: {
        color: theme.palette.get<string>({ light: theme.palette.common.black, dark: theme.palette.common.white }),
        display: 'grid',
        gap: theme.spacing(1),
        gridTemplateColumns: '35px auto',
        [theme.breakpoints.down('md')]: {
          display: 'grid',
          justifyContent: 'flex-end',
        },
      },
      profileName: {
        margin: `auto ${theme.spacing(1)}px`,
        color: theme.palette.common.white,
        textAlign: 'right',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      topbarItem: {
        height: 50,
        margin: 'auto 0',
        color: 'inherit',
        fontSize: '1rem',
      },
      reverseColor: {
        color: theme.palette.get<string>({ light: theme.palette.common.black, dark: theme.palette.common.white }),
      },
}));

export type TopBarItemProps = {
  text: string;
  to: string;
};

const TopBarItem = ({ text, to }: TopBarItemProps) => {
  const classes = useStyles({});
  //const partial = useMemo(() => location.pathname.substr(0, to.length) === to, [location.pathname, to]);
  //const equal = useMemo(() => location.pathname === to, [location.pathname, to]);
  //<Button className={classes.topbarItem}color='inherit' variant={partial ? 'outlined' : 'text'}>{text}</Button>-->
  return (
      <Link href={to}>
          <Button className={classes.topbarItem}color='inherit' variant='text'>
            {text}
          </Button>
      </Link>
  );
};

export type TopbarProps = {
  variant: 'transparent' | 'dynamic' | 'filled';
};

const Topbar = ({ variant }: TopbarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const classes = useStyles();
  const [scrollLength, setScrollLength] = useState(0);

  const handleScroll = () => setScrollLength(window.pageYOffset);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollAtTop = useMemo(() => scrollLength < 20, [scrollLength]);

  const items = [
        { text: 'Upload', to: '/upload' },
        { text: 'Organize', to: '/organize' },
        { text: 'Merge', to: '/merge' },
        { text: 'Split', to: '/split' }
      ] as Array<TopBarItemProps>;

  return (
    <AppBar
      className={classnames(
        classes.appBar,
        variant !== 'filled' && scrollAtTop && !sidebarOpen && classes.transparentAppBar,
        (variant === 'filled' || !scrollAtTop) && !sidebarOpen && classes.backdrop,
      )}
      color='primary'
      elevation={0}
      position='fixed'>
      <Toolbar disableGutters>
        <div className={classes.toolbar}>
          <Logo darkColor={'white'} lightColor={'black'} />
          <Box component='div' sx={{ display: { xs: 'none', md: 'block' } }}>
            <div className={classnames(classes.items, variant === 'dynamic' && scrollAtTop && classes.reverseColor)}>
              {items.map((item, i) => (
                <TopBarItem key={i} {...item} />
              ))}
            </div>
          </Box>
          <div className={classnames(classes.right, variant === 'dynamic' && scrollAtTop && classes.reverseColor)}>
            <Box component='div' sx={{ display: { xs: 'none', md: 'block' } }}>
              <ThemeSettings className={classes.topbarItem} />
            </Box>
            <Box component='div'>
              <IconButton sx={{ display: { md: 'none', xs: 'block' } }} className={classes.topbarItem} onClick={() => setSidebarOpen((prev) => !prev)}>
                {sidebarOpen ? <CloseIcon aria-label='Lukk meny' /> : <MenuIcon aria-label='Åpne meny' />}
              </IconButton>
              <Sidebar items={items} onClose={() => setSidebarOpen(false)} open={sidebarOpen} />
            </Box>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;