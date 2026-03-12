import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  illustration: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaPath: string;
}

const EmptyState = ({ illustration, title, description, ctaLabel, ctaPath }: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <img
        src={illustration}
        alt=""
        className="w-32 h-32 mb-8 opacity-80"
      />
      <h2 className="font-display text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">{description}</p>
      <button
        onClick={() => navigate(ctaPath)}
        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        {ctaLabel}
      </button>
    </motion.div>
  );
};

export default EmptyState;
