import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import AppLayout from "@/components/AppLayout";
import EmptyState from "@/components/EmptyState";
import emptyImg from "@/assets/empty-progress.png";
import { cn } from "@/lib/utils";
import { useScans } from "@/hooks/useScans";
import { format, subDays, subMonths } from "date-fns";

const timeRanges = ["1W", "1M", "3M", "All"] as const;

const ProgressTracker = () => {
  const { scans, loading } = useScans();
  const [activeRange, setActiveRange] = useState<string>("All");
  const hasData = scans.length > 0;

  const filteredScans = useMemo(() => {
    if (!hasData) return [];
    const now = new Date();
    let cutoff: Date;
    switch (activeRange) {
      case "1W": cutoff = subDays(now, 7); break;
      case "1M": cutoff = subMonths(now, 1); break;
      case "3M": cutoff = subMonths(now, 3); break;
      default: cutoff = new Date(0);
    }
    return scans.filter((s) => new Date(s.created_at) >= cutoff);
  }, [scans, activeRange, hasData]);

  const chartData = useMemo(
    () => filteredScans.slice().reverse().map((s) => ({
      date: format(new Date(s.created_at), "MMM d"),
      score: s.overall_score,
    })),
    [filteredScans]
  );

  const totalGrowth = hasData ? scans[0].overall_score - scans[scans.length - 1].overall_score : 0;

  const metrics = useMemo(() => {
    if (scans.length < 1) return [];
    const latest = scans[0];
    const prev = scans[1] ?? latest;
    return [
      { label: "Symmetry", current: latest.symmetry_score, previous: prev.symmetry_score, sparkline: scans.slice(0, 6).reverse().map((s) => s.symmetry_score) },
      { label: "Posture", current: latest.posture_score, previous: prev.posture_score, sparkline: scans.slice(0, 6).reverse().map((s) => s.posture_score) },
      { label: "Grooming", current: latest.grooming_score, previous: prev.grooming_score, sparkline: scans.slice(0, 6).reverse().map((s) => s.grooming_score) },
      { label: "Eye Balance", current: latest.eye_balance_score, previous: prev.eye_balance_score, sparkline: scans.slice(0, 6).reverse().map((s) => s.eye_balance_score) },
    ].map((m) => ({ ...m, trend: (m.current >= m.previous ? "up" : "down") as "up" | "down" }));
  }, [scans]);

  return (
    <AppLayout>
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasData ? (
        <EmptyState illustration={emptyImg} title="No progress yet" description="Complete your first scan to start tracking your presence evolution over time." ctaLabel="Take Your First Scan" ctaPath="/app" />
      ) : (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="font-display text-2xl font-semibold">Progress Tracker</h1>
            <p className="text-sm text-muted-foreground mt-1">Your presence evolution over time</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-elevated p-6 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Overall Growth</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="score-display text-4xl text-gradient-primary">{totalGrowth >= 0 ? "+" : ""}{totalGrowth}</span>
                  <span className="text-sm text-muted-foreground">points since first scan</span>
                </div>
              </div>
              <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium", totalGrowth >= 0 ? "bg-strength/10 text-strength" : "bg-opportunity/10 text-opportunity")}>
                <TrendingUp className="w-3.5 h-3.5" />
                {totalGrowth >= 0 ? "Improving" : "Declining"}
              </div>
            </div>

            <div className="flex items-center gap-1 mb-4">
              {timeRanges.map((range) => (
                <button key={range} onClick={() => setActiveRange(range)} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all duration-200", activeRange === range ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
                  {range}
                </button>
              ))}
            </div>

            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#scoreGradient)" dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }} animationDuration={1200} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {metrics.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-panel p-4">
                <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
                <div className="flex items-end justify-between">
                  <span className="score-display text-2xl">{m.current}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={m.sparkline.map((v, idx) => ({ v, idx }))}>
                          <Line type="monotone" dataKey="v" stroke={m.trend === "up" ? "hsl(var(--strength))" : "hsl(var(--opportunity))"} strokeWidth={1.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className={cn("flex items-center gap-0.5 text-xs font-medium", m.trend === "up" ? "text-strength" : "text-opportunity")}>
                      {m.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(m.current - m.previous)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scan Timeline */}
          <h2 className="font-display text-lg font-medium mb-4">Scan History</h2>
          <div className="relative">
            <div className="absolute left-[22px] top-4 bottom-4 w-px bg-border/50" />
            <div className="space-y-3">
              {filteredScans.map((scan, i) => {
                const prevScore = filteredScans[i + 1]?.overall_score ?? scan.overall_score;
                const change = scan.overall_score - prevScore;
                return (
                  <motion.div key={scan.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="glass-panel-hover p-4 flex items-center justify-between cursor-pointer relative">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center relative z-10 border-2 border-background">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{format(new Date(scan.created_at), "MMM d, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">Presence Score: <span className="score-display">{scan.overall_score}</span></p>
                      </div>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium", change > 0 ? "text-strength" : change < 0 ? "text-opportunity" : "text-muted-foreground")}>
                      {change > 0 ? <ArrowUpRight className="w-3 h-3" /> : change < 0 ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      {change !== 0 ? `${Math.abs(change)} pts` : "First scan"}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ProgressTracker;
