import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Scan, Eye, Lightbulb, TrendingUp, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "@/assets/lookslens-logo.png";

const navItems = [
  { icon: Scan, label: "Capture", path: "/app", key: "1" },
  { icon: Eye, label: "Insights", path: "/app/insights", key: "2" },
  { icon: Lightbulb, label: "Improve", path: "/app/improve", key: "3" },
  { icon: TrendingUp, label: "Progress", path: "/app/progress", key: "4" },
  { icon: User, label: "Profile", path: "/app/profile", key: "5" },
];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Keyboard shortcuts 1-5
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const item = navItems.find((n) => n.key === e.key);
      if (item) navigate(item.path);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Nav Rail */}
      <motion.nav
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed left-0 top-0 h-screen w-16 hidden md:flex flex-col items-center py-6 border-r border-border/50 bg-card/40 backdrop-blur-xl z-50"
      >
        {/* Logo */}
        <img
          src={logoImg}
          alt="LooksLens"
          className="w-9 h-9 rounded-lg object-contain mb-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        />

        {/* Nav Items */}
        <div className="flex-1 flex flex-col items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group relative active:scale-[0.92]",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 w-0.5 h-5 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-card border border-border text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap">
                  {item.label}
                  <span className="ml-1.5 text-muted-foreground/60">{item.key}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group relative text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:scale-[0.92]"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-card border border-border text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap">
            Sign Out
          </div>
        </button>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-16 pb-20 md:pb-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card/80 backdrop-blur-xl border-t border-border/50 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200 relative active:scale-[0.90]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
