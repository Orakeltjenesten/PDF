// Material UI Components
import { makeStyles, createStyles}  from '@material-ui/styles/';
import { Container, Typography } from '@material-ui/core'
import { Theme } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';

import useTranslation from "next-translate/useTranslation";


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
        },
        content: {
            width: '100%',
            padding: theme.spacing(1),
            display: 'grid',
            gap: theme.spacing(1),
            gridTemplateColumns: '1fr',
            color: theme.palette.text.primary,
            maxWidth: theme.breakpoints.values.md,
            margin: 'auto',
        },
    })
);

const Footer = () => {
  const classes = useStyles();
  const {t} = useTranslation("common");

  return (
    <footer className={classes.root}>
        <Container maxWidth="lg">
            <Divider variant='middle' />
            <div className={classes.content}>
                <Typography align='center' variant='caption'>
                    {t("footer")}
                </Typography>
            </div>
        </Container>
    </footer>
  );
};

export default Footer;
