import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

export function clearAuthCookies() {
    if (typeof document !== 'undefined') {
        // Clear any auth-related cookies that might exist
        const cookiesToClear = [
            'sb-auth-token',
            'sb-auth-token.0',
            'sb-auth-token.1',
        ];

        cookiesToClear.forEach((cookieName) => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        });
    }
}

export async function signOutAndClearCookies() {
    await supabase.auth.signOut();
    clearAuthCookies();
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}
