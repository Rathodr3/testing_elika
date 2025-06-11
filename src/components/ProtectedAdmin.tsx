
import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import ChangePassword from './ChangePassword';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { LogOut, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ProtectedAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking admin authentication...');
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          console.log('❌ No admin token found');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Verify token is valid by calling getCurrentUser
        const userData = await authAPI.getCurrentUser();
        console.log('✅ Admin authentication verified:', userData);
        
        setUserInfo(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Admin authentication failed:', error);
        // Clear invalid token
        authAPI.logout();
        setIsAuthenticated(false);
        
        toast({
          title: "Authentication Failed",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  const handleLoginSuccess = async () => {
    console.log('✅ Admin login successful');
    setIsAuthenticated(true);
    // Refresh user info after login
    try {
      const userData = await authAPI.getCurrentUser();
      setUserInfo(userData);
    } catch (error) {
      console.error('Failed to get user info after login:', error);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Admin logout');
    authAPI.logout();
    setIsAuthenticated(false);
    setUserInfo(null);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handlePasswordChanged = () => {
    setShowChangePassword(false);
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-accent">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔄 Showing admin login page');
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  console.log('✅ Showing admin dashboard');
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-secondary-800">
              Admin Dashboard
            </h1>
            {userInfo && (
              <p className="text-sm text-gray-600">
                Welcome, {userInfo.firstName} {userInfo.lastName} ({userInfo.role})
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <ChangePassword onCancel={() => setShowChangePassword(false)} />
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      <AdminDashboard />
    </div>
  );
};

export default ProtectedAdmin;
