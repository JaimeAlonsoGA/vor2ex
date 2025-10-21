import type { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { UserWithStrategy } from '@/types/composites';
import { User } from '@/types';

/**
 * Fetches the authenticated user from Supabase.
 * @param supabase - Supabase client instance
 * @returns Authenticated user or null
 */
export async function getAuthUser(supabase: SupabaseClient): Promise<SupabaseUser | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching auth user:', error);
    return null;
  }
  return data.user || null;
}

/**
 * Fetches user data with strategy from the database
 * @param supabase - Supabase client instance
 * @param userId - User ID to fetch data for
 * @returns User data with strategy
 */
export async function fetchUserWithStrategy(supabase: SupabaseClient, userId: string): Promise<UserWithStrategy> {
  // Fetch user data
  const { data: userWithStrategy, error: userError } = await supabase
    .from('users')
    .select('*, strategy:strategies(*)')
    .eq('auth_id', userId)
    .single<UserWithStrategy>();

  if (userError) {
    throw new Error(`Error fetching user data: ${userError.message}`);
  }

  return userWithStrategy;
}

/**
 * Gets the current authenticated user's data for React client
 * @param supabase The Supabase client
 * @returns The user's data with their strategy
 */
export async function getCurrentUser(supabase: SupabaseClient): Promise<UserWithStrategy> {
  const user = await getAuthUser(supabase);
  if (!user) {
    throw new Error('No authenticated user found');
  }
  return fetchUserWithStrategy(supabase, user.id);
}

/**
 * Updates user data
 * @param supabase - Supabase client instance
 * @param userId - User ID to update
 * @param updates - Updates to apply
 * @returns Updated user data
 */
export async function updateUser(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Deletes a user
 * @param supabase - Supabase client instance
 * @param userId - User ID to delete
 */
export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
}
