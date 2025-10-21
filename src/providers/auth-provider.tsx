import React, { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authKeys, useSignIn, useSignOut, useSignUp, useResetPassword, useSession, useUpdatePassword, useUser, useUserWithStrategy as useUserWithStrategy, useRefreshUser } from '@/queries/auth.queries';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface AuthContextType {
    // Auth state (from queries)
    user: ReturnType<typeof useUser>['data'];
    userWithStrategy: ReturnType<typeof useUserWithStrategy>['data'];
    session: ReturnType<typeof useSession>['data'];
    loading: boolean;

    // Auth methods (from mutations)
    signIn: ReturnType<typeof useSignIn>['mutateAsync'];
    signUp: ReturnType<typeof useSignUp>['mutateAsync'];
    signOut: () => Promise<void>;
    resetPassword: ReturnType<typeof useResetPassword>['mutateAsync'];
    updatePassword: ReturnType<typeof useUpdatePassword>['mutateAsync'];

    // Utility methods
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;

    // Loading states for mutations
    isSigningIn: boolean;
    isSigningUp: boolean;
    isSigningOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    // Queries
    const sessionQuery = useSession();
    const userQuery = useUser();
    const userWithStrategyQuery = useUserWithStrategy();

    // Mutations
    const signInMutation = useSignIn();
    const signUpMutation = useSignUp();
    const signOutMutation = useSignOut();
    const resetPasswordMutation = useResetPassword();
    const updatePasswordMutation = useUpdatePassword();
    const refreshUserMutation = useRefreshUser();

    // Setup auth state change listener
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                if (event === 'SIGNED_OUT' || !session) {
                    // Immediately clear all auth data when signed out
                    queryClient.setQueryData(authKeys.session(), null);
                    queryClient.setQueryData(authKeys.user(), null);
                    queryClient.setQueryData(authKeys.userWithStrategy(), null);
                    // Also invalidate to ensure fresh data on next sign in
                    queryClient.invalidateQueries({ queryKey: authKeys.all });
                } else {
                    // Update the session in React Query cache for sign in/token refresh
                    queryClient.setQueryData(authKeys.session(), session);

                    // Invalidate related queries to trigger refetch
                    queryClient.invalidateQueries({ queryKey: authKeys.user() });

                    if (session?.user) {
                        queryClient.invalidateQueries({ queryKey: authKeys.userWithStrategy() });
                    }
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [queryClient]);

    // Enhanced sign out function
    const handleSignOut = async () => {
        await signOutMutation.mutateAsync();
    };

    // Enhanced refresh user function
    const handleRefreshUser = async () => {
        await refreshUserMutation.mutateAsync();
    };

    // Determine overall loading state
    const loading = sessionQuery.isLoading ||
        (!!sessionQuery.data && userQuery.isLoading) ||
        (!!userQuery.data && userWithStrategyQuery.isLoading);

    // More reliable authentication check
    const isAuthenticated = !!sessionQuery.data?.user && !!userQuery.data;

    const value: AuthContextType = {
        // Auth state
        user: userQuery.data || null,
        userWithStrategy: userWithStrategyQuery.data || null,
        session: sessionQuery.data || null,
        loading,

        // Auth methods
        signIn: signInMutation.mutateAsync,
        signUp: signUpMutation.mutateAsync,
        signOut: handleSignOut,
        resetPassword: resetPasswordMutation.mutateAsync,
        updatePassword: updatePasswordMutation.mutateAsync,

        // Utility methods
        refreshUser: handleRefreshUser,
        isAuthenticated,

        // Loading states
        isSigningIn: signInMutation.isPending,
        isSigningUp: signUpMutation.isPending,
        isSigningOut: signOutMutation.isPending,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Helper hooks for common patterns
export function useAuthUser() {
    const { user } = useAuth();
    return user;
}

// export function useAuthUserTeamId() {
//     const { userWithRoles } = useAuth();
//     return userWithRoles?.team_id || null;
// }

export function useIsAuthenticated() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated;
}
