'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import AdminLogin from './ADMIN-components/AdminLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, verifyToken } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        const isValid = await verifyToken();
        if (!isValid) {
          // Token inválido, ya se hizo logout en verifyToken
        }
      }
      setIsVerifying(false);
    };

    checkAuth();
  }, [isAuthenticated, verifyToken]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Verificando autenticación...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={(token, admin) => {}} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
