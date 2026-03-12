import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Ruler, Eye, Move, Sparkles, ChevronRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import RadialGauge from "@/components/RadialGauge";
import EmptyState from "@/components/EmptyState";
import emptyImg from "@/assets/empty-insights.png";
import { cn } from "@/lib/utils";

const insights = [
  {
    title: "Facial Symmetry",
    icon: Shield,
    score: 87,
    status: "strength" as const,
    description: "Strong bilateral balance across key facial landmarks",
    detail: "Your left-right symmetry ratio is well above average, indicating harmonious proportions.",
  },
  {
    title: "Jawline Definition",
    icon: Ruler,
    score: 72,
    status: "opportunity" as const,
    description: "Good structural definition with room for enhancement",
    detail: "Mandibular angle shows solid definition. Slight asymmetry detected on the right side.",
  },
  {
    title: "Eye Balance",
    icon: Eye,
    score: 91,
    status: "strength" as const,
    description: "Excellent proportional balance between eye positioning",
    detail: "Inter-pupillary distance and canthal tilt are within ideal proportional ranges.",
  },
  {
    title: "Posture Alignment",
    icon: Move,
    score: 64,
    status: "opportunity" as const,
    description: "Forward head position detected — improvement opportunity",
    detail: "Cervical spine shows approximately 12° forward tilt from ideal vertical alignment.",
  },
  {
    title: "Grooming Signals",
    icon: Sparkles,
    score: 78,
    status: "strength" as const,
    description: "Well-maintained presentation cues detected",
    detail: "Skin clarity, hair grooming, and overall tidiness score above average.",
  },
];

const statusColors = {
  strength: "text-strength border-strength/20 bg-strength/5",
  opportunity: "text-opportunity border-opportunity/20 bg-opportunity/5",
};

const statusLabels = {
  strength: "Strength",
  opportunity: "Opportunity",
};

const InsightDashboard = () => {
  const [hasData] = useState(true); // Will be driven by real data later

  return (
    <AppLayout>
      {!hasData ? (
        <EmptyState
          illustration={emptyImg}
          title="No insights yet"
          description="Take your first photo in the Capture Studio to get a full presence analysis with personalized insights."
          ctaLabel="Take Your First Scan"
          ctaPath="/app"
        />
      ) : (
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold">Insight Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your presence analysis results</p>
        </div>

        {/* Presence Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-6 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-medium">Your Presence Snapshot</h2>
              <p className="text-sm text-muted-foreground mt-1">Based on your latest capture</p>
            </div>
            <RadialGauge score={78} />
          </div>

          {/* Score bars */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Symmetry", value: 87, color: "bg-strength" },
              { label: "Posture", value: 64, color: "bg-opportunity" },
              { label: "Grooming", value: 78, color: "bg-primary" },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Insight Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="glass-panel-hover p-5 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <insight.icon className="w-4 h-4 text-primary/70" />
                </div>
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", statusColors[insight.status])}>
                  {statusLabels[insight.status]}
                </span>
              </div>

              <h3 className="font-display text-sm font-semibold mb-1">{insight.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-12 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", insight.status === "strength" ? "bg-strength" : "bg-opportunity")}
                      style={{ width: `${insight.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{insight.score}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      )}
    </AppLayout>
  );
};

export default InsightDashboard;
