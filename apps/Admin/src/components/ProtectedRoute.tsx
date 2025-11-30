import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import { authClient } from '@/lib/auth-client';

import { DashboardLayout } from '@/components/DashboardLayout';

import { Loader2Icon } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authClient.getSession();
      setIsAuthenticated(!!session.data);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-gray-400 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
