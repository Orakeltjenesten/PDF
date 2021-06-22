import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import MainFrame  from '../components/MainFrame'
import UploadBox from '../components/UploadBox'

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { Button, Typography } from '@material-ui/core'
import Logo from '../components/Logo'


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        header: {
            marginTop: theme.spacing(1),
        },
        cover: {
            position: 'relative',
            color: theme.palette.common.white,
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        img: {
            //background: `${theme.palette.colors.gradient}, url(${image}) center center/cover no-repeat scroll`,
            objectFit: 'contain',
            boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            filter: 'blur(1px)',
            zIndex: -1,
        },
        activityContainer: {
            textAlign: 'center',
            paddingTop: theme.spacing(2),
        },
        btnGroup: {
            display: 'grid',
            gap: theme.spacing(1),
            paddingTop: theme.spacing(1),
            gridTemplateColumns: 'auto auto',
        },
        button: {
            color: theme.palette.common.white,
            borderColor: theme.palette.common.white,
        },
        logoWrapper: {
            display: 'flex',
            margin: 'auto',
            marginTop: theme.spacing(2),
            maxWidth: 200,
            maxHeight: 200,
            marginBottom: theme.spacing(2),
        },
        logo: {
            minWidth: '250px',
            width: '46%',
            maxWidth: '100%',
            height: 'auto',
            margin: theme.spacing(5, 'auto'),
            [theme.breakpoints.down('md')]: {
                minWidth: '200px',
            },
        },
    }
));


export default function Home() {
    const classes = useStyles();
    return (
        <>
            <Head>
                <title>PDF Application - Upload</title>
                <meta name="PDF Application" content="Upload"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={classes.cover}>
                <UploadBox>
                    <Typography align='center' color='inherit' variant='h3'>
                    Last opp filer eller dra dem her.
                    </Typography>
                </UploadBox>
            </div>
        </>
    )
}
