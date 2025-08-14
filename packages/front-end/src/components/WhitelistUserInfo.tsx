'use client';

import React, { useState } from 'react';
import { User, LogOut, Shield } from 'lucide-react';
import { useWhitelistAccess } from '@/hooks/useWhitelistAccess';

export default function WhitelistUserInfo() {
  const { user, isVerified, clearVerification } = useWhitelistAccess();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isVerified || !user) {
    return null;
  }

  const handleLogout = () => {
    clearVerification();
    setShowDropdown(false);
    // Redirigir a la página de verificación
    window.location.href = '/';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg transition-colors text-white"
      >
        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-white">{user.name}</div>
          <div className="text-xs text-slate-400">{user.email}</div>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute left-0 mt-2 w-32 bg-slate-800 rounded-lg border border-slate-700 shadow-lg z-50">
          <div className="p-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors text-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdown al hacer clic fuera */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
