import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { AuthUser } from '@supabase/supabase-js';
import { getCurrentUser } from '@/services/users.service';
import { UserWithStrategy } from '@/types/composites';

// Query Keys
export const authKeys = {
    all: ['auth'] as const,
    session: () => [...authKeys.all, 'session'] as const,
    user: () => [...authKeys.all, 'user'] as const,
    userWithStrategy: () => [...authKeys.all, 'userWithStrategy'] as const,
};

// Types
interface SignInCredentials {
    email?: string;
    phone?: string;
    password: string;
}

interface SignUpCredentials {
    email?: string;
    phone?: string;
    password: string;
    metadata?: Record<string, any>;
}

interface AuthResult {
    success: boolean;
    error?: string;
    data?: any;
}

// Session Query
export function useSession() {
    return useQuery({
        queryKey: authKeys.session(),
        queryFn: async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return session;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
}

// User Query
export function useUser() {
    const { data: session } = useSession();

    return useQuery({
        queryKey: authKeys.user(),
        queryFn: () => session?.user || null,
        enabled: !!session,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// User with Roles Query
export function useUserWithStrategy() {
    const { data: user } = useUser();

    return useQuery({
        queryKey: authKeys.userWithStrategy(),
        queryFn: async (): Promise<UserWithStrategy | null> => {
            if (!user) return null;
            try {
                return await getCurrentUser(supabase);
            } catch (error) {
                console.error('Error fetching user with strategy:', error);
                return null;
            }
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

// Sign In Mutation
export function useSignIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: SignInCredentials): Promise<AuthResult> => {
            try {
                let authResult;

                if (credentials.email) {
                    authResult = await supabase.auth.signInWithPassword({
                        email: credentials.email,
                        password: credentials.password,
                    });
                } else if (credentials.phone) {
                    authResult = await supabase.auth.signInWithPassword({
                        phone: credentials.phone,
                        password: credentials.password,
                    });
                } else {
                    return { success: false, error: 'Email or phone number is required' };
                }

                if (authResult.error) {
                    return { success: false, error: authResult.error.message };
                }

                return { success: true, data: authResult.data };
            } catch (error) {
                console.error('Sign in error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Sign in failed'
                };
            }
        },
        onSuccess: () => {
            // Invalidate auth queries to refetch data
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
}

// Sign Up Mutation
export function useSignUp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: SignUpCredentials): Promise<AuthResult> => {
            try {
                let authResult;

                if (credentials.email) {
                    authResult = await supabase.auth.signUp({
                        email: credentials.email,
                        password: credentials.password,
                        options: {
                            data: credentials.metadata || {},
                        },
                    });
                } else if (credentials.phone) {
                    authResult = await supabase.auth.signUp({
                        phone: credentials.phone,
                        password: credentials.password,
                        options: {
                            data: credentials.metadata || {},
                        },
                    });
                } else {
                    return { success: false, error: 'Email or phone number is required' };
                }

                if (authResult.error) {
                    return { success: false, error: authResult.error.message };
                }

                return { success: true, data: authResult.data };
            } catch (error) {
                console.error('Sign up error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Sign up failed'
                };
            }
        },
        onSuccess: () => {
            // Invalidate auth queries to refetch data
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
}

// Sign Out Mutation
export function useSignOut() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        },
        onMutate: () => {
            // Immediately clear auth data from cache (optimistic update)
            queryClient.setQueryData(authKeys.session(), null);
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.setQueryData(authKeys.userWithStrategy(), null);
        },
        onSuccess: () => {
            // Ensure all auth data is cleared and invalidate queries
            queryClient.setQueryData(authKeys.session(), null);
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.setQueryData(authKeys.userWithStrategy(), null);
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
        onError: () => {
            // If sign out fails, refetch current auth state
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
}

// Reset Password Mutation
export function useResetPassword() {
    return useMutation({
        mutationFn: async (email: string): Promise<AuthResult> => {
            try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });

                if (error) {
                    return { success: false, error: error.message };
                }

                return { success: true };
            } catch (error) {
                console.error('Reset password error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Reset password failed'
                };
            }
        },
    });
}

// Update Password Mutation
export function useUpdatePassword() {
    return useMutation({
        mutationFn: async (password: string): Promise<AuthResult> => {
            try {
                const { error } = await supabase.auth.updateUser({ password });

                if (error) {
                    return { success: false, error: error.message };
                }

                return { success: true };
            } catch (error) {
                console.error('Update password error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Update password failed'
                };
            }
        },
    });
}

// Refresh User Data
export function useRefreshUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            // Simply invalidate to trigger refetch
            await queryClient.invalidateQueries({ queryKey: authKeys.userWithStrategy() });
        },
    });
}
