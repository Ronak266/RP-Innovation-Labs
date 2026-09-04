-- Public requests are now validated, rate-limited, persisted, and mailed only by
-- the Edge Function using the service-role key. No browser role may access rows.
DROP POLICY IF EXISTS "Anyone can submit service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Authenticated users can view all requests" ON public.service_requests;
DROP POLICY IF EXISTS "Authenticated users can update requests" ON public.service_requests;

REVOKE ALL ON public.service_requests FROM anon, authenticated;

ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS delivery_status text NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'sent', 'failed')),
  ADD COLUMN IF NOT EXISTS delivery_error text;

CREATE TABLE IF NOT EXISTS public.service_request_rate_limits (
  request_key text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_request_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.service_request_rate_limits FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_service_request_rate_limit(
  request_key text,
  max_attempts integer DEFAULT 5,
  window_seconds integer DEFAULT 900
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_row public.service_request_rate_limits%ROWTYPE;
BEGIN
  INSERT INTO public.service_request_rate_limits (request_key, attempts)
  VALUES (request_key, 1)
  ON CONFLICT (request_key) DO UPDATE
  SET attempts = CASE
      WHEN public.service_request_rate_limits.window_started_at < now() - make_interval(secs => window_seconds)
      THEN 1
      ELSE public.service_request_rate_limits.attempts + 1
    END,
    window_started_at = CASE
      WHEN public.service_request_rate_limits.window_started_at < now() - make_interval(secs => window_seconds)
      THEN now()
      ELSE public.service_request_rate_limits.window_started_at
    END,
    updated_at = now()
  RETURNING * INTO current_row;

  RETURN current_row.attempts <= max_attempts;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_service_request_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_service_request_rate_limit(text, integer, integer) TO service_role;

