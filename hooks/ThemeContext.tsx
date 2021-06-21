import { useCallback, useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { getCookie, setCookie } from '../utils/cookie';
import { getTheme, themes, ThemeTypes } from '../containers/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const THEME_COOKIE = 'theme-cookie';

interface ContextProps {
  getThemeFromStorage: () => ThemeTypes;
  set: (n: ThemeTypes | undefined) => void;
}

const ThemeContext = createContext<ContextProps | undefined>(undefined);

const ThemeMaker = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);


  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [selectedTheme, setSelectedTheme] = useState<ThemeTypes>('automatic');

  const getThemeType = useCallback((name: ThemeTypes | string | undefined) => {
    if (themes.includes(name as ThemeTypes)) {
      return name as ThemeTypes;
    } else {
      return undefined;
    }
  }, []);

  const updateTheme = useCallback(
    (newTheme: ThemeTypes | string | undefined) => {
      const value = getThemeType(newTheme);
      if (value !== undefined) {
        setSelectedTheme(value);
        setCookie(THEME_COOKIE, value);
      } else {
        setSelectedTheme('automatic');
        setCookie(THEME_COOKIE, 'automatic');
      }
      setMounted(true);
    },
    [getThemeType],
  );

  const getThemeFromStorage = useCallback((): ThemeTypes => {
    const value = getThemeType(getCookie(THEME_COOKIE));
    if (value !== undefined) {
      return value;
    } else {
      setCookie(THEME_COOKIE, 'automatic');
      return 'automatic';
    }
  }, [getThemeType]);

  const themeStore = { getThemeFromStorage: getThemeFromStorage, set: updateTheme};

  useEffect(() => updateTheme(getThemeFromStorage()), [getThemeFromStorage, updateTheme]);

  return (
    <ThemeContext.Provider value={themeStore}>
      <ThemeProvider theme={getTheme(selectedTheme, prefersDarkMode)} >
        {mounted && children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const useThemeSettings = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeMaker, useThemeSettings };
