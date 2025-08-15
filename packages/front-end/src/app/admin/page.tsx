"use client"; // opcional si vas a usar hooks de React como useState

import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationToast from '@/components/NotificationToast';
import { useAuth } from '@/context/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  AdminSidebar,
  AdminContent
} from '@/components/ADMIN-components';

export default function AdminPage() {
  // Estado para el sidebar móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Estado para la sección activa
  const [activeSection, setActiveSection] = useState('site-control');
  
  // Hook para notificaciones
  const {
    notifications,
    removeNotification
  } = useNotifications();

  // Hook de autenticación
  const { admin } = useAuth();

  // Crear objeto de notificaciones para pasar a los componentes
  const notificationHandlers = {
    showSuccess: (title: string, message: string) => {
      // Aquí puedes implementar la lógica de notificaciones si es necesario
      console.log('Success:', title, message);
    },
    showError: (title: string, message: string) => {
      // Aquí puedes implementar la lógica de notificaciones si es necesario
      console.log('Error:', title, message);
    },
    showWarning: (title: string, message: string) => {
      // Aquí puedes implementar la lógica de notificaciones si es necesario
      console.log('Warning:', title, message);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Contenido principal */}
          <AdminContent 
            activeSection={activeSection}
            notifications={notificationHandlers}
          />
        </div>

        {/* Overlay para cerrar sidebar en móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Notificaciones */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
            />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}