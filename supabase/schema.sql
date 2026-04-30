-- =====================================================
-- JOB HUNT TRACKER - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- COMPANIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    website TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);

-- =====================================================
-- RESUMES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_path TEXT NOT NULL,
    version_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);

-- =====================================================
-- APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    job_title TEXT NOT NULL,
    status TEXT DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interviewing', 'Offered', 'Rejected')),
    applied_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_company_id ON public.applications(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS for all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR COMPANIES
-- =====================================================

CREATE POLICY "Users can select their own companies"
ON public.companies FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies"
ON public.companies FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies"
ON public.companies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies"
ON public.companies FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES FOR RESUMES
-- =====================================================

CREATE POLICY "Users can select their own resumes"
ON public.resumes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
ON public.resumes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
ON public.resumes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
ON public.resumes FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES FOR APPLICATIONS
-- =====================================================

CREATE POLICY "Users can select their own applications"
ON public.applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
ON public.applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
ON public.applications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
ON public.applications FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- UPDATE EXISTING JOBS TABLE (if exists)
-- =====================================================

-- If jobs table exists, ensure it has RLS
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'jobs'
    ) THEN
        -- Enable RLS if not already
        ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
        
        -- Create policy if not exists
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE policyname = 'Users can select their own jobs'
        ) THEN
            CREATE POLICY "Users can select their own jobs"
            ON public.jobs FOR SELECT
            USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own jobs'
        ) THEN
            CREATE POLICY "Users can insert their own jobs"
            ON public.jobs FOR INSERT
            WITH CHECK (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own jobs'
        ) THEN
            CREATE POLICY "Users can update their own jobs"
            ON public.jobs FOR UPDATE
            USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own jobs'
        ) THEN
            CREATE POLICY "Users can delete their own jobs"
            ON public.jobs FOR DELETE
            USING (auth.uid() = user_id);
        END IF;
    END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

SELECT 
    'companies' as table_name,
    COUNT(*) as row_count
FROM public.companies
UNION ALL
SELECT 
    'resumes',
    COUNT(*)
FROM public.resumes
UNION ALL
SELECT 
    'applications',
    COUNT(*)
FROM public.applications
UNION ALL
SELECT 
    'jobs',
    COUNT(*)
FROM public.jobs;