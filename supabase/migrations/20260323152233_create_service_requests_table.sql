/*
  # Create Service Requests Table

  ## Overview
  This migration creates the infrastructure for managing service request submissions from the RP Innovation Labs website.

  ## New Tables
  
  ### `service_requests`
  Stores all service request form submissions from potential clients.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each request
  - `name` (text, required) - Client's full name
  - `email` (text, required) - Client's email address
  - `company` (text, required) - Client's company name
  - `phone` (text, required) - Client's phone number
  - `service_type` (text, required) - Selected service (ERP Analytics, Data Ingestion, Data Transformation, Data Visualization, etc.)
  - `project_description` (text, required) - Detailed description of the project requirements
  - `status` (text, default: 'new') - Request status (new, in_progress, completed, cancelled)
  - `created_at` (timestamptz, default: now()) - Timestamp when request was submitted
  - `updated_at` (timestamptz, default: now()) - Timestamp when request was last updated
  
  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the `service_requests` table
  - Public users can insert new service requests (for form submissions)
  - Only authenticated admin users can view and update service requests
  
  ### Policies
  1. **"Anyone can submit service requests"** - Allows anonymous form submissions (INSERT only)
  2. **"Authenticated users can view all requests"** - Admin access to view all submissions
  3. **"Authenticated users can update requests"** - Admin can update request status
  
  ## Important Notes
  - The table allows public INSERT to enable form submissions without authentication
  - Email notifications will be handled via Edge Functions
  - Form validation is handled on the client side before submission
*/

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  phone text NOT NULL,
  service_type text NOT NULL,
  project_description text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to submit service requests (public form submissions)
CREATE POLICY "Anyone can submit service requests"
  ON service_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Authenticated users (admins) can view all requests
CREATE POLICY "Authenticated users can view all requests"
  ON service_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users (admins) can update requests
CREATE POLICY "Authenticated users can update requests"
  ON service_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries by status and date
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at DESC);