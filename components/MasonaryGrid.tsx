import React, { ReactNode } from 'react';
import classnames from 'classnames';
import Masonry, {MasonryProps} from 'react-masonry-css';
import { useTheme } from '@material-ui/core';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        myMasonryGrid: {
            display: 'flex',
            width: 'auto',
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
        },
            myMasonryGridColumn: {
            backgroundClip: 'padding-box',
        },
}));

export type MasonryGridProps = {
    children: ReactNode;
    breakpoints?: MasonryProps['breakpointCols'];
  };

export default function MasonryGrid(props: MasonryGridProps) {
    const classes = useStyles();
    const theme = useTheme();
    const breakpointColumnsObj = {
        default: 4,
        [theme.breakpoints.values.xl]: 3,
        [theme.breakpoints.values.lg]: 2,
        [theme.breakpoints.values.md]: 1,
    };
    return (
        <Masonry breakpointCols={props.breakpoints || breakpointColumnsObj} className={classes.myMasonryGrid} columnClassName={classes.myMasonryGridColumn}>
            {props.children}
        </Masonry>
    );
}