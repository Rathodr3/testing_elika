
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import ForgotPassword from './ForgotPassword';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login for:', email);
      const response = await authAPI.login(email, password);
      console.log('Login response received:', response);
      
      if (response.success) {
        // Store additional user info if available
        if (response.user) {
          localStorage.setItem('userInfo', JSON.stringify(response.user));
        }
        
        toast({
          title: "Login successful",
          description: `Welcome ${response.user?.firstName || 'back'} to the admin dashboard`,
        });
        onLoginSuccess();
      } else {
        const errorMessage = response.message || 'Invalid credentials. Please check your email and password.';
        setError(errorMessage);
        
        // Provide specific help for common issues
        if (errorMessage.includes('Invalid credentials')) {
          toast({
            title: "Login Failed",
            description: "Please check your email and password. If you're a new user, make sure your account is activated.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setError(errorMessage);
      
      // Show additional help for connection errors
      if (errorMessage.includes('backend server') || errorMessage.includes('connect')) {
        toast({
          title: "Connection Error",
          description: "Please ensure the backend server is running on port 5000",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Error",
          description: "Please check your credentials and try again",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (view === 'forgot') {
    return <ForgotPassword onBack={() => setView('login')} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-secondary-800 dark:text-white">
            Admin Login
          </CardTitle>
          <p className="text-sm text-accent dark:text-gray-400">
            Sign in to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setView('forgot')}
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </button>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Demo admin: admin@elikaengineering.com / admin123
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Or use credentials provided by your administrator
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Note: Backend server must be running on port 5000
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
