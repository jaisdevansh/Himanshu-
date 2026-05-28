import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../components/ProtectedRoute';
import { Lock, Mail, Loader2 } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password,
      });

      login(response.data.token, response.data.admin);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface/20 p-8 rounded-lg border border-gold/10 backdrop-blur-sm shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-cream">Admin Control</h1>
          <p className="text-xs font-mono text-white/40 tracking-widest uppercase mt-2">Secure Access</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark border border-white/10 rounded px-10 py-2.5 text-sm focus:border-gold focus:outline-none text-white transition-colors"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-white/10 rounded px-10 py-2.5 text-sm focus:border-gold focus:outline-none text-white transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-gold/90 text-dark font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span className="font-mono text-xs uppercase tracking-wider">Authenticating...</span>
              </>
            ) : (
              <span className="font-mono text-xs uppercase tracking-wider">Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
