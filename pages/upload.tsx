import Head from 'next/head'
import React from 'react'
import UploadBox from '../components/UploadBox'

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { Typography } from '@material-ui/core'


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
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
                <UploadBox/>
            </div>
        </>
    )
}
