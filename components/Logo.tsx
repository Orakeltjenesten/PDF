import classnames from 'classnames';

// Material UI Components
import { makeStyles, createStyles }  from '@material-ui/styles';
import { Theme } from "@material-ui/core/styles";
import { useTheme } from '@material-ui/core/styles';
import { useMemo } from 'react';

const useStyles = makeStyles<Theme, { fill: string }>((theme: Theme) => 
    createStyles({
    logo: {
        margin: 'auto 0',
        display: 'flex',
        height: '100%',
        width: '100%',
        enableBackground: 'new 0 0 242.65 44.74',
        fill: (props) => props.fill,
    },
}));

type LogoProps = {
  className?: string;
  darkColor: 'white' | 'black';
  lightColor: 'white' | 'black';
};

const Logo = ({ className, darkColor, lightColor }: LogoProps) => {
  const theme = useTheme();
  const color = useMemo(() => {
    const isDark = theme.palette.mode === 'dark';
    const prop = isDark ? darkColor : lightColor;
    if (prop === 'black') {
      return theme.palette.common.black;
    } else {
      return theme.palette.common.white;
    }
  }, [theme.palette, darkColor, lightColor]);
  const classes = useStyles({ fill: color });

  return (
    <svg 
        aria-label='NTNU Logo'
        className={classnames(classes.logo, className)}
        id='Logo'
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        viewBox= '0 0 242.65 44.74'
        x="0px" 
        y="0px"
        xmlSpace="preserve"
        >
        <g>
            <g>
                <g>
                    <path d="M33.08,0H11.02C4.94,0,0,4.94,0,11.02v22.06C0,39.17,4.94,44.1,11.02,44.1h22.06c6.09,0,11.02-4.94,11.02-11.02V11.02
                        C44.1,4.94,39.17,0,33.08,0z M33.08,33.08H11.02V11.02h22.06V33.08z"/>
                    <path d="M21.98,12.93c-5,0-9.05,4.05-9.05,9.05c0,5,4.05,9.05,9.05,9.05c5,0,9.05-4.05,9.05-9.05
                        C31.02,16.98,26.97,12.93,21.98,12.93z"/>
                </g>
                <path d="M74.96,0.05l21.48,31.22V7.25l-0.06-5.71h-6.45V0.05h13.84v1.49h-5.34l-0.06,5.71v37.18l-0.99,0.31L68.56,2.84v33.65
                    l0.06,5.9h6.64v1.49H60.93v-1.49h5.71l0.06-5.9V7.25l-0.06-5.71h-5.71V0.05H74.96z"/>
                <path d="M146.6,0.05v14.03h-1.86c-0.19-2.17-0.44-4.9-2.36-8.13c-2.23-3.79-5.28-3.97-8.26-4.1h-3.48l-0.06,5.59v28.62l0.06,6.33
                    h6.71v1.49h-20.36v-1.49h6.7l0.06-6.33V7.43l-0.06-5.59h-2.86c-3.6,0.06-6.33,0.06-8.94,4.22c-2.05,3.29-2.23,5.9-2.36,8.01h-1.8
                    V0.05H146.6z"/>
                <path d="M164.23,0.05l21.48,31.22V7.25l-0.06-5.71h-6.46V0.05h13.84v1.49h-5.34l-0.06,5.71v37.18l-0.99,0.31l-28.8-41.91v33.65
                    l0.06,5.9h6.64v1.49H150.2v-1.49h5.71l0.06-5.9V7.25l-0.06-5.71h-5.71V0.05H164.23z"/>
                <path d="M217.13,0.05v1.49h-6.15l-0.06,5.28v23.72c0.06,6.15,0.19,11.98,11.73,11.98c11.67,0,12.41-5.09,12.6-10.62V6.81
                    l-0.06-5.28h-6.27V0.05h13.71v1.49h-5.4l-0.06,5.28v22.6c-0.06,8.13-0.13,15.08-16.2,15.08c-2.29,0-7.76-0.25-11.23-1.68
                    c-5.53-2.36-5.65-7.2-5.71-13.16V6.81l-0.06-5.28h-5.34V0.05H217.13z"/>
            </g>
        </g>
    </svg>
  );
};
export default Logo;
