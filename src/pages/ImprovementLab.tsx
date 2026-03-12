import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import EmptyState from "@/components/EmptyState";
import emptyImg from "@/assets/empty-improve.png";
import { cn } from "@/lib/utils";

const categories = ["Posture", "Grooming", "Presentation", "Camera Presence"] as const;

const suggestions: Record<string, Array<{ title: string; description: string; impact: "high" | "medium"; done?: boolean }>> = {
  Posture: [
    { title: "Correct Forward Head Position", description: "Practice chin tucks 3x daily. Stand against a wall with shoulders and head touching. Hold for 30 seconds.", impact: "high" },
    { title: "Open Shoulder Alignment", description: "Roll shoulders back and down. Imagine a string pulling your chest upward. This projects confidence naturally.", impact: "high" },
    { title: "Core Engagement Habit", description: "Gently engage lower abdominals while standing. This supports spinal alignment and improves overall posture silhouette.", impact: "medium" },
  ],
  Grooming: [
    { title: "Maintain Consistent Skincare", description: "A simple routine — cleanse, moisturize, SPF — dramatically improves skin clarity and overall presentation signals.", impact: "medium" },
    { title: "Defined Facial Hair Lines", description: "Clean edges around beard or jawline create stronger structural definition and a more polished appearance.", impact: "medium" },
  ],
  Presentation: [
    { title: "Neutral Color Palette", description: "Wearing darker, solid tones near the face reduces visual noise and draws attention to your features.", impact: "medium" },
    { title: "Fit Over Fashion", description: "Well-fitted clothing on shoulders and chest creates a stronger visual silhouette than any trend.", impact: "high" },
  ],
  "Camera Presence": [
    { title: "Slight Chin Down Technique", description: "Tilting chin down 10-15° creates a stronger jawline shadow and more authoritative presence on camera.", impact: "high" },
    { title: "Eye-Level Camera Position", description: "Position camera at eye level or slightly above. Below-angle cameras create unflattering perspective distortion.", impact: "high" },
  ],
};

const ImprovementLab = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Posture");
  const [hasData] = useState(true);

  return (
    <AppLayout>
      {!hasData ? (
        <EmptyState
          illustration={emptyImg}
          title="No recommendations yet"
          description="Take your first scan to receive personalized improvement suggestions tailored to your presence."
          ctaLabel="Get Started"
          ctaPath="/app"
        />
      ) : (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold">Improvement Lab</h1>
          <p className="text-sm text-muted-foreground mt-1">Guided recommendations to enhance your presence</p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                activeCategory === cat
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          {suggestions[activeCategory]?.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="glass-panel-hover p-5 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-sm font-semibold">{item.title}</h3>
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                      item.impact === "high"
                        ? "text-primary border-primary/20 bg-primary/5"
                        : "text-muted-foreground border-border bg-secondary"
                    )}>
                      {item.impact === "high" ? "High Impact" : "Medium Impact"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 glass-panel flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium font-display">Ready to track improvement?</p>
            <p className="text-xs text-muted-foreground mt-0.5">Take another scan to compare your progress</p>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            New Scan <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
      )}
    </AppLayout>
  );
};

export default ImprovementLab;
