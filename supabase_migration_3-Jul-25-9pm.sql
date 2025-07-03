-- Migration: Create app_response table for Modernization Assessment
CREATE TABLE IF NOT EXISTS app_response (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  mnemonic text,
  description text,
  techstack text,
  remarks text,
  ownername text,
  companyname text,
  designation text,
  email text,
  phone text,
  responses text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Migration: Create ai_response table for AI Readiness Assessment
CREATE TABLE IF NOT EXISTS ai_response (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text,
  contact_name text,
  designation text,
  email text,
  phone text,
  responses text,
  created_at timestamp with time zone default timezone('utc'::text, now())
); 