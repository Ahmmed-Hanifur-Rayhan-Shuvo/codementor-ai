import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithEmail, signInWithGoogle } from '../../firebase/auth';
import { trackEngagement } from '../../firebase/analytics';
import { Mail, Lock, Chrome, Loader2, AlertCircle } from 'lucide-react';  // Google → Chrome

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const { setAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { user, error } = await signInWithEmail(email, password);
      if (error) {
        setError(error);
        setAuthError(error);
      } else if (user) {
        trackEngagement('login', 'email');
        if (onSuccess) onSuccess(user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        setError(error);
        setAuthError(error);
      } else if (user) {
        trackEngagement('login', 'google');
        if (onSuccess) onSuccess(user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Sign in to continue with CodeMentor AI</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-primary/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-dark-900 text-gray-500">or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-3 bg-white/5 border border-white/10 rounded-lg font-semibold text-white hover:bg-white/10 transition flex items-center justify-center gap-3"
      >
        <Chrome className="w-5 h-5" />  {/* Google → Chrome */}
        Sign in with Google
      </button>

      <div className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-primary hover:text-primary-light transition font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;