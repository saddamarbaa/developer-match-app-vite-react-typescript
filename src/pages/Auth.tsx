import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'signup';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let result;
    if (mode === 'login') {
      result = await login(email, password);
    } else {
      result = await signup(email, password, name);
    }

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: mode === 'login' ? 'Welcome back!' : 'Account created!',
        description: 'Redirecting to your feed...',
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{ background: 'var(--gradient-radial)' }}
      />

      <motion.div
        className="w-full max-w-sm space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code2 className="w-10 h-10 text-primary neon-text" />
            <span className="text-3xl font-bold">
              <span className="gradient-text">Dev</span>
              <span className="text-foreground">Match</span>
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {mode === 'login' 
              ? 'Welcome back, developer!' 
              : 'Join the developer community'}
          </p>
        </div>

        {/* Form */}
        <motion.form
          className="glass-card p-6 space-y-5"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-muted-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-secondary border-border"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-secondary border-border"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="neon" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>
        </motion.form>

        {/* Toggle mode */}
        <p className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        {/* Demo hint */}
        <p className="text-center text-xs text-muted-foreground/60">
          Mock auth - use any email & 6+ char password
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
