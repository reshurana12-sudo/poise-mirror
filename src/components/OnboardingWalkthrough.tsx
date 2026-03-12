import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import onboardCapture from "@/assets/onboard-capture.png";
import onboardAnalyze from "@/assets/onboard-analyze.png";
import onboardInsights from "@/assets/onboard-insights.png";

const ONBOARDING_KEY = "lookslens_onboarded";

const steps = [
  {
    image: onboardCapture,
    title: "Welcome to LooksLens",
    description:
      "Take a natural photo of yourself using your camera or upload an existing one. We'll handle the rest.",
  },
  {
    image: onboardAnalyze,
    title: "AI-Powered Analysis",
    description:
      "Our analysis evaluates symmetry, posture, grooming, and more — giving you an objective presence score.",
  },
  {
    image: onboardInsights,
    title: "Get Actionable Insights",
    description:
      "See your strengths, discover opportunities, and follow guided recommendations to elevate your presence.",
  },
];

const OnboardingWalkthrough = () => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const current = steps[step];

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative w-full max-w-md glass-panel p-8 text-center"
        >
          {/* Skip button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Illustration */}
          <motion.img
            key={`img-${step}`}
            src={current.image}
            alt=""
            className="w-28 h-28 mx-auto mb-6 opacity-90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          />

          {/* Content */}
          <h2 className="font-display text-xl font-semibold mb-2">
            {current.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs mx-auto">
            {current.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? "w-6 bg-primary"
                    : i < step
                    ? "w-1.5 bg-primary/40"
                    : "w-1.5 bg-secondary"
                }`}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={next}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors glow-ring"
          >
            {step < steps.length - 1 ? (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingWalkthrough;
