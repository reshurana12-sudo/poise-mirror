import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import CaptureStudio from "./pages/CaptureStudio";
import InsightDashboard from "./pages/InsightDashboard";
import ImprovementLab from "./pages/ImprovementLab";
import ProgressTracker from "./pages/ProgressTracker";
import ProfilePage from "./pages/ProfilePage";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/app" element={<ProtectedRoute><CaptureStudio /></ProtectedRoute>} />
            <Route path="/app/insights" element={<ProtectedRoute><InsightDashboard /></ProtectedRoute>} />
            <Route path="/app/improve" element={<ProtectedRoute><ImprovementLab /></ProtectedRoute>} />
            <Route path="/app/progress" element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>} />
            <Route path="/app/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
