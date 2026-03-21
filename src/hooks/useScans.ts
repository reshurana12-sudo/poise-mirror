import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Scan {
  id: string;
  user_id: string;
  photo_url: string;
  overall_score: number;
  symmetry_score: number;
  jawline_score: number;
  eye_balance_score: number;
  posture_score: number;
  grooming_score: number;
  ai_summary: string | null;
  ai_coach_tip: string | null;
  suggestions: any[];
  created_at: string;
}

export const useScans = () => {
  const { user } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestScan, setLatestScan] = useState<Scan | null>(null);

  const fetchScans = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setScans(data as Scan[]);
      setLatestScan((data as Scan[])[0] ?? null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const uploadAndAnalyze = async (photoBlob: Blob): Promise<Scan> => {
    if (!user) throw new Error("Not authenticated");

    const ext = "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;

    // Upload photo
    const { error: uploadError } = await supabase.storage
      .from("scan-photos")
      .upload(path, photoBlob, { contentType: "image/jpeg", upsert: false });

    if (uploadError) throw new Error("Failed to upload photo: " + uploadError.message);

    // Call analysis edge function
    const { data, error } = await supabase.functions.invoke("analyze-photo", {
      body: { photoPath: path },
    });

    if (error) throw new Error(error.message || "Analysis failed");
    if (data?.error) throw new Error(data.error);

    const scan = data as Scan;
    setScans((prev) => [scan, ...prev]);
    setLatestScan(scan);
    return scan;
  };

  return { scans, latestScan, loading, fetchScans, uploadAndAnalyze };
};
