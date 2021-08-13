import { Typography } from "@material-ui/core"
import useTranslation from "next-translate/useTranslation";
import React, { ReactNode } from "react"
import classnames from 'classnames';

// Material UI Components
import { makeStyles, createStyles } from '@material-ui/styles/';
import { Theme } from "@material-ui/core/styles/";
import { Variant } from "@material-ui/core/styles/createTypography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        padding: theme.spacing(2),
    },
    noPadding: {
        padding: 0,
    }
  })
);
interface PageTitleProps{
    text: string,
    noPadding?: boolean,
    variant?: Variant,
}

export const PageTitle = ({text, noPadding, variant}: PageTitleProps) => {
    const classes = useStyles();
    const {t} = useTranslation("common");
    return (
        <Typography className={classnames(classes.root, noPadding && noPadding)} align='center' color='inherit' variant={variant || 'h2'}>
            {t(text)}
        </Typography>
    )
}