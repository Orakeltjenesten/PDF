import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

// Material UI Components
import { makeStyles, createStyles } from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles";
import { Button, Typography } from '@material-ui/core';

//Project components
import Logo from '../components/globals/Logo';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flex: 1,
            position: 'relative',
            color: theme.palette.primary.light,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        header: {
            marginTop: theme.spacing(1),
        },
        btnGroup: {
            display: 'grid',
            gap: theme.spacing(1),
            paddingTop: theme.spacing(1),
            gridTemplateColumns: 'auto auto',
        },
        button: {
        },
        logoWrapper: {
            display: 'flex',
            margin: 'auto',
            marginTop: theme.spacing(2),
            maxWidth: 200,
            maxHeight: 200,
            marginBottom: theme.spacing(2),
        },
    }
    ));


export default function Home() {
    const { t } = useTranslation("common");
    const classes = useStyles();
    return (
        <>
            <Head>
                <title>{t("index_title")}</title>
                <meta name={t("meta_name")} content={t("upload")} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={classes.root}>
                <div className={classes.logoWrapper}>
                    <Logo darkColor='white' lightColor='black' />
                </div>
                <Typography align='center' color='inherit' variant='h3'>
                    {t("welcome_message")}
                </Typography>
                <div className={classes.btnGroup}>
                    <Link href="/upload">
                        <Button className={classes.button} variant='outlined'>
                            {t("get_started")}
                        </Button>
                    </Link>
                </div>
            </main>
        </>
    )
}
