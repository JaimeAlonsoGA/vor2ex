import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

export type TypedSupabaseClient = SupabaseClient<Database>