import { Typography } from "@material-ui/core"
import useTranslation from "next-translate/useTranslation";
import React from "react"



export const PageTitle = (props: {text: string}) => {
    const {t} = useTranslation("common");
    return (
        <Typography align='center' color='inherit' variant='h2'>
            {t(props.text)}
        </Typography>
    )
}