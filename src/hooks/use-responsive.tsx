import { useEffect, useState } from 'react';

type DeviceBreakpoints = {
    isPhone: boolean;
    isTablet: boolean;
    isLaptop: boolean;
    isDesktop: boolean;
    isWide: boolean;
};

const deviceQueries = {
    phone: '(min-width: 0px)',
    tablet: '(min-width: 640px)',
    laptop: '(min-width: 1024px)',
    desktop: '(min-width: 1280px)',
    wide: '(min-width: 1536px)',
};

export function useResponsive(): DeviceBreakpoints {
    const getMatches = () => ({
        isPhone: typeof window !== 'undefined' ? window.matchMedia(deviceQueries.phone).matches : false,
        isTablet: typeof window !== 'undefined' ? window.matchMedia(deviceQueries.tablet).matches : false,
        isLaptop: typeof window !== 'undefined' ? window.matchMedia(deviceQueries.laptop).matches : false,
        isDesktop: typeof window !== 'undefined' ? window.matchMedia(deviceQueries.desktop).matches : false,
        isWide: typeof window !== 'undefined' ? window.matchMedia(deviceQueries.wide).matches : false,
    });

    const [breakpoints, setBreakpoints] = useState<DeviceBreakpoints>(getMatches);

    useEffect(() => {
        function handleResize() {
            setBreakpoints(getMatches());
        }

        const mqls = Object.values(deviceQueries).map((q) => window.matchMedia(q));
        mqls.forEach((mql) => mql.addEventListener('change', handleResize));

        handleResize();

        return () => {
            mqls.forEach((mql) => mql.removeEventListener('change', handleResize));
        };
    }, []);

    return breakpoints;
}
