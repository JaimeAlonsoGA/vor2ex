import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ShowLayoutProvider } from './show-layout';
import { BrowserRouter as Router } from 'react-router';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { AuthProvider } from './auth-provider';
import { useResponsive } from '@/hooks/use-responsive';

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    const { isDesktop } = useResponsive();

    const toasterOptions = {
        richColors: true,
        position: isDesktop ? "bottom-left" as const : "top-center" as const,
        toastOptions: {
            style: {
                padding: isDesktop ? '12px 16px' : '8px 12px',
                width: 'fit-content',
                margin: '0 auto',
                fontSize: isDesktop ? '14px' : '13px',
                borderRadius: isDesktop ? '8px' : '6px',
                maxWidth: isDesktop ? '400px' : '90vw',
            },
        }
    };

    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {/* <ShowLayoutProvider> */}
                    {children}
                    {/* </ShowLayoutProvider> */}
                </AuthProvider>
                {/* <RegisterPWA /> */}
                <Toaster {...toasterOptions} />
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
        </Router>
    );
}