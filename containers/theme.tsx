//Material UI components
import { createTheme } from '@material-ui/core/styles'
import darkScrollbar from '@material-ui/core/darkScrollbar';

// Icons
import DarkIcon from '@material-ui/icons/Brightness3Outlined';
import AutomaticIcon from '@material-ui/icons/PhonelinkSetupOutlined';
import LightIcon from '@material-ui/icons/WbSunnyOutlined';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    borderWidth: string;
    get: <T>({ light, dark }: { light: T; dark: T }) => T;
    blurred: {
      backdropFilter: string;
      '-webkit-backdrop-filter': string;
    };
    transparent: {
      boxShadow: string;
      border: string;
      background: string;
    };
    colors: {
      topbar: string;
      gradient: string;
    };
  }

  interface PaletteOptions {
    borderWidth: string;
    get: <T>({ light, dark }: { light: T; dark: T }) => T;
    blurred: {
      backdropFilter: string;
      '-webkit-backdrop-filter': string;
    };
    transparent: {
      boxShadow: string;
      border: string;
      background: string;
    };
    colors: {
      topbar: string;
      gradient: string;
    };
  }
}

export const themesDetails = [
  { key: 'light', name: 'Light', icon: LightIcon },
  { key: 'automatic', name: 'Auto', icon: AutomaticIcon },
  { key: 'dark', name: 'Dark', icon: DarkIcon },
] as const;

export const themes = themesDetails.map((theme) => theme.key);

export type ThemeTypes = typeof themes[number];

export const getTheme = (theme: ThemeTypes, prefersDarkMode: boolean) => {
  // eslint-disable-next-line comma-spacing
  const get = <T,>({ light, dark }: { light: T; dark: T }): T => {
    switch (theme) {
      case 'automatic':
        return prefersDarkMode ? dark : light;
      case 'dark':
        return dark;
      default:
        return light;
    }
  };

  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            wordBreak: 'break-word',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            background: get<string>({ light: '#475960', dark: '#bddde5' }),
            color: get<string>({ light: '#ffffff', dark: '#000000' }),
            fontWeight: 'bold',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // eslint-disable-next-line @typescript-eslint/ban-types
            ...get<object>({ light: {}, dark: darkScrollbar() }),
          },
          '@global': {
            html: {
              WebkitFontSmoothing: 'auto',
            },
          },
          a: {
            color: get<string>({ light: '#1D448C', dark: '#9ec0ff' }),
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: 'contained',
        },
        styleOverrides: {
          root: {
            height: 50,
            fontWeight: get<number | undefined>({ light: 500, dark: 400 }),
          },
          contained: {
            boxShadow: 'none',
          },
        },
      },
    },
    palette: {
      get,
      mode: get<'light' | 'dark'>({ light: 'light', dark: 'dark' }),
      primary: {
        main: get<string>({ light: '#475960', dark: '#bddde5' }),
        contrastText: get<string>({ light: '#ffffff', dark: '#000000' }),
      },
      secondary: {
        main: get<string>({ light: '#e1edec', dark: '#465163' }),
      },
      error: {
        main: get<string>({ light: '#F71735', dark: '#ff6060' }),
      },
      text: {
        primary: get<string>({ light: '#000000', dark: '#ffffff' }),
        secondary: get<string>({ light: '#333333', dark: '#cccccc' }),
      },
      blurred: {
        backdropFilter: `blur(5px)`,
        '-webkit-backdrop-filter': `blur(5px)`,
      },
      transparent: {
        background: get<string>({ light: '#f6f5f350', dark: '#61616160' }),
        border: get<string>({ light: '1px solid #d7d7d75c', dark: '1px solid #4545453b' }),
        boxShadow: `0 8px 32px 0 ${get<string>({ light: '#cab2e7', dark: '#26292d' })}52`,
      },
      borderWidth: '1px',
      background: {
        default: get<string>({ light: 'linear-gradient(45deg, rgba(209,234,235,1) 0%, rgba(207,218,241,1) 100%)', dark: 'linear-gradient(45deg, rgba(72,39,119,1) 0%, rgba(0,80,158,1) 100%)' }),
        paper: get<string>({ light: '#f6f5f3', dark: '#232323' }),
      },
      colors: {
        topbar: get<string>({ light: '#F6F5F3', dark: '#26292d' }),
        gradient: get<string>({ light: 'linear-gradient(to bottom, #adbcdf82, #abc8c073)', dark: 'linear-gradient(to bottom, #160202ab, #07072769)' }),
      },
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      h1: {
        fontSize: '3.1rem',
        fontWeight: 800,
      },
      h2: {
        fontSize: '2.2rem',
        fontWeight: 700,
      },
      h3: {
        fontSize: '1.5rem',
      },
    },
  });
};
