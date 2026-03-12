import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Scan, Eye, TrendingUp } from "lucide-react";
import MirrorVisual from "@/components/MirrorVisual";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/lookslens-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, hsl(174 62% 47% / 0.06) 0%, transparent 70%)" }} />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="LooksLens" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-display text-lg font-semibold tracking-tight">LooksLens</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/app")}
        >
          Open App
        </Button>
      </motion.nav>

      {/* Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          {/* Left: Text */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                <span className="text-xs font-medium text-primary/80 tracking-wide uppercase">Intelligent Presence Analysis</span>
              </div>

              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
                Understand Your{" "}
                <span className="text-gradient-primary">Presence</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                A personal intelligence system that observes your visual presence, reveals hidden patterns, and guides confident self-improvement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <Button
                size="lg"
                className="px-8 h-12 font-display font-medium text-base glow-ring"
                onClick={() => navigate("/app")}
              >
                Start Analysis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-12 text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/learn-more")}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Features row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center gap-8 pt-8 border-t border-border/50"
            >
              {[
                { icon: Scan, label: "Observe", desc: "Capture presence" },
                { icon: Eye, label: "Understand", desc: "Visual insights" },
                { icon: TrendingUp, label: "Improve", desc: "Guided growth" },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-primary/70" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Mirror Visual */}
          <div className="flex justify-center lg:justify-end">
            <MirrorVisual />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
