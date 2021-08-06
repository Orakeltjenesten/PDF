import { MouseEvent as ReactMouseEvent, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import setLanguage from 'next-translate/setLanguage';

// Material-ui
import { makeStyles, createStyles}  from '@material-ui/styles';
import { Theme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import NorwegianSkiing from '@material-ui/icons/DownhillSkiing';
import EnglishTea from '@material-ui/icons/EmojiFoodBeverage';
import LanguageIcon from '@material-ui/icons/Language';

// Project components
import Dialog from './Dialog';
import { getCookie, setCookie } from '../utils/cookie';

const languageCookie = "NEXT_LOCALE";

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        group: {
            background: theme.palette.secondary.main,
            margin: theme.spacing(0, 2),
        },
        groupButton: {
            margin: theme.spacing(0, 1),
            color: theme.palette.text.secondary,
        },
}));

type LanguageSettingsProps = {
  className?: string;
  classNameIcon?: string;
};

function LanguageSettings({ className, classNameIcon }: LanguageSettingsProps) {
  const { t, lang } = useTranslation("common");

  const languageDetails = [
    { key: 'no', name: t('norwegian'), icon: NorwegianSkiing},
    { key: 'en', name: t('english'), icon: EnglishTea},
  ] as const;

  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const changeLanguage = (e: ReactMouseEvent<HTMLElement, MouseEvent>, language: string) => {
    if(!window){
        return;
    }

    setCookie(languageCookie, language);
    setLanguage(language);
  };

  return (
    <>
      <IconButton aria-label={t('change_language')} className={className} onClick={() => setOpen(true)}>
        <LanguageIcon className={classNameIcon} />
      </IconButton>
      <Dialog fullWidth={false} maxWidth={false} onClose={() => setOpen(false)} open={open} titleText={t('language')}>
        <ToggleButtonGroup aria-label={t('language')} className={classes.group} exclusive onChange={changeLanguage} orientation='vertical' value={lang}>
          {languageDetails.map((language) => (
            <ToggleButton aria-label={language.name} key={language.key} value={language.key}>
              <language.icon />
              <Typography className={classes.groupButton} variant='subtitle2'>
                {language.name}
              </Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Dialog>
    </>
  );
}

export default LanguageSettings;
