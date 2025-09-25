-- Fix RLS policies for government dashboard (avoid duplicate policies)

-- Enable RLS on tables that don't have it
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.issue_updates ENABLE ROW LEVEL SECURITY;

-- Add missing policies only
-- Users table policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own profile') THEN
    EXECUTE 'CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update their own profile') THEN
    EXECUTE 'CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id)';
  END IF;
END $$;

-- Issues table - add missing INSERT policy for officials and UPDATE for officials
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'issues' AND policyname = 'Officials can view all issues') THEN
    EXECUTE 'CREATE POLICY "Officials can view all issues" ON public.issues FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN (''admin'', ''official'', ''government'')))';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'issues' AND policyname = 'Officials can update any issue') THEN
    EXECUTE 'CREATE POLICY "Officials can update any issue" ON public.issues FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN (''admin'', ''official'', ''government'')))';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'issues' AND policyname = 'Users can insert issues') THEN
    EXECUTE 'CREATE POLICY "Users can insert issues" ON public.issues FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
END $$;

-- Issue updates table policies  
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'issue_updates' AND policyname = 'Officials can view all issue updates') THEN
    EXECUTE 'CREATE POLICY "Officials can view all issue updates" ON public.issue_updates FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN (''admin'', ''official'', ''government'')))';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'issue_updates' AND policyname = 'Officials can create issue updates') THEN
    EXECUTE 'CREATE POLICY "Officials can create issue updates" ON public.issue_updates FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN (''admin'', ''official'', ''government'')))';
  END IF;
END $$;

-- Profiles table policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view profiles') THEN
    EXECUTE 'CREATE POLICY "Users can view profiles" ON public.profiles FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    EXECUTE 'CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid()::text = id::text)';
  END IF;
END $$;

-- Add enums and columns
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'department_type') THEN
    CREATE TYPE department_type AS ENUM (
      'water_supply',
      'electricity', 
      'roads_transport',
      'sanitation',
      'healthcare',
      'education',
      'security',
      'environment',
      'general'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'issues' AND column_name = 'department') THEN
    ALTER TABLE public.issues ADD COLUMN department department_type DEFAULT 'general';
  END IF;
END $$;