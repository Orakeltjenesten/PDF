import Head from 'next/head';
import React from 'react';

import { useFileContext } from '../hooks/FileContext';

// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import useTranslation from 'next-translate/useTranslation';
import { Container, Grid } from '@material-ui/core';
import SplitGrid from '../components/SplitGrid';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root:{
            paddingTop: theme.spacing(8),
        }
    }
));


export default function Home() {
    const { t } = useTranslation("common");
    const classes = useStyles();
    const fileContext = useFileContext();
    return (
        <>
            <Head>
                <title>{t("split_title")}</title>
                <meta name={t("meta_name")} content="Split"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Container className={classes.root}>
                <SplitGrid files={fileContext.files} />
            </Container>
        </>
    )
}
