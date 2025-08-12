import React from 'react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        {/* Logo de Electa */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-blue-100">ELECTA</span>
          </div>
        </div>
        
        {/* Mensaje Principal */}
        <h1 className="text-4xl font-bold mb-6 text-blue-50">
          En Mantenimiento
        </h1>
        
        {/* Mensaje Secundario */}
        <div className="space-y-3">
          <p className="text-xl text-blue-100 leading-relaxed">
            Disculpe la molestia, estamos realizando mejoras en nuestro sitio.
          </p>
          <p className="text-lg text-blue-200">
            Volveremos pronto con una mejor experiencia.
          </p>
        </div>
        
        {/* Indicador de Estado */}
        <div className="mt-8 p-3 bg-blue-800/50 rounded-lg border border-blue-600/30">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-200">Sitio en mantenimiento</span>
          </div>
        </div>
      </div>
    </div>
  );
}
