"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(notification.id), 300);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.id, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-900/90 border-green-700/50';
      case 'error':
        return 'bg-red-900/90 border-red-700/50';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-700/50';
      case 'info':
        return 'bg-blue-900/90 border-blue-700/50';
      default:
        return 'bg-blue-900/90 border-blue-700/50';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(notification.id), 300);
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${getBackgroundColor()} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm">{notification.title}</h4>
            {notification.message && (
              <p className="text-slate-300 text-sm mt-1">{notification.message}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
