import { createClient } from '@supabase/supabase-js'

// ✅ Your Supabase project credentials
const SUPABASE_URL = 'https://dfjldryrvjyllhxnurvj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmamxkcnlydmp5bGxoeG51cnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTkzNTUsImV4cCI6MjA3NDI5NTM1NX0._8ump1rdet4RqRcGO6nJtur5kP939wcli7ZwFwzczOo'

// ✅ Create a single Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
