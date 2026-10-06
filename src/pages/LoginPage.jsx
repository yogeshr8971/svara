import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back to SVARA');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass rounded-3xl p-8 sm:p-10 shadow-glass-lg space-y-8 border border-white/60">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-display text-3xl font-bold tracking-widest text-charcoal-700">
              SVARA
            </span>
          </Link>
          <p className="text-xs uppercase tracking-widest text-charcoal-400 font-semibold">
            Wear Your Voice
          </p>
          <h2 className="font-display text-xl font-semibold text-charcoal-700 pt-2">Sign in to your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full justify-center">
            <span>Sign In</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        <div className="text-center text-xs text-charcoal-500 pt-2 border-t border-ivory-300/40">
          <span>New to SVARA? </span>
          <Link to="/register" className="font-semibold text-champagne-500 hover:text-champagne-600">
            Create an account & get 5 free AI credits
          </Link>
        </div>
      </div>
    </div>
  );
}
