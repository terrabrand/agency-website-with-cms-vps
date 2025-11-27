import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, settings } = useAuth();
  const navigate = useNavigate();

  const isDark = settings.darkMode || settings.theme === 'modern-dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/client-area');
      } else {
        setError('Invalid email or password. Try admin@rictanzania.co.tz / admin123');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-[80vh] flex items-center justify-center px-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full rounded-2xl shadow-xl p-8 border ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-gray-100'}`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
          <p className="text-gray-500">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
              <a href="#" className={`text-xs ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>Forgot password?</a>
            </div>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className={`w-full py-6 text-lg ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className={`font-bold hover:underline ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create account
          </Link>
        </div>

        <div className={`mt-8 pt-6 border-t text-center ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
             <p className="text-xs text-gray-400 mb-2">Demo Credentials:</p>
             <p className="text-xs text-gray-600 font-mono bg-gray-100 inline-block px-2 py-1 rounded">admin@rictanzania.co.tz / admin123</p>
        </div>
      </div>
    </div>
  );
}