import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      // Profile doesn't exist yet (existing user before trigger), create it
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({ id: user.id, display_name: user.email?.split("@")[0] ?? null })
        .select()
        .single();
      setProfile(newProfile);
    } else if (data) {
      setProfile(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateDisplayName = async (name: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) {
      toast.error("Failed to update name");
    } else {
      setProfile((p) => (p ? { ...p, display_name: name } : p));
      toast.success("Name updated");
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      toast.error("Failed to save avatar");
    } else {
      setProfile((p) => (p ? { ...p, avatar_url: avatarUrl } : p));
      toast.success("Avatar updated");
    }
  };

  return { profile, loading, updateDisplayName, uploadAvatar, refetch: fetchProfile };
};
