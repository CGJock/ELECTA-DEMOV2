"use client";

import { useState, useCallback } from 'react';
import { Notification, NotificationType } from '@/components/NotificationToast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      id,
      type,
      title,
      message,
      duration
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper methods for common notification types
  const showSuccess = useCallback((title: string, message?: string) => {
    return addNotification('success', title, message);
  }, [addNotification]);

  const showError = useCallback((title: string, message?: string) => {
    return addNotification('error', title, message);
  }, [addNotification]);

  const showWarning = useCallback((title: string, message?: string) => {
    return addNotification('warning', title, message);
  }, [addNotification]);

  const showInfo = useCallback((title: string, message?: string) => {
    return addNotification('info', title, message);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
