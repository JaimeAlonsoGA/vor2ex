import { Database, Tables } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

export type TypedSupabaseClient = SupabaseClient<Database>
