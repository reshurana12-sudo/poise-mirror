import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Scan, Eye, TrendingUp, Lightbulb, Shield, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/lookslens-logo.png";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="LooksLens" className="w-7 h-7 rounded-md object-contain" />
              <span className="font-display text-sm font-semibold hidden sm:inline">LooksLens</span>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate("/app")} className="glow-ring">
            Start Analysis
            <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        {/* Hero */}
        <motion.section {...fadeUp} className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15">
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary/80 uppercase tracking-wide">About LooksLens</span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Your Personal <span className="text-gradient-primary">Presence Intelligence</span> System
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            LooksLens uses advanced visual analysis to help you understand how you present yourself, uncover hidden patterns, and guide confident self-improvement — all in a private, judgment-free environment.
          </p>
        </motion.section>

        {/* What It Does */}
        <motion.section {...fadeUp} className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold">What LooksLens Does</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A comprehensive toolkit that transforms self-awareness into actionable growth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Scan, title: "Capture & Observe", desc: "Upload or capture photos to create a visual profile. Our system analyzes posture, grooming, expression, and overall presentation." },
              { icon: Eye, title: "Deep Insights", desc: "Receive detailed breakdowns of your visual presence — from strengths to areas of opportunity — backed by pattern recognition." },
              { icon: TrendingUp, title: "Track Progress", desc: "Monitor your improvement over time with visual timelines and trend analysis that highlight your growth journey." },
            ].map((item) => (
              <div key={item.title} className="glass-panel p-6 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section {...fadeUp} className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A simple four-step process from capture to confidence.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Upload a Photo", desc: "Take or upload a photo in the Capture Studio. Your images stay private and secure." },
              { step: "02", title: "AI Analysis", desc: "Our intelligent system evaluates your visual presence across multiple dimensions." },
              { step: "03", title: "Review Insights", desc: "Explore detailed insights about your strengths, patterns, and areas for improvement." },
              { step: "04", title: "Improve & Track", desc: "Follow personalized recommendations and track your progress over time." },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-xl border border-border/50 bg-card/30 space-y-3">
                <span className="font-display text-3xl font-bold text-primary/20">{item.step}</span>
                <h3 className="font-display text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section {...fadeUp} className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold">Why Use LooksLens</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Built for anyone who wants to present their best self with confidence.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: Shield, title: "Completely Private", desc: "Your photos and data are never shared. Analysis happens securely and stays yours." },
              { icon: Lightbulb, title: "Actionable Advice", desc: "Not just scores — get specific, personalized recommendations you can act on today." },
              { icon: Zap, title: "Instant Results", desc: "Get comprehensive analysis in seconds, not days. Real-time feedback when you need it." },
              { icon: CheckCircle2, title: "Measurable Growth", desc: "Track your improvement journey with data-driven progress reports and visual timelines." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-border/40 bg-card/20">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-sm font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Use Cases */}
        <motion.section {...fadeUp} className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold">Who It's For</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: "Job Seekers", desc: "Optimize your professional headshots and presentation for interviews and LinkedIn." },
              { title: "Content Creators", desc: "Refine your on-camera presence and visual branding across platforms." },
              { title: "Self-Improvers", desc: "Build daily confidence through measurable visual growth and personal insights." },
            ].map((item) => (
              <div key={item.title} className="glass-panel p-6 space-y-3 text-center">
                <h3 className="font-display text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUp} className="text-center space-y-6 py-8">
          <h2 className="font-display text-2xl lg:text-3xl font-semibold">Ready to Understand Your Presence?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Start your first analysis in under a minute. It's private, fast, and free.</p>
          <Button size="lg" className="px-10 h-12 font-display font-medium text-base glow-ring" onClick={() => navigate("/app")}>
            Start Analysis
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.section>
      </div>
    </div>
  );
};

export default LearnMore;
