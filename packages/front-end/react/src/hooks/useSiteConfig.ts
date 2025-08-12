"use client";

import { useState, useEffect } from 'react';

interface SiteConfig {
  accessCode: string;
  termsMessage: string;
}

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig>({
    accessCode: 'ELECTA2024',
    termsMessage: 'Al acceder a este sitio, aceptas los términos y condiciones establecidos por ELECTA.'
  });

  const [errors, setErrors] = useState<Partial<SiteConfig>>({});

  // Validar configuración
  const validateConfig = (): boolean => {
    const newErrors: Partial<SiteConfig> = {};

    if (!config.accessCode.trim()) {
      newErrors.accessCode = 'El código de acceso es requerido';
    } else if (config.accessCode.length < 6) {
      newErrors.accessCode = 'El código debe tener al menos 6 caracteres';
    }

    if (!config.termsMessage.trim()) {
      newErrors.termsMessage = 'El mensaje de términos es requerido';
    } else if (config.termsMessage.length < 20) {
      newErrors.termsMessage = 'El mensaje debe tener al menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Actualizar configuración
  const updateConfig = (updates: Partial<SiteConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    // Limpiar errores del campo actualizado
    if (updates.accessCode !== undefined) {
      setErrors(prev => ({ ...prev, accessCode: undefined }));
    }
    if (updates.termsMessage !== undefined) {
      setErrors(prev => ({ ...prev, termsMessage: undefined }));
    }
  };

  // Guardar configuración
  const saveConfig = (): boolean => {
    if (validateConfig()) {
      // Aquí iría la lógica para guardar en el backend
      localStorage.setItem('electa-site-config', JSON.stringify(config));
      return true;
    }
    return false;
  };

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem('electa-site-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
      } catch (error) {
        console.warn('Error al cargar configuración guardada:', error);
      }
    }
  }, []);

  return {
    config,
    errors,
    updateConfig,
    saveConfig,
    validateConfig
  };
};
