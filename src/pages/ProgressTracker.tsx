import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AppLayout from "@/components/AppLayout";
import EmptyState from "@/components/EmptyState";
import emptyImg from "@/assets/empty-progress.png";
import { cn } from "@/lib/utils";

const scans = [
  { date: "Mar 5, 2026", score: 78, change: 0 },
  { date: "Feb 28, 2026", score: 75, change: 3 },
  { date: "Feb 20, 2026", score: 71, change: 4 },
  { date: "Feb 12, 2026", score: 68, change: -1 },
  { date: "Feb 5, 2026", score: 69, change: 5 },
  { date: "Jan 28, 2026", score: 64, change: 0 },
];

const metrics = [
  { label: "Symmetry", current: 87, previous: 82, trend: "up" as const },
  { label: "Posture", current: 64, previous: 58, trend: "up" as const },
  { label: "Grooming", current: 78, previous: 80, trend: "down" as const },
  { label: "Eye Balance", current: 91, previous: 89, trend: "up" as const },
];

const ProgressTracker = () => {
  const [hasData] = useState(true);

  return (
    <AppLayout>
      {!hasData ? (
        <EmptyState
          illustration={emptyImg}
          title="No progress yet"
          description="Complete your first scan to start tracking your presence evolution over time."
          ctaLabel="Take Your First Scan"
          ctaPath="/app"
        />
      ) : (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold">Progress Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Your presence evolution over time</p>
        </div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Overall Growth</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-display text-4xl font-bold text-gradient-primary">+14</span>
                <span className="text-sm text-muted-foreground">points since first scan</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-strength/10 text-strength text-xs font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              Improving
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scans.slice().reverse()} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(v: string) => v.split(",")[0].split(" ").slice(0, 2).join(" ")}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[50, 100]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--primary))" }}
                  formatter={(value: number) => [`${value}`, "Score"]}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                  dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-panel p-4"
            >
              <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
              <div className="flex items-end justify-between">
                <span className="font-display text-2xl font-bold">{m.current}</span>
                <div className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  m.trend === "up" ? "text-strength" : "text-opportunity"
                )}>
                  {m.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(m.current - m.previous)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scan Timeline */}
        <h2 className="font-display text-lg font-medium mb-4">Scan History</h2>
        <div className="space-y-3">
          {scans.map((scan, i) => (
            <motion.div
              key={scan.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="glass-panel-hover p-4 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{scan.date}</p>
                  <p className="text-xs text-muted-foreground">Presence Score: {scan.score}</p>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                scan.change > 0 ? "text-strength" : scan.change < 0 ? "text-opportunity" : "text-muted-foreground"
              )}>
                {scan.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : scan.change < 0 ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                {scan.change !== 0 ? `${Math.abs(scan.change)} pts` : "No change"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      )}
    </AppLayout>
  );
};

export default ProgressTracker;
