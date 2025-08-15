'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import AdminContent from './ADMIN-components/AdminLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, admin } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Como el AuthProvider ya verifica la sesión al montar,
    // aquí solo esperamos un tick para actualizar el estado local
    setIsVerifying(false);
  }, []);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Verificando sesión...</div>
      </div>
    );
  }

  if (!isAuthenticated || !admin) {
    // Mostrar el login si no hay sesión activa
    return <AdminContent />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
