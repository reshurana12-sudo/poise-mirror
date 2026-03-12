import { motion } from "framer-motion";
import { User, Settings, Bell, Shield, ChevronRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const ProfilePage = () => {
  const settingsGroups = [
    { icon: Bell, label: "Notifications", desc: "Scan reminders & insights" },
    { icon: Shield, label: "Privacy", desc: "Data storage & sharing" },
    { icon: Settings, label: "Preferences", desc: "Analysis settings" },
  ];

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto">
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
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <User className="w-7 h-7 text-primary/60" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Guest User</h2>
              <p className="text-sm text-muted-foreground">6 scans completed · Member since Jan 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
            {[
              { label: "Total Scans", value: "6" },
              { label: "Best Score", value: "78" },
              { label: "Growth", value: "+14" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <div className="space-y-2">
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
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
