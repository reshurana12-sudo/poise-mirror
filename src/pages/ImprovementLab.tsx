import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import EmptyState from "@/components/EmptyState";
import emptyImg from "@/assets/empty-improve.png";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useScans } from "@/hooks/useScans";

const ImprovementLab = () => {
  const { latestScan, loading } = useScans();
  const navigate = useNavigate();
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const hasData = !!latestScan;

  // Group suggestions by category from AI
  const { categories, suggestionsByCategory, coachTip } = useMemo(() => {
    if (!latestScan?.suggestions) return { categories: [], suggestionsByCategory: {} as Record<string, any[]>, coachTip: "" };
    const suggestions = Array.isArray(latestScan.suggestions) ? latestScan.suggestions : [];
    const grouped: Record<string, any[]> = {};
    for (const s of suggestions) {
      const cat = s.category || "General";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(s);
    }
    return {
      categories: Object.keys(grouped),
      suggestionsByCategory: grouped,
      coachTip: latestScan.ai_coach_tip || "",
    };
  }, [latestScan]);

  const [activeCategory, setActiveCategory] = useState<string>("");

  // Set default active category when data loads
  const currentCategory = activeCategory || categories[0] || "";
  const currentSuggestions = suggestionsByCategory[currentCategory] || [];

  const toggleDone = (title: string) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <AppLayout>
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasData ? (
        <EmptyState illustration={emptyImg} title="No recommendations yet" description="Take your first scan to receive personalized improvement suggestions tailored to your presence." ctaLabel="Get Started" ctaPath="/app" />
      ) : (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="font-display text-2xl font-semibold">Improvement Lab</h1>
            <p className="text-sm text-muted-foreground mt-1">Guided recommendations to enhance your presence</p>
          </div>

          {/* AI Coach Card */}
          {coachTip && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-elevated p-5 mb-6 md:mb-8 flex items-start gap-4 border-l-2 border-primary/40">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold mb-1">AI Coach Insight</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{coachTip}</p>
              </div>
            </motion.div>
          )}

          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="relative flex items-center gap-1 mb-6 md:mb-8 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-[0.97]",
                    currentCategory === cat ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {currentCategory === cat && (
                    <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-full" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          <div className="space-y-3">
            {currentSuggestions.map((item: any, i: number) => {
              const isDone = completedItems.has(item.title);
              return (
                <motion.div key={item.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }} className={cn("glass-panel-hover p-5 group transition-all", isDone && "opacity-60")}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={cn("font-display text-sm font-semibold", isDone && "line-through")}>{item.title}</h3>
                        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", item.impact === "high" ? "text-primary border-primary/20 bg-primary/5" : "text-muted-foreground border-border bg-secondary")}>
                          {item.impact === "high" ? "High Impact" : "Medium Impact"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                    <button onClick={() => toggleDone(item.title)} className={cn("w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0 active:scale-90", isDone ? "bg-strength/20 border-strength/40 text-strength" : "border-border text-muted-foreground hover:text-primary hover:border-primary/30")}>
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 p-5 glass-panel flex items-center justify-between">
            <div>
              <p className="text-sm font-medium font-display">Ready to track improvement?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Take another scan to compare your progress</p>
            </div>
            <button onClick={() => navigate("/app")} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline active:scale-[0.97] transition-transform">
              New Scan <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
};

export default ImprovementLab;
