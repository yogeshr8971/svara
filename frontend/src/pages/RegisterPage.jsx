import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please complete all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      toast.success('Welcome to SVARA! 5 free AI credits have been added to your profile.');
      navigate('/playground');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-champagne-500 uppercase tracking-wider bg-champagne-100/70 px-3 py-0.5 rounded-full">
            <Sparkles size={12} />
            <span>Includes 5 Free AI Credits</span>
          </div>
          <h2 className="font-display text-xl font-semibold text-charcoal-700 pt-1">Create your profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            icon={User}
            placeholder="Aaradhya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={Lock}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full justify-center mt-2">
            <span>Register & Start Styling</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        <div className="text-center text-xs text-charcoal-500 pt-2 border-t border-ivory-300/40">
          <span>Already registered? </span>
          <Link to="/login" className="font-semibold text-champagne-500 hover:text-champagne-600">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
