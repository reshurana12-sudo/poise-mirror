import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Settings, Bell, Shield, ChevronRight, Camera, Pencil, Check, X, LogOut } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { profile, loading, updateDisplayName, uploadAvatar } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");

  const settingsGroups = [
    { icon: Bell, label: "Notifications", desc: "Scan reminders & insights" },
    { icon: Shield, label: "Privacy", desc: "Data storage & sharing" },
    { icon: Settings, label: "Preferences", desc: "Analysis settings" },
  ];

  const handleStartEdit = () => {
    setNameValue(profile?.display_name ?? "");
    setEditingName(true);
  };

  const handleSaveName = () => {
    if (nameValue.trim()) {
      updateDisplayName(nameValue.trim());
    }
    setEditingName(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return; // silently reject >2MB
      }
      uploadAvatar(file);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const memberSince = profile?.created_at
    ? format(new Date(profile.created_at), "MMM yyyy")
    : "—";

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Your account and preferences</p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 mb-8"
        >
          {loading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <button
                onClick={handleAvatarClick}
                className="relative w-16 h-16 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center group"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-primary/60" />
                )}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-foreground" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Name & info */}
              <div className="flex-1 min-w-0">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                      autoFocus
                      className="bg-secondary/60 border border-border rounded-lg px-3 py-1.5 text-sm font-semibold font-display focus:outline-none focus:ring-1 focus:ring-primary w-full max-w-[200px]"
                    />
                    <button onClick={handleSaveName} className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditingName(false)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold truncate">
                      {profile?.display_name || "User"}
                    </h2>
                    <button
                      onClick={handleStartEdit}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email} · Member since {memberSince}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Settings */}
        <div className="space-y-2 mb-8">
          {settingsGroups.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="w-full glass-panel-hover p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        {/* Sign Out (visible on mobile as well) */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleSignOut}
          className="w-full glass-panel-hover p-4 flex items-center gap-3 text-destructive hover:bg-destructive/5"
        >
          <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium">Sign Out</p>
        </motion.button>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
