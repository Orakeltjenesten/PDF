import Head from 'next/head';
import React from 'react';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
    }
));


export default function Home() {
    const { t, i18n } = useTranslation();
    const classes = useStyles();
    return (
        <>
            <Head>
                <title>{t("PDF Application - Split")}</title>
                <meta name="PDF Application" content="Split"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
        </>
    )
}
