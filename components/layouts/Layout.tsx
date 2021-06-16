import { ReactChild, ReactNode } from 'react';
import { ThemeProvider } from '../../hooks/ThemeContext';
import Nav from '../navigations/Nav';

export type LayoutProps = {
    children?: ReactNode;
    isLoading?: boolean;
};

const Layout = ({children}: LayoutProps) =>{
    return (
        <ThemeProvider>
            <Nav></Nav>
            {children}
        </ThemeProvider>
    );
}

export default Layout;