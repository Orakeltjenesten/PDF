import { MouseEvent as ReactMouseEvent, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

// Material-ui
import { makeStyles, createStyles}  from '@material-ui/styles';
import { Theme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup';

//Icons
import IconButton from '@material-ui/core/IconButton';
import LightIcon from '@material-ui/icons/WbSunnyRounded';
import DarkIcon from '@material-ui/icons/Brightness3Rounded';

// Project components
import Dialog from './Dialog';
import { useThemeSettings } from '../../hooks/ThemeContext';
import { ThemeTypes, themesDetails } from '../../containers/theme';

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

type ThemeSettingsProps = {
  className?: string;
  classNameIcon?: string;
};

function ThemeSettings({ className, classNameIcon }: ThemeSettingsProps) {
  const { t } = useTranslation("common");
  const themeSettings = useThemeSettings();
  const [open, setOpen] = useState(false);
  const [themeName, setThemeName] = useState(themeSettings.getThemeFromStorage());
  const classes = useStyles();

  const changeTheme = (e: ReactMouseEvent<HTMLElement, MouseEvent>, newThemeName: ThemeTypes) => {
    if (newThemeName) {
      setThemeName(newThemeName);
      themeSettings.set(newThemeName);

    }
  };

  return (
    <>
      <IconButton aria-label='Endre fargetema' className={className} onClick={() => setOpen(true)}>
        {themeName === 'light' ? <LightIcon className={classNameIcon} /> : <DarkIcon className={classNameIcon}/>}
      </IconButton>
      <Dialog fullWidth={false} maxWidth={false} onClose={() => setOpen(false)} open={open} titleText={t('theme')}>
        <ToggleButtonGroup aria-label='Tema' className={classes.group} exclusive onChange={changeTheme} orientation='vertical' value={themeName}>
          {themesDetails.map((theme) => (
            <ToggleButton aria-label={theme.name} key={theme.key} value={theme.key}>
              <theme.icon />
              <Typography className={classes.groupButton} variant='subtitle2'>
                {theme.name}
              </Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Dialog>
    </>
  );
}

export default ThemeSettings;
