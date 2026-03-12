import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import logoImg from '@/assets/lookslens-logo.png';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

const signupSchema = loginSchema.extend({
  name: z.string().trim().min(1, 'Name is required').max(100),
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/app" replace />;
  }

  const validate = () => {
    const schema = isLogin ? loginSchema : signupSchema;
    const data = isLogin ? { email, password } : { email, password, name };
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate('/app');
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: 'Account created',
          description: 'Check your email to verify your account.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, hsl(var(--primary) / 0.08) 0%, transparent 60%)',
        }} />

        {/* Animated orbs */}
        <motion.div
          className="absolute w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ top: '20%', left: '10%' }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(var(--strength) / 0.12), transparent 70%)' }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ bottom: '25%', right: '15%' }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <img src={logoImg} alt="LooksLens" className="w-12 h-12 rounded-xl object-contain" />
              <span className="font-display text-2xl font-semibold text-foreground">LooksLens</span>
            </div>

            <h1 className="font-display text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6">
              Unlock your
              <span className="text-gradient-primary block">visual presence</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              AI-powered analysis to help you understand and improve how the world sees you.
            </p>

            <div className="mt-12 flex flex-col gap-4">
              {[
                { icon: Sparkles, text: 'AI-powered facial analysis' },
                { icon: Eye, text: 'Track your visual improvements' },
                { icon: ArrowRight, text: 'Personalized recommendations' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <img src={logoImg} alt="LooksLens" className="w-10 h-10 rounded-xl object-contain" />
            <span className="font-display text-xl font-semibold text-foreground">LooksLens</span>
          </div>

          <div className="glass-panel p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-muted-foreground text-sm mb-8">
                  {isLogin
                    ? 'Sign in to continue your visual journey'
                    : 'Start analyzing and improving your presence'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 bg-secondary/50 border-border/60 focus:border-primary/50"
                          maxLength={100}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/60 focus:border-primary/50"
                        maxLength={255}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/60 focus:border-primary/50"
                        maxLength={128}
                      />
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 font-medium mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <span className="font-medium text-primary">
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
