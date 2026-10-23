import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY // (or maybe REACT_APP_SUPABASE_KEY)

export const supabase = createClient(supabaseUrl, supabaseKey)