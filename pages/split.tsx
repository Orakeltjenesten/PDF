import Head from 'next/head';
import React from 'react';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
    }
));


export default function Home() {
    const classes = useStyles();
    return (
        <>
            <Head>
                <title>PDF Application - Split</title>
                <meta name="PDF Application" content="Split"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
        </>
    )
}
