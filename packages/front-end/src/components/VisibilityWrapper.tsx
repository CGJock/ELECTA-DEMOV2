import React from 'react';
import { useComponentVisibility } from '../context/componentVisibilityContext';

interface VisibilityWrapperProps {
  componentName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const VisibilityWrapper: React.FC<VisibilityWrapperProps> = ({ 
  componentName, 
  children, 
  fallback = null 
}) => {
  const { isComponentVisible, isLoading } = useComponentVisibility();
  
  // Si está cargando, mostrar el componente por defecto
  if (isLoading) {
    return <>{children}</>;
  }
  
  // Verificar si el componente debe ser visible en la fase activa
  const shouldShow = isComponentVisible(componentName);
  
  if (shouldShow) {
    return <>{children}</>;
  }
  
  // Si no debe mostrarse, mostrar el fallback o nada
  return <>{fallback}</>;
};

export default VisibilityWrapper;
