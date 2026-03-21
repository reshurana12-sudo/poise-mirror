
-- Scans table to store analysis results
CREATE TABLE public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  overall_score INTEGER NOT NULL DEFAULT 0,
  symmetry_score INTEGER NOT NULL DEFAULT 0,
  jawline_score INTEGER NOT NULL DEFAULT 0,
  eye_balance_score INTEGER NOT NULL DEFAULT 0,
  posture_score INTEGER NOT NULL DEFAULT 0,
  grooming_score INTEGER NOT NULL DEFAULT 0,
  ai_summary TEXT,
  ai_coach_tip TEXT,
  suggestions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can insert own scans" ON public.scans
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own scans" ON public.scans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans" ON public.scans
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage bucket for scan photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('scan-photos', 'scan-photos', false);

-- Storage RLS: users can upload to their own folder
CREATE POLICY "Users can upload scan photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'scan-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read own scan photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'scan-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own scan photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'scan-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Index for fast user queries
CREATE INDEX idx_scans_user_id_created ON public.scans(user_id, created_at DESC);
