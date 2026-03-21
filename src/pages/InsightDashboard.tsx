import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Ruler, Eye, Move, Sparkles, ChevronRight, X } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import AppLayout from "@/components/AppLayout";
import RadialGauge from "@/components/RadialGauge";
import EmptyState from "@/components/EmptyState";
import emptyImg from "@/assets/empty-insights.png";
import { cn } from "@/lib/utils";
import { useScans, Scan } from "@/hooks/useScans";

const iconMap: Record<string, any> = {
  "Facial Symmetry": Shield,
  "Jawline Definition": Ruler,
  "Eye Balance": Eye,
  "Posture Alignment": Move,
  "Grooming Signals": Sparkles,
};

function buildInsights(scan: Scan) {
  const items = [
    { title: "Facial Symmetry", score: scan.symmetry_score, icon: Shield },
    { title: "Jawline Definition", score: scan.jawline_score, icon: Ruler },
    { title: "Eye Balance", score: scan.eye_balance_score, icon: Eye },
    { title: "Posture Alignment", score: scan.posture_score, icon: Move },
    { title: "Grooming Signals", score: scan.grooming_score, icon: Sparkles },
  ].map((item) => ({
    ...item,
    status: (item.score >= 70 ? "strength" : "opportunity") as "strength" | "opportunity",
    context: item.score >= 90 ? "Top 8%" : item.score >= 80 ? "Top 15%" : item.score >= 70 ? "Above avg" : "Room to grow",
    description: "",
  }));
  return items;
}

const statusColors = {
  strength: "text-strength border-strength/20 bg-strength/5",
  opportunity: "text-opportunity border-opportunity/20 bg-opportunity/5",
};
const statusLabels = { strength: "Strength", opportunity: "Opportunity" };

const InsightDashboard = () => {
  const { latestScan, loading } = useScans();
  const [selectedInsight, setSelectedInsight] = useState<ReturnType<typeof buildInsights>[0] | null>(null);

  const hasData = !!latestScan;
  const insights = hasData ? buildInsights(latestScan) : [];
  const radarData = insights.map((i) => ({ subject: i.title.split(" ")[0], value: i.score, fullMark: 100 }));

  return (
    <AppLayout>
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasData ? (
        <EmptyState
          illustration={emptyImg}
          title="No insights yet"
          description="Take your first photo in the Capture Studio to get a full presence analysis with personalized insights."
          ctaLabel="Take Your First Scan"
          ctaPath="/app"
        />
      ) : (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="font-display text-2xl font-semibold">Insight Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Your presence analysis results</p>
          </div>

          {/* Presence Snapshot + Radar */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-elevated p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display text-lg font-medium">Your Presence Score</h2>
                  <p className="text-sm text-muted-foreground mt-1">Based on your latest capture</p>
                  {latestScan.ai_summary && (
                    <p className="text-xs text-primary/70 mt-3 leading-relaxed max-w-[280px]">{latestScan.ai_summary}</p>
                  )}
                </div>
                <RadialGauge score={latestScan.overall_score} />
              </div>
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {[
                  { label: "Symmetry", value: latestScan.symmetry_score, color: "bg-strength" },
                  { label: "Posture", value: latestScan.posture_score, color: "bg-opportunity" },
                  { label: "Grooming", value: latestScan.grooming_score, color: "bg-primary" },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="score-display text-sm">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: 0.5 }} className={cn("h-full rounded-full", item.color)} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="glass-panel p-6 flex flex-col">
              <h2 className="font-display text-lg font-medium mb-2">Presence Profile</h2>
              <p className="text-xs text-muted-foreground mb-4">Multi-axis analysis overview</p>
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Insight Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, i) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="glass-panel-hover p-5 cursor-pointer group"
                onClick={() => setSelectedInsight(insight)}
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
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.context}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg width="28" height="28" className="-rotate-[135deg]">
                      <circle cx="14" cy="14" r="10" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${Math.PI * 10 * 0.75} ${Math.PI * 20}`} />
                      <circle cx="14" cy="14" r="10" fill="none" stroke={insight.status === "strength" ? "hsl(var(--strength))" : "hsl(var(--opportunity))"} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(insight.score / 100) * Math.PI * 10 * 0.75} ${Math.PI * 20}`} />
                    </svg>
                    <span className="score-display text-sm">{insight.score}</span>
                    <span className="text-[10px] text-muted-foreground">{insight.context}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detail Sheet */}
          <AnimatePresence>
            {selectedInsight && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50" onClick={() => setSelectedInsight(null)} />
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed bottom-0 left-0 right-0 md:left-auto md:right-0 md:top-0 md:bottom-0 md:w-[420px] z-50 glass-elevated p-6 md:p-8 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl max-h-[80vh] md:max-h-full overflow-y-auto"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <selectedInsight.icon className="w-5 h-5 text-primary/70" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold">{selectedInsight.title}</h3>
                        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", statusColors[selectedInsight.status])}>
                          {statusLabels[selectedInsight.status]} · {selectedInsight.context}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedInsight(null)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <RadialGauge score={selectedInsight.score} size={100} strokeWidth={8} />
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">Score: {selectedInsight.score}/100 — {selectedInsight.context}</p>
                  </div>
                  {selectedInsight.status === "opportunity" && (
                    <div className="glass-surface p-4 rounded-xl border-l-2 border-opportunity/40">
                      <h4 className="text-xs font-medium text-opportunity mb-1">Improvement Tip</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Visit the Improvement Lab for personalized exercises to boost this score.</p>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </AppLayout>
  );
};

export default InsightDashboard;
