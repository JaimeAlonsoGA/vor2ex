import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

type RealtimeSubscriptionCallback<T> = (payload: T) => void;

export const supabaseRealtime = {
    // Subscribe to events
    subscribeToEvents: (
        supabase: SupabaseClient<Database>,
        calendarId: string,
        callback: RealtimeSubscriptionCallback<unknown>
    ) => {
        const subscription = supabase
            .channel(`events:${calendarId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'events',
                    filter: `calendar_id=eq.${calendarId}`,
                },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    },

    // Subscribe to user status
    subscribeToUserStatus: (
        supabase: SupabaseClient<Database>,
        userId: string,
        callback: RealtimeSubscriptionCallback<unknown>
    ) => {
        const subscription = supabase
            .channel(`users:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                    filter: `id=eq.${userId}`,
                },
                (payload) => {
                    callback(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    },

    // Subscribe to team changes
    subscribeToTeam: (
        supabase: SupabaseClient<Database>,
        teamId: string,
        callback: RealtimeSubscriptionCallback<unknown>
    ) => {
        const subscription = supabase
            .channel(`teams:${teamId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'teams',
                    filter: `id=eq.${teamId}`,
                },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    },
};
