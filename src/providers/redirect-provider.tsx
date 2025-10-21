import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const RedirectContext = createContext<{
    redirectTo: string | null;
    setRedirectTo: (url: string | null) => void;
}>({
    redirectTo: null,
    setRedirectTo: () => { },
});

export const RedirectProvider = ({ children }: { children: React.ReactNode }) => {
    const [redirectTo, setRedirectTo] = useState<string | null>(null);
    const location = useLocation();


    useEffect(() => {
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
            setRedirectTo(location.pathname);
        }
    }, [location.pathname]);

    return (
        <RedirectContext.Provider value={{ redirectTo, setRedirectTo }}>
            {children}
        </RedirectContext.Provider>
    );
}

export const useRedirect = () => {
    return useContext(RedirectContext).redirectTo;
}