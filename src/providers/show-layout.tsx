import { useResponsive } from '@/hooks/use-responsive';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router';

interface ShowLayoutContextType {
    showMenu: boolean;
    showHeader: boolean;
}

const defaultState: ShowLayoutContextType = {
    showMenu: true,
    showHeader: true,
};

export const ShowLayoutContext = createContext<ShowLayoutContextType>(defaultState);

interface ShowLayoutContextProviderProps {
    children: React.ReactNode;
}

const shouldShowMenu = (location: string) => {
    const hideMenuPaths = [
        /events\/[^/]+$/,
        /events\/create$/,
        /complete-form\/[^/]+$/,
        /chat\/[^/]+$/,
    ];
    return !hideMenuPaths.some((path) => path.test(location));
};

const shouldShowHeader = (location: string) => {
    const hideHeaderPaths = [
        /complete-form\/[^/]+$/,
    ];
    return !hideHeaderPaths.some((path) => path.test(location));
}


export const ShowLayoutProvider: React.FC<ShowLayoutContextProviderProps> = ({ children }) => {
    const { isPhone } = useResponsive();
    const [showMenu, setShowMenu] = useState<boolean>(defaultState.showMenu);
    const [showHeader, setShowHeader] = useState<boolean>(defaultState.showHeader);
    const location = useLocation();

    useEffect(() => {
        setShowMenu(shouldShowMenu(location.pathname));
        setShowHeader(shouldShowHeader(location.pathname));
    }, [location, isPhone]);

    const contextValue = {
        showMenu,
        setShowMenu,
        showHeader,
        setShowHeader,
    };

    return <ShowLayoutContext.Provider value={contextValue}> {children} </ShowLayoutContext.Provider>;
};


export const useShowLayout = () => {
    const context = useContext(ShowLayoutContext);
    return context;
}
