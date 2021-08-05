import Head from 'next/head';
import React from 'react';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import useTranslation from 'next-translate/useTranslation';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
    }
));


export default function Home() {
    const { t } = useTranslation("common");
    const classes = useStyles();
    return (
        <>
            <Head>
                <title>{t("split_title")}</title>
                <meta name={t("meta_name")} content="Split"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
        </>
    )
}
