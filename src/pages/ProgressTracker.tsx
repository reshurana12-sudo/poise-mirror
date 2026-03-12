import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
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
  { label: "Symmetry", current: 87, previous: 82, trend: "up" as const, sparkline: [72, 75, 78, 80, 82, 87] },
  { label: "Posture", current: 64, previous: 58, trend: "up" as const, sparkline: [50, 52, 55, 58, 56, 64] },
  { label: "Grooming", current: 78, previous: 80, trend: "down" as const, sparkline: [74, 76, 79, 80, 79, 78] },
  { label: "Eye Balance", current: 91, previous: 89, trend: "up" as const, sparkline: [84, 86, 87, 89, 90, 91] },
];

const timeRanges = ["1W", "1M", "3M", "All"] as const;

const ProgressTracker = () => {
  const [hasData] = useState(true);
  const [activeRange, setActiveRange] = useState<string>("All");

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
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="font-display text-2xl font-semibold">Progress Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Your presence evolution over time</p>
        </div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-elevated p-6 mb-6 md:mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Overall Growth</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="score-display text-4xl text-gradient-primary">+14</span>
                <span className="text-sm text-muted-foreground">points since first scan</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-strength/10 text-strength text-xs font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              Improving
            </div>
          </div>

          {/* Time range toggles */}
          <div className="flex items-center gap-1 mb-4">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                  activeRange === range
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {range}
              </button>
            ))}
          </div>

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

        {/* Metrics Grid with Sparklines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
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
                <span className="score-display text-2xl">{m.current}</span>
                <div className="flex items-center gap-2">
                  {/* Sparkline */}
                  <div className="w-12 h-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={m.sparkline.map((v, idx) => ({ v, idx }))}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke={m.trend === "up" ? "hsl(var(--strength))" : "hsl(var(--opportunity))"}
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    m.trend === "up" ? "text-strength" : "text-opportunity"
                  )}>
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
          {/* Timeline line */}
          <div className="absolute left-[22px] top-4 bottom-4 w-px bg-border/50" />
          <div className="space-y-3">
            {scans.map((scan, i) => (
              <motion.div
                key={scan.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass-panel-hover p-4 flex items-center justify-between cursor-pointer relative"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center relative z-10 border-2 border-background">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{scan.date}</p>
                    <p className="text-xs text-muted-foreground">Presence Score: <span className="score-display">{scan.score}</span></p>
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
      </div>
      )}
    </AppLayout>
  );
};

export default ProgressTracker;
